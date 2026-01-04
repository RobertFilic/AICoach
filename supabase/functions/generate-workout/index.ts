import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { intakeData, userId } = await req.json()

    // Get the active trainer prompt from database
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const { data: trainerPrompt } = await supabaseClient
      .from('trainer_prompts')
      .select('system_prompt')
      .eq('is_active', true)
      .single()

    if (!trainerPrompt) {
      throw new Error('No active trainer prompt found')
    }

    // Call OpenAI API
    const openAIResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
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
            content: `Create a personalized workout plan based on this intake data: ${JSON.stringify(intakeData)}`,
          },
        ],
        temperature: 0.7,
      }),
    })

    const openAIData = await openAIResponse.json()
    const workoutPlan = openAIData.choices[0].message.content

    // Save workout to database
    const { data: workout, error } = await supabaseClient
      .from('workouts')
      .insert({
        user_id: userId,
        title: 'Your Personalized Workout Plan',
        description: workoutPlan,
        exercises: [],
      })
      .select()
      .single()

    if (error) throw error

    return new Response(
      JSON.stringify({ workout }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
