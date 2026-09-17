import { GoogleGenAI } from '@google/genai';
import { AGENT_NAME, PROFILE } from '@/content/profile';
import { projects } from '@/content/projects';
import { buildSystemPrompt } from '@/lib/agent/prompt';
import { createRateLimiter } from '@/lib/agent/rate-limit';
import { parseChatRequest } from '@/lib/agent/validate';
import { getPosts } from '@/lib/posts';

const MODEL = process.env.GEMINI_MODEL ?? 'gemini-2.5-flash';
const limiter = createRateLimiter({ limit: 20, windowMs: 10 * 60_000 });

let client: GoogleGenAI | null = null;
let systemPrompt: Promise<string> | null = null;

function getClient(): GoogleGenAI | null {
  if (!process.env.GEMINI_API_KEY) return null;
  client ??= new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  return client;
}

function getSystemPrompt(): Promise<string> {
  // Posts ship with the deployment, so build the prompt once per instance.
  systemPrompt ??= getPosts().then((posts) =>
    buildSystemPrompt({ agentName: AGENT_NAME, profile: PROFILE, projects, posts }),
  );
  return systemPrompt;
}

const jsonError = (error: string, status: number, headers?: HeadersInit) =>
  Response.json({ error }, { status, headers });

export async function POST(request: Request) {
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || 'anonymous';
  const rate = limiter.check(ip);
  if (!rate.allowed) {
    return jsonError('I need a short breather. Try again in a few minutes.', 429, {
      'Retry-After': String(Math.ceil(rate.retryAfterMs / 1000)),
    });
  }

  const parsed = parseChatRequest(await request.json().catch(() => null));
  if (!parsed.ok) return jsonError(parsed.error, 400);

  const ai = getClient();
  if (!ai) {
    console.error('[chat] GEMINI_API_KEY is not set');
    return jsonError('Chat is not configured right now.', 503);
  }

  let chunks: AsyncGenerator<{ text?: string }>;
  try {
    chunks = await ai.models.generateContentStream({
      model: MODEL,
      contents: parsed.messages.map((m) => ({ role: m.role, parts: [{ text: m.content }] })),
      config: {
        systemInstruction: await getSystemPrompt(),
        temperature: 0.8,
        maxOutputTokens: 700,
        thinkingConfig: { thinkingBudget: 0 },
        abortSignal: request.signal,
      },
    });
  } catch (error) {
    console.error('[chat] Gemini request failed', error);
    return jsonError('My connection glitched. Please try again.', 502);
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      try {
        for await (const chunk of chunks) {
          if (chunk.text) controller.enqueue(encoder.encode(chunk.text));
        }
      } catch (error) {
        if (!request.signal.aborted) {
          console.error('[chat] Gemini stream failed', error);
          controller.enqueue(encoder.encode('\n\n(Lost my train of thought. Ask me again?)'));
        }
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: { 'Content-Type': 'text/plain; charset=utf-8', 'Cache-Control': 'no-store' },
  });
}
