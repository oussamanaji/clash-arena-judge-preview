# Rhitoric Clash Arena Web

Early Access to Rhitoric AI-Powered Debate Judge! Event Special

A simple, fast web version of the Clash Arena debate app built with Next.js and Tailwind CSS.

## Features

- **Landing Page**: Nickname entry for early access mode
- **Arena Dashboard**: Mock user stats and battle history
- **Battle System**: Complete debate flow with:
  - Random motion assignment
  - Random role assignment (PROP/OPP)
  - 30-second preparation timer
  - 60-second speech recording
  - Real-time audio level visualization
  - AI-powered judging with GPT-5

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment variables**:
   Create a `.env.local` file:
   ```bash
   NEXT_PUBLIC_OPENAI_API_KEY=your_openai_api_key_here
   ```

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Open in browser**:
   Navigate to `http://localhost:3000`

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS 4
- **Audio**: Web MediaRecorder API
- **AI Integration**: OpenAI GPT-5 and gpt-4o-transcribe
- **Deployment**: Vercel-ready

## Project Structure

```
src/
├── app/                 # Next.js App Router pages
│   ├── page.tsx        # Landing page
│   ├── arena/          # Arena dashboard
│   └── battle/         # Battle page with state machine
├── components/          # Reusable React components
│   ├── Timer.tsx       # Countdown timer
│   ├── AudioRecorder.tsx  # Audio recording with visualization
│   ├── MotionCard.tsx  # Motion display
│   ├── RoleCard.tsx    # Role assignment display
│   └── JudgmentCard.tsx   # AI judgment results
└── lib/
    └── ai-judge.ts     # OpenAI integration
```

## Key Design Principles

- **KISS (Keep It Simple, Stupid)**: Minimal dependencies, straightforward code
- **YAGNI (You Aren't Gonna Need It)**: Only built features needed for core demo
- **Responsive**: Works on all devices
- **Fast**: Lightweight and optimized for speed

## Usage

1. Enter your nickname on the landing page
2. View your mock arena dashboard
3. Click "Find Battle" to start a debate
4. Get a random motion and role assignment
5. Use 30 seconds to prepare your arguments
6. Record your 60-second speech
7. Receive AI-powered feedback and scoring

## AI Judge Integration

The app uses the same AI judging system as the Flutter version:

- **Transcription**: OpenAI gpt-4o-transcribe model
- **Judging**: OpenAI GPT-5 with student coach prompt
- **Scoring**: Content, Delivery, Structure (1-4 scale each)
- **Feedback**: Constructive coaching-style feedback

## Demo Data

- 10 sample debate motions
- Mock user stats (1500 AP, 42 wins, 8 losses)
- Sample battle history
- All data is client-side only (no database)

## Deployment

Ready for deployment to Vercel:

```bash
npm run build
# Deploy to Vercel
```

## License

Same as the main Clash Arena project.
