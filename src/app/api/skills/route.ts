import { NextResponse } from 'next/server';
import { skillsData } from '@/lib/data/skills';

export async function GET() {
  return NextResponse.json({ success: true, data: skillsData });
}
