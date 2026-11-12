import { NextResponse } from 'next/server';
import { hobbiesData } from '@/lib/data/hobbies';

export async function GET() {
  return NextResponse.json({ success: true, data: hobbiesData });
}
