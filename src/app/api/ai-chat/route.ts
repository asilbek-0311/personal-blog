// src/app/api/ai-chat/route.ts
import { NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';

// Initialize the new client
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_INSTRUCTION = `You are an AI assistant on Asilbek's personal website terminal. You help visitors learn about Asilbek in a conversational and helpful way.

About Asilbek:
- Role: Developer & Blockchain Enthusiast
- Technical Skills: JavaScript, TypeScript, React, Next.js, Blockchain, Web3, Smart Contracts
- Interests: Building web applications, blockchain technology, DATs (Digital Asset Treasuries), writing technical content
- Has a blog where he shares insights about technology and development
- Currently working on various blockchain and web development projects

Guidelines:
- Keep responses concise (2-3 sentences max) to fit the terminal aesthetic.
- Be friendly and conversational.
- If asked about specific projects or blog posts, suggest using terminal commands: "/articles", "/about" or "/projects".
- For contact info, suggest typing "contact" command.
- Stay in character as a terminal-based assistant.`;

// ⚠️ Note: In production (Vercel/Netlify), this Map will be wiped on every redeploy/cold start.
// Use Redis (e.g., Vercel KV or Upstash) for persistent chat history.
const conversations = new Map<string, any[]>();

export async function POST(request: Request) {
  try {
    const { message, sessionId = 'default' } = await request.json();

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json(
        { response: 'AI service is not configured.' },
        { status: 500 }
      );
    }

    // 1. Get History
    let history = conversations.get(sessionId);
    if (!history) {
      history = [];
      conversations.set(sessionId, history);
    }

    // 2. Prepare Contents (The new SDK is stateless by default for generateContent)
    // We construct the full conversation history to send as context.
    const contents = [
      ...history,
      { role: 'user', parts: [{ text: message }] }
    ];

    // 3. Call the Model (Gemini 2.5 Flash)
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION, // System prompt goes here now
        temperature: 1.0, // Default for 2.5 models
        maxOutputTokens: 200, // Keep it short for terminal
        // Optional: 'thinking_config' can be added here if you want to control reasoning budget
      },
    });

    // 4. Get Text
    // The new SDK uses a getter `.text` instead of a function `.text()`
    const responseText = response.text || "No response generated.";

    // 5. Update History
    // We manually append the exchange to our history store
    history.push(
      { role: 'user', parts: [{ text: message }] },
      { role: 'model', parts: [{ text: responseText }] }
    );

    // Keep history concise (last 20 turns / 10 exchanges)
    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }
    conversations.set(sessionId, history);

    return NextResponse.json({ response: responseText });

  } catch (error: any) {
    console.error('Gemini API Error:', error);
    
    // Handle specific error codes if needed (error structure varies by SDK version)
    return NextResponse.json(
      { response: 'Terminal connection error. Please try again.' }, 
      { status: 500 }
    );
  }
}

// Clear conversation history endpoint
export async function DELETE(request: Request) {
  try {
    const { sessionId } = await request.json();
    if (sessionId) {
      conversations.delete(sessionId);
    } else {
      conversations.clear();
    }
    return NextResponse.json({ success: true, message: 'Session cleared' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to clear conversation' }, { status: 500 });
  }
}