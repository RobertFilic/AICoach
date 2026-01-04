# AI Personal Trainer

A low-friction, text-based AI coaching platform that provides tailored workout plans and motivational coaching.

## Tech Stack

- **Frontend:** Next.js 14 (App Router)
- **Backend/Database/Auth:** Supabase
- **Deployment:** Vercel
- **AI Engine:** OpenAI GPT-4o

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Supabase account
- OpenAI API key

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env.local` and fill in your credentials:
   ```bash
   cp .env.example .env.local
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
├── app/                    # Next.js App Router pages
├── components/             # Reusable React components
├── lib/                    # Utility functions and configurations
├── types/                  # TypeScript type definitions
├── supabase/              # Supabase schema and functions
│   ├── migrations/        # Database migrations
│   └── functions/         # Edge Functions
└── public/                # Static assets
```

## Documentation

See [PRODUCT_MASTER.md](PRODUCT_MASTER.md) for detailed product requirements and roadmap.

## Development Status

This project is currently in the planning phase. See the Development Tracker in PRODUCT_MASTER.md for current progress.
