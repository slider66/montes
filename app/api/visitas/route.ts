import { NextResponse } from 'next/server'
import { kv } from '@vercel/kv'

export const runtime = 'edge'

export async function POST() {
  try {
    const total = await kv.incr('visitas:total')
    return NextResponse.json({ total })
  } catch {
    return NextResponse.json({ total: 0 })
  }
}
