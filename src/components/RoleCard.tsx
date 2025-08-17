interface RoleCardProps {
  role: 'PROP' | 'OPP'
}

export default function RoleCard({ role }: RoleCardProps) {
  const isProposition = role === 'PROP'
  
  const config = isProposition ? {
    title: 'PROPOSITION',
    subtitle: 'You support the motion',
    color: 'bg-gradient-to-r from-green-500 to-emerald-600',
    emoji: '✅',
    description: 'Argue FOR the motion'
  } : {
    title: 'OPPOSITION', 
    subtitle: 'You oppose the motion',
    color: 'bg-gradient-to-r from-blue-500 to-indigo-600',
    emoji: '❌',
    description: 'Argue AGAINST the motion'
  }

  return (
    <div className={`${config.color} rounded-2xl shadow-lg p-6 text-white text-center`}>
      <div className="text-4xl mb-3">{config.emoji}</div>
      
      <div className="text-3xl font-bold mb-2">
        {role}
      </div>
      
      <div className="text-lg font-semibold mb-3 opacity-90">
        {config.title}
      </div>
      
      <div className="text-white/80 mb-4">
        {config.subtitle}
      </div>
      
      <div className="bg-white/20 rounded-lg px-4 py-2 text-sm font-medium">
        {config.description}
      </div>
    </div>
  )
}