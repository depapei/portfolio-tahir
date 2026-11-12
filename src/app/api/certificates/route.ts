import { NextResponse } from 'next/server';
import { certificatesData } from '@/lib/data/certificates';

export async function GET() {
  return NextResponse.json({ success: true, data: certificatesData });
}
