# Diet Tracker PWA

A mobile-first Progressive Web App that uses Google Gemini Vision to identify food from photos and estimate calories and macros. UI is in Spanish.

## Features

- Take a photo of your food — Gemini 1.5 Flash identifies the dish and estimates nutrition
- Edit calorie/macro values before saving
- Daily log with macro summary bar and calorie goal progress
- 7-day history view with expandable meal lists
- Installable as a PWA (works offline for cached routes)
- All data stored in localStorage (no account needed)

## Getting a free Gemini API key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Sign in with your Google account
3. Click **"Create API key"**
4. Copy the key — it starts with `AIza...`

The free tier includes generous limits for Gemini 1.5 Flash (suitable for personal use).

## Setup

```bash
npm install
cp .env.example .env.local
# Edit .env.local: GEMINI_API_KEY=AIzaSy...
npm run dev
```

## Tech stack

- Next.js 15.1.0 (App Router)
- React 19
- Tailwind CSS v4
- `@google/generative-ai` (Gemini 1.5 Flash)
- `lucide-react`, `clsx`, `tailwind-merge`
