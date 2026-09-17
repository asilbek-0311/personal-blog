import { GoogleGenAI, Modality } from '@google/genai';
import { AGENT_NAME, PROFILE } from '@/content/profile';
import { projects } from '@/content/projects';
import { buildSystemPrompt } from '@/lib/agent/prompt';
import { createRateLimiter } from '@/lib/agent/rate-limit';
import { getPosts } from '@/lib/posts';
import { upstreamStatus } from '../chat/upstream';

const LIVE_MODEL = process.env.GEMINI_LIVE_MODEL ?? 'gemini-3.8-live';
// Prebuilt Gemini voice. Male-sounding options include Charon, Orus, Puck and Fenrir.
const LIVE_VOICE = process.env.GEMINI_LIVE_VOICE ?? 'Charon';

// Voice chat bills by the minute, so it is limited harder than the text chat.
// Set VOICE_SESSIONS_PER_HOUR to tune it; the limit is off while developing.
const SESSIONS_PER_HOUR = Number(process.env.VOICE_SESSIONS_PER_HOUR ?? 12);
const limiter = createRateLimiter({ limit: SESSIONS_PER_HOUR, windowMs: 60 * 60_000 });
const limitEnabled = process.env.NODE_ENV === 'production' && SESSIONS_PER_HOUR > 0;
const TOKEN_MINUTES = 10;

let client: GoogleGenAI | null = null;
let systemPrompt: Promise<string> | null = null;

function getClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

function getSystemPrompt(): Promise<string> {
  systemPrompt ??= getPosts().then((posts) =>
    buildSystemPrompt({ agentName: AGENT_NAME, profile: PROFILE, projects, posts }),
  );
  return systemPrompt;
}

const jsonError = (error: string, status: number) => Response.json({ error }, { status });

/**
 * Mints a short-lived token so the browser can open a Live API socket itself.
 * The real key never leaves the server, and the token is locked to one session
 * with the model, voice and system prompt fixed here.
 */
export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  if (limitEnabled && !limiter.check(ip).allowed) {
    return jsonError("That's a lot of talking! Come back in a little while.", 429);
  }

  const ai = getClient();
  if (!ai) {
    console.error('[live] GEMINI_API_KEY is not set');
    return jsonError('Voice chat is not configured right now.', 503);
  }

  const now = Date.now();
  try {
    const token = await ai.authTokens.create({
      config: {
        uses: 1,
        expireTime: new Date(now + TOKEN_MINUTES * 60_000).toISOString(),
        newSessionExpireTime: new Date(now + 60_000).toISOString(),
        liveConnectConstraints: {
          model: LIVE_MODEL,
          config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: LIVE_VOICE } } },
            systemInstruction: await getSystemPrompt(),
          },
        },
        httpOptions: { apiVersion: 'v1alpha' },
      },
    });

    if (!token.name) throw new Error('token response had no name');
    return Response.json({ token: token.name, model: LIVE_MODEL }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (error) {
    console.error('[live] could not create token', error);
    const status = upstreamStatus(error);
    if (status === 429) return jsonError("I've hit today's usage limit for voice. Try again later.", 429);
    if (status === 401 || status === 403) return jsonError('Voice chat is not configured right now.', 503);
    return jsonError('Voice chat could not start. Please try again.', 502);
  }
}
