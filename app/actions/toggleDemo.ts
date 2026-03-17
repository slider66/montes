'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const COOKIE = 'demo_encargos'
const MAX_AGE = 60 * 60 * 24 // 24h

export async function toggleDemoEncargos(activo: boolean) {
  const jar = await cookies()
  if (activo) {
    jar.set(COOKIE, '1', { maxAge: MAX_AGE, path: '/', httpOnly: false, sameSite: 'lax' })
  } else {
    jar.delete(COOKIE)
  }
  redirect('/')
}
