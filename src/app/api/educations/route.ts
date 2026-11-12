import { NextResponse } from 'next/server';
import { educationsData } from '@/lib/data/educations';

export async function GET() {
  return NextResponse.json({ success: true, data: educationsData });
}
