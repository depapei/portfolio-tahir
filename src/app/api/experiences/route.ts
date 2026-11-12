import { NextResponse } from 'next/server';
import { experiencesData } from '@/lib/data/experiences';

export async function GET() {
  return NextResponse.json({ success: true, data: experiencesData });
}
