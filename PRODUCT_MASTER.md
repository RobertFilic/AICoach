# AI Personal Trainer MVP

**Project Status:** Active / Development Phase  
**Last Updated:** January 4, 2026  
**Live URL:** [Deployed on Vercel](https://github.com/RobertFilic/AICoach)

---

## 1. Project Overview & Persona

### Vision
A low-friction, text-based AI coaching platform that provides tailored workout plans and motivational coaching.

### Target Persona: "The Goal-Seeker"
Individuals with specific targets (weight loss, strength, etc.) who need structured, science-based plans without the cost of a human trainer.

### Core Value Proposition
Bespoke coaching logic with a "Prompt Manager" architecture for persona-driven flexibility.

---

## 2. Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js (App Router) |
| **Backend/Database/Auth** | Supabase (PostgreSQL, Auth, Edge Functions) |
| **Deployment** | Vercel |
| **AI Engine** | OpenAI API (GPT-4o) via Supabase Edge Functions |
| **Integrations** | Apple HealthKit / Google Fit API (Future Phase) |

---

## 3. Product Roadmap & Logic Flow

### Conversion Strategy: "Intake-First" Flow

1. **Step 1:** User completes Assessment
2. **Step 2:** UI shows a "Preview" of their potential plan
3. **Step 3:** Sign-up to unlock and save the full plan

### Functional Requirements (MVP)

- **FR1: Smart Intake Form**  
  Multi-step UI collecting Bio, Goals, Equipment, and Injuries.

- **FR2: Conversion-Optimized Auth**  
  Signup triggered post-intake to persist data.

- **FR3: Prompt Manager (The Trainer)**  
  Database-driven "System Prompts" to allow for fine-tuning and multiple trainer personalities.

- **FR4: Workout Dashboard**  
  Clean, text-centric view of daily/weekly exercises.

- **FR5: Simple Progress Tracking**  
  "Mark as Done" toggle for exercise sets.

---

## 4. Development Tracker

| ID | Task / User Story | Priority | Status | Notes |
|----|------------------|----------|--------|-------|
| 1.0 | Environment Setup | P0 | ✅ | Next.js 14 + Supabase + Vercel configured. |
| 1.1 | Supabase Schema Design | P0 | ✅ | Tables created: profiles, trainer_prompts, workouts with RLS policies. |
| 1.2 | Intake Form Component | P0 | ✅ | 3-step form with bio, goals, experience, equipment, and injuries. |
| 1.3 | Post-Intake Sign-up Flow | P0 | ✅ | Intake data saved to localStorage and synced to profile on signup. |
| 1.4 | Landing Page & Navigation | P0 | ✅ | Dark-themed landing page with Sign In and Start Assessment buttons. |
| 1.5 | Authentication Flow | P0 | ✅ | Sign up, sign in, and email confirmation pages implemented. |
| 1.6 | User Dashboard | P0 | ✅ | Profile summary displaying all intake data. |
| 1.7 | Preview Page | P0 | ✅ | Workout plan teaser with conversion CTA. |
| 1.8 | AI Edge Function | P1 | 🟡 | Scaffold created, needs OpenAI integration. |
| 1.9 | Workout Generation | P1 | ⚪ | Connect intake data to AI trainer for personalized plans. |
| 2.0 | Progress Tracking | P1 | ⚪ | Mark exercises as complete, track sets/reps. |
| 2.1 | Workout History | P2 | ⚪ | View past workouts and progress over time. |
| 3.0 | Wearable Data Sync | P2 | ⚪ | Integration with HealthKit/Google Fit. |

---

## 5. Technical Implementation Details (For Dev Agent)

### Architecture
Use a "Prompt Manager" approach. Store the AI Trainer's system prompt in a Supabase table (`trainer_prompts`). This allows the Product Owner to "fine-tune" the trainer's voice and logic without code changes.

### Data Persistence
Store intake responses in a JSONB column in `profiles` for maximum flexibility.

### Auth Flow
Use Supabase PKCE flow. Ensure intake data is passed through the signup redirect.

---

## 6. Completed Milestones

✅ **Phase 1: Core Infrastructure (Jan 3-4, 2026)**
- Next.js 14 project setup with TypeScript and Tailwind CSS
- Supabase database with profiles, trainer_prompts, and workouts tables
- Row Level Security policies configured
- Deployed to Vercel with CI/CD from GitHub

✅ **Phase 2: User Onboarding Flow (Jan 4, 2026)**
- Multi-step intake form (3 steps, 10 questions)
- Dark-themed UI across all pages
- Password visibility toggles
- Preview page with workout plan teaser
- localStorage persistence for intake data

✅ **Phase 3: Authentication (Jan 4, 2026)**
- Supabase Auth integration
- Sign up and sign in pages
- Email confirmation flow support
- Automatic profile creation on signup
- Dashboard with profile summary

---

## 7. Next Immediate Steps

1. ✅ ~~Create the `profiles` and `trainer_prompts` SQL tables in Supabase~~
2. ✅ ~~Develop the IntakeForm UI~~
3. ✅ ~~Write the first "Master Trainer" system prompt for the database~~
4. **Next:** Connect OpenAI API to Edge Function for workout generation
5. **Next:** Implement actual workout plan generation from intake data
6. **Next:** Add progress tracking and workout completion features

---

## 8. Technical Implementation Notes

### Completed
- **Database:** PostgreSQL via Supabase with JSONB for flexible intake data storage
- **Auth:** Supabase Auth with PKCE flow, support for email confirmation
- **Frontend:** Next.js 14 App Router with client-side components
- **Styling:** Tailwind CSS with dark theme (gray-900/gray-800 palette)
- **Type Safety:** TypeScript with generated Supabase types
- **Deployment:** Vercel with automatic deployments from GitHub main branch

### Pending
- OpenAI API integration for workout generation
- Edge Function deployment to Supabase
- Real-time workout plan generation
- Exercise database/library
- Progress tracking functionality