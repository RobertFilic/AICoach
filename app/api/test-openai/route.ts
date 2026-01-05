import { NextResponse } from 'next/server'
import fs from 'fs'

export const runtime = 'nodejs'

function loadOpenAIKey() {
  let apiKey = process.env.OPENAI_API_KEY

  if (!apiKey || apiKey.startsWith('your_openai')) {
    try {
      const envPath = `${process.cwd()}/.env.local`
      const envRaw = fs.readFileSync(envPath, 'utf8')
      const match = envRaw
        .split('\n')
        .map((line) => line.trim())
        .find((line) => line.startsWith('OPENAI_API_KEY='))

      const value = match?.split('=')[1]?.trim()
      if (value) {
        apiKey = value.replace(/^['"]|['"]$/g, '')
        process.env.OPENAI_API_KEY = apiKey
        console.log('Loaded OPENAI_API_KEY from .env.local', {
          path: envPath,
          length: apiKey.length,
          prefix: apiKey.substring(0, 12),
        })
      }
    } catch (e) {
      console.error('Failed to read .env.local for OPENAI_API_KEY', e)
    }
  }

  console.log('OPENAI_API_KEY check:', {
    present: !!apiKey,
    length: apiKey?.length,
    prefix: apiKey?.substring(0, 12),
  })

  return apiKey
}

export async function POST() {
  try {
    const apiKey = loadOpenAIKey()

    if (!apiKey || apiKey.startsWith('your_openai')) {
      return NextResponse.json({ error: 'OPENAI_API_KEY not set (check .env.local)' }, { status: 400 })
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [{ role: 'user', content: 'Say hello in one short sentence.' }],
        max_tokens: 50,
      }),
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Test OpenAI error:', data)
      return NextResponse.json({ error: data.error?.message || 'OpenAI error' }, { status: 400 })
    }

    const message = data.choices?.[0]?.message?.content || 'No content returned'

    return NextResponse.json({ message }, { status: 200 })
  } catch (error: any) {
    console.error('Test OpenAI exception:', error)
    return NextResponse.json({ error: error.message || 'Unexpected error' }, { status: 500 })
  }
}
