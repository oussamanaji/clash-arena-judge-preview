// AI Judge Service - Real OpenAI Integration
// Uses the same API as the Flutter app

import OpenAI from 'openai'

export interface JudgmentResult {
  score: number
  feedback: string
  scores: {
    content: number
    delivery: number
    structure: number
  }
  transcript: string
}

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY || '',
  dangerouslyAllowBrowser: true // Required for client-side usage
})

function buildStudentCoachPrompt(motion: string, position: string): string {
  return `You are a Rhitoric AI-powered debate coach providing constructive feedback to help students improve their speaking skills in the Clash Arena.

CONTEXT:
- Platform: Rhitoric Clash Arena (Early Access)
- Topic: ${motion}
- Position: ${position} (Proposition supports the motion, Opposition argues against it)
- Format: 60-second practice round
- Goal: Help the student develop stronger debate skills through AI-powered analysis

EVALUATION CRITERIA:

1. CONTENT (40%)
   - Are arguments clear and logical?
   - Did they provide specific examples or evidence?
   - How well did they address the topic?

2. DELIVERY (30%)
   - Was the speech clear and easy to follow?
   - Did they speak with confidence and appropriate pace?
   - Was their tone persuasive?

3. STRUCTURE (30%)
   - Did they organize their points clearly?
   - Was there a clear beginning, middle, and end?
   - Did they make good use of their 60 seconds?

SCORING:
Rate each area from 1-4:
- 4: Excellent - This skill is very strong
- 3: Good - Solid performance with minor areas to improve
- 2: Developing - Shows promise but needs focused practice
- 1: Beginning - Significant room for improvement

OUTPUT FORMAT:

SPEECH ANALYSIS

Overall Score: [X]/100 points

Content: [X]/4
Delivery: [X]/4  
Structure: [X]/4
Total: [X]/12

WHAT YOU DID WELL:
[List 2-3 specific strengths with quotes from their speech]

MAIN AREA TO IMPROVE:
[Identify the ONE most important skill to focus on next]

PRACTICE EXERCISE:
[Give ONE specific activity they can do to improve]

ENCOURAGEMENT:
[End with positive, motivating comment about their progress]

Remember: Focus on growth and learning. Be specific with examples from their speech. Keep feedback constructive and encouraging.`
}

async function transcribeAudio(audioBlob: Blob): Promise<string> {
  const file = new File([audioBlob], 'speech.webm', { type: 'audio/webm' })
  
  const transcription = await openai.audio.transcriptions.create({
    file: file,
    model: 'gpt-4o-transcribe',
    response_format: 'text',
  })

  return transcription
}

async function judgeWithGPT5(transcript: string, motion: string, position: string): Promise<string> {
  const prompt = buildStudentCoachPrompt(motion, position)

  console.log('Calling GPT-5 with SDK...')
  
  const result = await openai.responses.create({
    model: "gpt-5",
    input: `${prompt}\n\nSPEECH TRANSCRIPT:\n${transcript}`,
    reasoning: { effort: "minimal" },
    text: { verbosity: "medium" },
  })

  console.log('GPT-5 Response received:', result.output_text)
  return result.output_text
}


function parseScores(judgement: string): { score: number; content: number; delivery: number; structure: number } {
  const scores = {
    score: 65, // Default overall score
    content: 2,
    delivery: 2,
    structure: 2,
  }

  try {
    // Extract overall score
    const scoreMatch = judgement.match(/Overall Score:\s*(\d+)\/100/)
    if (scoreMatch) {
      scores.score = parseInt(scoreMatch[1])
    }

    // Extract component scores
    const contentMatch = judgement.match(/Content:\s*(\d+)\/4/)
    if (contentMatch) {
      scores.content = parseInt(contentMatch[1])
    }

    const deliveryMatch = judgement.match(/Delivery:\s*(\d+)\/4/)
    if (deliveryMatch) {
      scores.delivery = parseInt(deliveryMatch[1])
    }

    const structureMatch = judgement.match(/Structure:\s*(\d+)\/4/)
    if (structureMatch) {
      scores.structure = parseInt(structureMatch[1])
    }
  } catch (e) {
    console.error('Error parsing scores:', e)
  }

  return scores
}

export async function judgeDebate(
  audioBlob: Blob,
  motion: string,
  position: 'PROP' | 'OPP'
): Promise<JudgmentResult> {
  try {
    console.log('Starting AI judging process...')
    
    // Step 1: Transcribe audio
    console.log('Transcribing audio with gpt-4o-transcribe...')
    console.log('Audio blob size:', audioBlob.size, 'bytes')
    
    const transcript = await transcribeAudio(audioBlob)
    
    console.log('Full transcript:', transcript)
    console.log('Transcript length:', transcript.length)
    
    if (!transcript || !transcript.trim()) {
      throw new Error('No transcript generated from audio')
    }
    
    if (transcript.length < 10) {
      console.warn('Transcript seems very short:', transcript)
    }
    
    // Step 2: Judge with GPT-5 (returns text response)
    console.log('Analyzing speech with GPT-5...')
    const judgmentText = await judgeWithGPT5(transcript, motion, position)
    
    // Step 3: Parse scores from judgment text
    const parsedScores = parseScores(judgmentText)
    
    return {
      score: parsedScores.score,
      feedback: judgmentText,
      scores: {
        content: parsedScores.content,
        delivery: parsedScores.delivery,
        structure: parsedScores.structure,
      },
      transcript,
    }
  } catch (error) {
    console.error('AI Judge error:', error)
    throw new Error(`Failed to judge debate: ${error}`)
  }
}