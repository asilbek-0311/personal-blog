// src/app/api/thoughts/route.ts
import { NextResponse } from 'next/server';
import { getRedisClient } from '@/lib/redis';

const THOUGHTS_KEY = 'thoughts';

type Thought = {
  id: number;
  text: string;
  timestamp: string;
};

export async function GET() {
  try {
    const redis = getRedisClient();
    
    // Get thoughts from Redis
    const data = await redis.get(THOUGHTS_KEY);
    
    if (!data) {
      // If no thoughts exist yet, return empty array
      return NextResponse.json([]);
    }
    
    const thoughts: Thought[] = JSON.parse(data);
    return NextResponse.json(thoughts);
    
  } catch (err) {
    console.error('Error fetching thoughts:', err);
    return NextResponse.json([]);
  }
}

export async function POST(request: Request) {
  try {
    const redis = getRedisClient();
    const body = await request.json() as { thought: string };
    const { thought } = body;

    if (!thought || thought.trim().length === 0) {
      return NextResponse.json(
        { error: 'Thought cannot be empty' }, 
        { status: 400 }
      );
    }

    // Get existing thoughts
    const data = await redis.get(THOUGHTS_KEY);
    const thoughts: Thought[] = data ? JSON.parse(data) : [];

    // Create new thought
    const newThought: Thought = {
      id: Date.now(),
      text: thought.trim(),
      timestamp: new Date().toISOString(),
    };

    // Add to array
    thoughts.push(newThought);

    // Save back to Redis
    await redis.set(THOUGHTS_KEY, JSON.stringify(thoughts));

    return NextResponse.json(newThought);
    
  } catch (err) {
    console.error('Error saving thought:', err);
    return NextResponse.json(
      { error: 'Failed to save thought' }, 
      { status: 500 }
    );
  }
}