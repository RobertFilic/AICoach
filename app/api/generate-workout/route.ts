import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
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

export async function POST(request: NextRequest) {
  try {
    const { userId, authToken } = await request.json()

    if (!userId || !authToken) {
      return NextResponse.json(
        { error: 'User ID and auth token are required' },
        { status: 400 }
      )
    }

    // Log key presence to ensure correct value is loaded
    const apiKey = loadOpenAIKey()

    if (!apiKey || apiKey.startsWith('your_openai')) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY is not configured. Update .env.local and restart dev server.' },
        { status: 500 }
      )
    }

    // Initialize Supabase client with auth token for RLS to work
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        global: {
          headers: {
            Authorization: `Bearer ${authToken}`,
          },
        },
      }
    )

    // Get user's intake data from profile
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('intake_data')
      .eq('user_id', userId)
      .single()

    if (profileError || !profile) {
      console.error('Profile fetch error:', profileError)
      return NextResponse.json(
        { error: `Profile not found: ${profileError?.message || 'Unknown error'}` },
        { status: 404 }
      )
    }

    if (!profile.intake_data) {
      return NextResponse.json(
        { error: 'No intake data found. Please complete the assessment first.' },
        { status: 400 }
      )
    }

    // Get the active trainer prompt
    const { data: trainerPrompt, error: promptError } = await supabase
      .from('trainer_prompts')
      .select('system_prompt')
      .eq('is_active', true)
      .single()

    if (promptError || !trainerPrompt) {
      console.error('Trainer prompt error:', promptError)
      return NextResponse.json(
        { error: 'No active trainer prompt found' },
        { status: 500 }
      )
    }

    // Call OpenAI API directly
    console.log('Calling OpenAI API...')
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: trainerPrompt.system_prompt,
          },
          {
            role: 'user',
            content: `Create a personalized workout plan based on this intake data: ${JSON.stringify(profile.intake_data, null, 2)}

Please structure your response as a workout plan with:
- A motivational introduction
- Week-by-week breakdown (start with Week 1)
- Daily exercises with sets, reps, and rest periods
- Any important notes about form or safety

Format the plan in a clear, readable way that's easy to follow.`,
          },
        ],
        temperature: 0.7,
      }),
    })

    console.log('OpenAI response status:', openAIResponse.status)

    if (!openAIResponse.ok) {
      const errorData = await openAIResponse.json()
      console.error('OpenAI error:', errorData)
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`)
    }

    const openAIData = await openAIResponse.json()
    
    if (!openAIData.choices?.[0]?.message?.content) {
      throw new Error('No content in OpenAI response')
    }
    
    const workoutPlan = openAIData.choices[0].message.content

    // Save workout to database
    const { data: workout, error: insertError } = await supabase
      .from('workouts')
      .insert({
        user_id: userId,
        title: 'Your Personalized Workout Plan',
        description: workoutPlan,
        exercises: [],
      })
      .select()
      .single()

    if (insertError) {
      console.error('Database insert error:', insertError)
      throw insertError
    }

    console.log('Workout created successfully:', workout.id)

    return NextResponse.json({ workout }, { status: 200 })
  } catch (error: any) {
    console.error('Error generating workout:', error)
    return NextResponse.json(
      { error: error.message || 'Failed to generate workout' },
      { status: 500 }
    )
  }
}
