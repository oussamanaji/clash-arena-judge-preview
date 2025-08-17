interface JudgmentCardProps {
  score: number
  feedback: string
  scores?: {
    content: number
    delivery: number
    structure: number
  }
  transcript?: string
  onContinue?: () => void
}

export default function JudgmentCard({ score, feedback, scores, transcript, onContinue }: JudgmentCardProps) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600'
    if (score >= 60) return 'text-yellow-600'
    return 'text-red-600'
  }

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Excellent'
    if (score >= 60) return 'Good'
    return 'Needs Work'
  }

  const formatFeedback = (feedback: string) => {
    const sections = {
      whatWentWell: feedback.match(/WHAT YOU DID WELL:(.*?)MAIN AREA/s)?.[1]?.trim() || '',
      mainImprovement: feedback.match(/MAIN AREA TO IMPROVE:(.*?)PRACTICE EXERCISE/s)?.[1]?.trim() || '',
      practiceExercise: feedback.match(/PRACTICE EXERCISE:(.*?)ENCOURAGEMENT/s)?.[1]?.trim() || '',
      encouragement: feedback.match(/ENCOURAGEMENT:(.*?)$/s)?.[1]?.trim() || ''
    }
    return sections
  }

  const sections = formatFeedback(feedback)

  return (
    <div className="bg-white rounded-2xl shadow-lg p-8 max-w-2xl mx-auto">
      <div className="text-center mb-8">
        <div className="text-6xl mb-4">⚖️</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Rhitoric AI Judge</h2>
        <p className="text-gray-600">Your debate performance has been analyzed</p>
      </div>

      {/* Overall Score */}
      <div className="text-center mb-8">
        <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
          {score}
        </div>
        <div className="text-2xl font-semibold text-gray-700 mb-1">
          {getScoreLabel(score)}
        </div>
        <div className="text-gray-500">out of 100</div>
      </div>

      {/* Detailed Scores */}
      {scores && (
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="text-center p-4 bg-blue-50 rounded-xl">
            <div className="text-2xl font-bold text-blue-600">{scores.content}/4</div>
            <div className="text-sm text-blue-800 font-medium">Content</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-xl">
            <div className="text-2xl font-bold text-green-600">{scores.delivery}/4</div>
            <div className="text-sm text-green-800 font-medium">Delivery</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-xl">
            <div className="text-2xl font-bold text-purple-600">{scores.structure}/4</div>
            <div className="text-sm text-purple-800 font-medium">Structure</div>
          </div>
        </div>
      )}

      {/* Feedback */}
      <div className="bg-gray-50 rounded-xl p-6 mb-8">
        <h3 className="font-semibold text-gray-800 mb-6">Judge's Feedback</h3>
        
        <div className="space-y-6">
          {sections.whatWentWell && (
            <div>
              <h4 className="font-semibold text-green-700 mb-3 flex items-center">
                <span className="mr-2">✅</span>
                What You Did Well
              </h4>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-green-50 p-4 rounded-lg">
                {sections.whatWentWell}
              </div>
            </div>
          )}
          
          {sections.mainImprovement && (
            <div>
              <h4 className="font-semibold text-orange-700 mb-3 flex items-center">
                <span className="mr-2">🎯</span>
                Main Area to Improve
              </h4>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-orange-50 p-4 rounded-lg">
                {sections.mainImprovement}
              </div>
            </div>
          )}
          
          {sections.practiceExercise && (
            <div>
              <h4 className="font-semibold text-blue-700 mb-3 flex items-center">
                <span className="mr-2">📝</span>
                Practice Exercise
              </h4>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-blue-50 p-4 rounded-lg">
                {sections.practiceExercise}
              </div>
            </div>
          )}
          
          {sections.encouragement && (
            <div>
              <h4 className="font-semibold text-purple-700 mb-3 flex items-center">
                <span className="mr-2">💪</span>
                Encouragement
              </h4>
              <div className="text-gray-700 leading-relaxed whitespace-pre-wrap bg-purple-50 p-4 rounded-lg">
                {sections.encouragement}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Button */}
      <div className="text-center">
        <button
          onClick={onContinue}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-8 rounded-xl text-lg transition-colors"
        >
          Back to Arena
        </button>
      </div>
    </div>
  )
}