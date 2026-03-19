import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'blockhead-secret-change-in-production'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'blockhead2024'

export function verifyPassword(password: string): boolean {
  return password === ADMIN_PASSWORD
}

export function createToken(): string {
  return jwt.sign({ admin: true }, JWT_SECRET, { expiresIn: '7d' })
}

export function verifyToken(token: string): boolean {
  try {
    jwt.verify(token, JWT_SECRET)
    return true
  } catch {
    return false
  }
}

export async function getAdminSession(): Promise<boolean> {
  const cookieStore = await cookies()
  const token = cookieStore.get('admin-token')?.value
  if (!token) return false
  return verifyToken(token)
}
