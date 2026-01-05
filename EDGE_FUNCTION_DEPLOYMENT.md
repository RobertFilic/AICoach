# Supabase Edge Function Deployment Guide

This guide explains how to deploy the `generate-workout` Edge Function to Supabase.

## Prerequisites

1. **Supabase CLI** - Already installed via npx
2. **OpenAI API Key** - Get one from https://platform.openai.com/api-keys
3. **Supabase Project** - Your project is already set up

## Step 0: Authenticate with Supabase CLI

First, you need to create a personal access token in Supabase:

1. Go to https://supabase.com/dashboard/account/tokens
2. Click "Generate new token"
3. Give it a name (e.g., "AICoach Deployment")
4. Copy the token

Then set it as an environment variable:

```bash
export SUPABASE_ACCESS_TOKEN=your_token_here
```

Or authenticate through the interactive login:

```bash
npx supabase login
```

This will open your browser to create an access token and authenticate automatically.

## Step 1: Link Your Supabase Project

First, link your local project to your Supabase project:

```bash
npx supabase link --project-ref zmqtpvzkcwoqirscnohv
```

You'll be prompted to enter your database password (the one you set when creating the Supabase project).

## Step 2: Set the OpenAI API Key Secret

Set your OpenAI API key as a secret in Supabase (this keeps it secure):

```bash
npx supabase secrets set OPENAI_API_KEY=your_openai_api_key_here
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

## Step 3: Deploy the Edge Function

Deploy the generate-workout function:

```bash
npx supabase functions deploy generate-workout
```

This will:
- Bundle the function code
- Upload it to Supabase
- Make it available at: `https://zmqtpvzkcwoqirscnohv.supabase.co/functions/v1/generate-workout`

## Step 4: Test the Deployment

You can test the function using curl:

```bash
curl -i --location --request POST 'https://zmqtpvzkcwoqirscnohv.supabase.co/functions/v1/generate-workout' \
  --header 'Authorization: Bearer YOUR_SUPABASE_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"userId":"test-user-id","intakeData":{"age":30,"goal":"muscle_gain"}}'
```

## Step 5: Test in the App

1. Make sure you're signed in to the dashboard
2. Click the "Generate New Workout Plan" button
3. The system will:
   - Fetch your intake data from your profile
   - Call the Edge Function with your data
   - Generate a personalized workout using OpenAI
   - Save it to your workouts table
   - Display it on your dashboard

## Troubleshooting

### Function Deployment Fails
- Make sure you're authenticated: `npx supabase login`
- Check that the project is linked: `npx supabase projects list`

### "No active trainer prompt found" Error
- Run the SQL migration in your Supabase SQL Editor to insert the default trainer prompt
- File: `supabase/migrations/20260103_initial_schema.sql`

### OpenAI API Errors
- Verify your API key is correct and has credits
- Check the secret is set: `npx supabase secrets list`

### CORS Errors
- The Edge Function already includes CORS headers
- Make sure you're using the correct Supabase URL

## Monitoring

View function logs in real-time:

```bash
npx supabase functions serve generate-workout
```

Or check logs in the Supabase Dashboard:
1. Go to https://supabase.com/dashboard/project/zmqtpvzkcwoqirscnohv
2. Navigate to Edge Functions
3. Click on `generate-workout`
4. View logs and invocations

## Updating the Function

After making changes to the Edge Function code:

```bash
npx supabase functions deploy generate-workout
```

The changes will be live immediately.
