# Supabase Configuration

This directory contains all Supabase-related configuration files.

## Structure

```
supabase/
├── migrations/          # Database migration SQL files
├── functions/          # Edge Functions
└── seed.sql           # Seed data for development
```

## Database Migrations

Migration files are SQL scripts that define the database schema. They should be:
- Named with timestamp prefix: `YYYYMMDD_description.sql`
- Run in order
- Idempotent (safe to run multiple times)

## Edge Functions

Edge Functions are TypeScript/JavaScript functions that run on Supabase's edge network. Use them for:
- AI workout generation (calling OpenAI API)
- Complex business logic
- Webhooks and integrations

## Setup Instructions

1. Install Supabase CLI:
   ```bash
   npm install -g supabase
   ```

2. Link to your project:
   ```bash
   supabase link --project-ref your-project-ref
   ```

3. Run migrations:
   ```bash
   supabase db push
   ```

4. Seed database (optional):
   ```bash
   supabase db seed
   ```

## Creating Edge Functions

```bash
supabase functions new function-name
```

## Deploying Edge Functions

```bash
supabase functions deploy function-name
```
