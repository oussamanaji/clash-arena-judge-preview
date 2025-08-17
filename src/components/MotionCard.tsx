interface MotionCardProps {
  motion: string
  category?: string
}

export default function MotionCard({ motion, category = "Debate" }: MotionCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <div className="text-center">
        {/* Category Badge */}
        <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold bg-indigo-100 text-indigo-800 mb-4">
          {category.toUpperCase()}
        </div>
        
        {/* Motion Label */}
        <h2 className="text-lg font-semibold text-gray-600 mb-3 tracking-wide">
          MOTION
        </h2>
        
        {/* Motion Text */}
        <div className="bg-gray-50 rounded-xl p-6">
          <p className="text-xl md:text-2xl font-bold text-gray-800 leading-relaxed">
            {motion}
          </p>
        </div>
        
        {/* Decoration */}
        <div className="mt-4 text-indigo-400">
          ⚖️ 🗣️ ⚖️
        </div>
      </div>
    </div>
  )
}