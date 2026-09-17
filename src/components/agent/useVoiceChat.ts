'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { base64ToPcm16, bytesToBase64, downsample, floatToPcm16, pcm16ToFloat32 } from '@/lib/agent/audio';

export type VoiceStatus = 'off' | 'connecting' | 'listening' | 'speaking';

const INPUT_RATE = 16_000;
const OUTPUT_RATE = 24_000;
const CHUNK_FRAMES = 2048;

/** Worklet that forwards microphone frames to the main thread in bigger batches. */
const RECORDER_WORKLET = `
class Recorder extends AudioWorkletProcessor {
  constructor() {
    super();
    this.buffer = new Float32Array(${CHUNK_FRAMES});
    this.offset = 0;
  }
  process(inputs) {
    const channel = inputs[0]?.[0];
    if (!channel) return true;
    for (let i = 0; i < channel.length; i += 1) {
      this.buffer[this.offset++] = channel[i];
      if (this.offset === this.buffer.length) {
        this.port.postMessage(this.buffer.slice(0));
        this.offset = 0;
      }
    }
    return true;
  }
}
registerProcessor('recorder', Recorder);
`;

interface LiveSession {
  sendRealtimeInput(input: { audio: { data: string; mimeType: string } }): void;
  close(): void;
}

/**
 * Two-way voice chat with the Gemini Live API. The browser gets a short-lived
 * token from our server, opens the socket itself, streams microphone audio up
 * and plays the reply as it arrives.
 */
export function useVoiceChat() {
  const [status, setStatus] = useState<VoiceStatus>('off');
  const [error, setError] = useState<string | null>(null);

  const sessionRef = useRef<LiveSession | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const inputCtxRef = useRef<AudioContext | null>(null);
  const outputCtxRef = useRef<AudioContext | null>(null);
  const playheadRef = useRef(0);
  const sourcesRef = useRef<AudioBufferSourceNode[]>([]);

  const stop = useCallback(() => {
    sessionRef.current?.close();
    sessionRef.current = null;
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
    sourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch {
        // already finished
      }
    });
    sourcesRef.current = [];
    void inputCtxRef.current?.close();
    void outputCtxRef.current?.close();
    inputCtxRef.current = null;
    outputCtxRef.current = null;
    playheadRef.current = 0;
    setStatus('off');
  }, []);

  useEffect(() => stop, [stop]);

  /** Drops anything still queued, so the visitor can talk over the reply. */
  const clearPlayback = useCallback(() => {
    sourcesRef.current.forEach((source) => {
      try {
        source.stop();
      } catch {
        // already finished
      }
    });
    sourcesRef.current = [];
    playheadRef.current = 0;
    setStatus('listening');
  }, []);

  const play = useCallback((base64: string) => {
    const context = outputCtxRef.current;
    if (!context) return;

    const samples = pcm16ToFloat32(base64ToPcm16(base64));
    const buffer = context.createBuffer(1, samples.length, OUTPUT_RATE);
    buffer.copyToChannel(samples, 0);

    const source = context.createBufferSource();
    source.buffer = buffer;
    source.connect(context.destination);

    const startAt = Math.max(context.currentTime, playheadRef.current);
    source.start(startAt);
    playheadRef.current = startAt + buffer.duration;
    sourcesRef.current.push(source);
    setStatus('speaking');

    source.onended = () => {
      sourcesRef.current = sourcesRef.current.filter((s) => s !== source);
      if (sourcesRef.current.length === 0) setStatus((current) => (current === 'speaking' ? 'listening' : current));
    };
  }, []);

  const start = useCallback(async () => {
    if (status !== 'off') return;
    setError(null);
    setStatus('connecting');

    try {
      const response = await fetch('/api/live-token', { method: 'POST' });
      const body = (await response.json()) as { token?: string; model?: string; error?: string };
      if (!response.ok || !body.token || !body.model) throw new Error(body.error ?? 'Could not start voice chat.');

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { channelCount: 1, echoCancellation: true, noiseSuppression: true },
      });
      streamRef.current = stream;

      // Loaded on demand so the SDK stays out of the main page bundle.
      const { GoogleGenAI } = await import('@google/genai');
      const ai = new GoogleGenAI({ apiKey: body.token, httpOptions: { apiVersion: 'v1alpha' } });

      const outputCtx = new AudioContext({ sampleRate: OUTPUT_RATE });
      outputCtxRef.current = outputCtx;
      await outputCtx.resume();

      const session = (await ai.live.connect({
        model: body.model,
        callbacks: {
          onmessage: (message) => {
            if (message.serverContent?.interrupted) clearPlayback();
            for (const part of message.serverContent?.modelTurn?.parts ?? []) {
              if (part.inlineData?.data) play(part.inlineData.data);
            }
          },
          onerror: () => {
            setError('The voice connection dropped.');
            stop();
          },
          onclose: () => stop(),
        },
      })) as unknown as LiveSession;
      sessionRef.current = session;

      const inputCtx = new AudioContext();
      inputCtxRef.current = inputCtx;
      await inputCtx.audioWorklet.addModule(URL.createObjectURL(new Blob([RECORDER_WORKLET], { type: 'text/javascript' })));
      const recorder = new AudioWorkletNode(inputCtx, 'recorder');
      recorder.port.onmessage = (event: MessageEvent<Float32Array>) => {
        const pcm = floatToPcm16(downsample(event.data, inputCtx.sampleRate, INPUT_RATE));
        sessionRef.current?.sendRealtimeInput({
          audio: { data: bytesToBase64(new Uint8Array(pcm.buffer)), mimeType: `audio/pcm;rate=${INPUT_RATE}` },
        });
      };
      inputCtx.createMediaStreamSource(stream).connect(recorder);

      setStatus('listening');
    } catch (err) {
      console.error('[voice]', err);
      const message = err instanceof Error ? err.message : 'Could not start voice chat.';
      setError(
        message.includes('Permission') || message.includes('NotAllowed')
          ? 'I need microphone access to talk.'
          : message,
      );
      stop();
    }
  }, [status, play, clearPlayback, stop]);

  return { status, error, start, stop };
}
