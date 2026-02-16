import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
  const results: Record<string, any> = {
    hasUrl: !!process.env.UPSTASH_REDIS_REST_URL,
    hasToken: !!process.env.UPSTASH_REDIS_REST_TOKEN,
    urlPrefix: process.env.UPSTASH_REDIS_REST_URL?.substring(0, 30) + '...',
  }

  try {
    if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
      const { Redis } = require('@upstash/redis')
      const redis = new Redis({
        url: process.env.UPSTASH_REDIS_REST_URL,
        token: process.env.UPSTASH_REDIS_REST_TOKEN,
      })

      // Test write
      await redis.set('test:ping', 'pong')

      // Test read
      const value = await redis.get('test:ping')

      results.connected = true
      results.testValue = value
    } else {
      results.connected = false
      results.error = 'Missing environment variables'
    }
  } catch (error) {
    results.connected = false
    results.error = error instanceof Error ? error.message : 'Unknown error'
  }

  return NextResponse.json(results)
}
