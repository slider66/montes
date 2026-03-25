import { NextResponse } from 'next/server'
import { incrementarVisitas } from '@/lib/kv'

export const runtime = 'edge'

export async function POST() {
  const total = await incrementarVisitas()
  return NextResponse.json({ total })
}
