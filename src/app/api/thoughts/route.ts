// src/app/api/thoughts/route.ts
import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const thoughtsFilePath = path.join(process.cwd(), 'data', 'thoughts.json');

// Ensure data directory exists
function ensureDataDir() {
  const dataDir = path.join(process.cwd(), 'data');
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(thoughtsFilePath)) {
    fs.writeFileSync(thoughtsFilePath, JSON.stringify([]));
  }
}

export async function GET() {
  try {
    ensureDataDir();
    const data = fs.readFileSync(thoughtsFilePath, 'utf-8');
    const thoughts = JSON.parse(data);
    return NextResponse.json(thoughts);
  } catch (error) {
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    ensureDataDir();
    const body = await request.json();
    const { thought } = body;

    if (!thought || thought.trim().length === 0) {
      return NextResponse.json({ error: 'Thought cannot be empty' }, { status: 400 });
    }

    const data = fs.readFileSync(thoughtsFilePath, 'utf-8');
    const thoughts = JSON.parse(data);

    const newThought = {
      id: Date.now(),
      text: thought.trim(),
      timestamp: new Date().toISOString(),
    };

    thoughts.push(newThought);
    fs.writeFileSync(thoughtsFilePath, JSON.stringify(thoughts, null, 2));

    return NextResponse.json(newThought);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to save thought' }, { status: 500 });
  }
}