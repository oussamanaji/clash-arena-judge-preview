'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Timer from '@/components/Timer'
import AudioRecorder from '@/components/AudioRecorder'
import MotionCard from '@/components/MotionCard'
import RoleCard from '@/components/RoleCard'
import JudgmentCard from '@/components/JudgmentCard'
import { judgeDebate, JudgmentResult } from '@/lib/ai-judge'

// Mock motions data (KISS principle)
const MOTIONS = [
  "AI will create more jobs than it destroys",
  "Social media has done more harm than good",  
  "Remote work is better than office work",
  "Climate change requires immediate drastic action",
  "Universal basic income should be implemented globally",
  "Privacy is more important than security",
  "Space exploration is a waste of resources",
  "Nuclear energy is the solution to climate change",
  "Violent video games cause real-world violence",
  "Professional athletes are overpaid",
]

// Using real AI judge integration

type Phase = 'prep' | 'record' | 'judge' | 'result'

export default function Battle() {
  const [phase, setPhase] = useState<Phase>('prep')
  const [motion, setMotion] = useState('')
  const [role, setRole] = useState<'PROP' | 'OPP'>('PROP')
  const [nickname, setNickname] = useState('')
  const [judgment, setJudgment] = useState<JudgmentResult | null>(null)
  const router = useRouter()

  useEffect(() => {
    // Check for nickname
    const storedNickname = localStorage.getItem('nickname')
    if (!storedNickname) {
      router.push('/')
      return
    }
    setNickname(storedNickname)

    // Generate random motion and role
    const randomMotion = MOTIONS[Math.floor(Math.random() * MOTIONS.length)]
    const randomRole = Math.random() > 0.5 ? 'PROP' : 'OPP'
    
    setMotion(randomMotion)
    setRole(randomRole)
  }, [router])

  const handlePrepComplete = () => {
    setPhase('record')
  }

  const handleRecordingComplete = async (blob: Blob) => {
    setAudioBlob(blob)
    setPhase('judge')
    
    try {
      // Real AI processing
      const judgment = await judgeDebate(blob, motion, role)
      setJudgment(judgment)
      setPhase('result')
    } catch (error) {
      console.error('AI judging failed:', error)
      // Fallback: Show error message
      setJudgment({
        score: 0,
        feedback: 'Sorry, AI judging is temporarily unavailable. Please try again later or check your internet connection.',
        scores: { content: 0, delivery: 0, structure: 0 },
        transcript: ''
      })
      setPhase('result')
    }
  }

  const handleBackToArena = () => {
    router.push('/arena')
  }

  const getTipsForRole = (role: 'PROP' | 'OPP') => {
    if (role === 'PROP') {
      return [
        "Define key terms clearly",
        "Present 2-3 strong arguments",
        "Use concrete examples",
        "Address counterarguments",
        "Structure: Intro → Arguments → Conclusion"
      ]
    } else {
      return [
        "Challenge the definition",
        "Identify weaknesses in arguments",
        "Present alternative solutions",
        "Use contradictory evidence",
        "Structure: Rebuttals → Arguments → Conclusion"
      ]
    }
  }

  if (!nickname) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Battle...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-800">Battle Arena</h1>
          <div className="text-gray-600">
            {nickname}
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Motion Display - Always visible */}
        <div className="mb-8">
          <MotionCard motion={motion} />
        </div>

        {/* Role Display - Always visible */}
        <div className="mb-8">
          <RoleCard role={role} />
        </div>

        {/* Phase-specific content */}
        {phase === 'prep' && (
          <div className="space-y-8">
            <div className="text-center">
              <Timer 
                initialSeconds={30}
                onComplete={handlePrepComplete}
                title="Preparation Time"
              />
            </div>
            
            {/* Preparation Tips */}
            <div className="bg-white rounded-2xl shadow-lg p-6">
              <h3 className="text-xl font-bold text-gray-800 mb-4">
                💡 Tips for {role === 'PROP' ? 'Proposition' : 'Opposition'}
              </h3>
              <ul className="space-y-3">
                {getTipsForRole(role).map((tip, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <span className="bg-indigo-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold">
                      {index + 1}
                    </span>
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {phase === 'record' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Time to Speak!</h2>
              <p className="text-gray-600 mb-8">You have 60 seconds to present your case</p>
            </div>
            
            <AudioRecorder 
              onRecordingComplete={handleRecordingComplete}
              maxDuration={60}
            />
          </div>
        )}

        {phase === 'judge' && (
          <div className="text-center space-y-8">
            <div className="text-6xl mb-4">⚖️</div>
            <h2 className="text-3xl font-bold text-gray-800">Rhitoric AI Judge Analyzing...</h2>
            <p className="text-gray-600">Evaluating your speech for content, delivery, and structure</p>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-indigo-600 mx-auto"></div>
          </div>
        )}

        {phase === 'result' && judgment && (
          <JudgmentCard 
            score={judgment.score}
            feedback={judgment.feedback}
            scores={judgment.scores}
            onContinue={handleBackToArena}
          />
        )}
      </div>
    </div>
  )
}