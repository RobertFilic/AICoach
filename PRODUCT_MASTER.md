# AI Personal Trainer MVP

**Project Status:** Active / Planning Phase  
**Last Updated:** January 3, 2026

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
| 1.0 | Environment Setup | P0 | 🟢 | Next.js + Supabase initialized. |
| 1.1 | Supabase Schema Design | P0 | ⚪ | Tables: profiles, trainer_prompts, workouts. |
| 1.2 | Intake Form Component | P0 | ⚪ | Multi-step form (React Hook Form). |
| 1.3 | Post-Intake Sign-up Flow | P0 | ⚪ | Persist intake data to profile on auth. |
| 1.4 | AI Edge Function | P1 | ⚪ | Prompt-based workout generation logic. |
| 1.5 | Workout Dashboard UI | P1 | ⚪ | Mobile-first text rendering. |
| 2.0 | Wearable Data Sync | P2 | ⚪ | Integration with HealthKit/Google Fit. |

---

## 5. Technical Implementation Details (For Dev Agent)

### Architecture
Use a "Prompt Manager" approach. Store the AI Trainer's system prompt in a Supabase table (`trainer_prompts`). This allows the Product Owner to "fine-tune" the trainer's voice and logic without code changes.

### Data Persistence
Store intake responses in a JSONB column in `profiles` for maximum flexibility.

### Auth Flow
Use Supabase PKCE flow. Ensure intake data is passed through the signup redirect.

---

## 6. Next Immediate Steps

1. Create the `profiles` and `trainer_prompts` SQL tables in Supabase.
2. Develop the IntakeForm UI based on the 13-question questionnaire.
3. Write the first "Master Trainer" system prompt for the database.