import { NextResponse } from 'next/server';
import { profileData } from '@/lib/data/profile';

export async function GET() {
  return NextResponse.json({ success: true, data: profileData });
}
