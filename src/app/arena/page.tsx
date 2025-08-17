'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

// Mock data (KISS principle)
const MOCK_USER = {
  arenaPoints: 1500,
  wins: 42,
  losses: 8,
  matches: 50,
  division: 'Master',
  winRate: 84
}

const MOCK_BATTLES = [
  { id: 1, motion: 'AI will create more jobs than it destroys', role: 'PROP', result: 'WIN', score: 85, date: '2 hours ago' },
  { id: 2, motion: 'Social media has done more harm than good', role: 'OPP', result: 'LOSS', score: 72, date: '1 day ago' },
  { id: 3, motion: 'Remote work is better than office work', role: 'PROP', result: 'WIN', score: 91, date: '2 days ago' },
]

export default function Arena() {
  const [nickname, setNickname] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const storedNickname = localStorage.getItem('nickname')
    if (!storedNickname) {
      router.push('/')
      return
    }
    setNickname(storedNickname)
    setIsLoading(false)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem('nickname')
    router.push('/')
  }

  const handleFindBattle = () => {
    router.push('/battle')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Arena...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Image src="/logo.svg" alt="Clash Arena" width={40} height={40} />
            <h1 className="text-2xl font-bold text-gray-800">Clash Arena</h1>
          </div>
          <button
            onClick={handleLogout}
            className="text-gray-600 hover:text-gray-800 font-medium"
          >
            Logout
          </button>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <div className="flex items-center space-x-4 mb-6">
            <div className="w-16 h-16 bg-indigo-600 rounded-full flex items-center justify-center">
              <span className="text-white text-2xl font-bold">
                {nickname.charAt(0).toUpperCase()}
              </span>
            </div>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{nickname}</h2>
              <div className="flex items-center space-x-2">
                <span className="bg-yellow-400 text-yellow-900 px-3 py-1 rounded-full text-sm font-semibold">
                  {MOCK_USER.division}
                </span>
                <span className="text-gray-600">Division</span>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-indigo-50 rounded-xl">
              <div className="text-2xl font-bold text-indigo-600">{MOCK_USER.arenaPoints}</div>
              <div className="text-sm text-gray-600">Arena Points</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600">{MOCK_USER.wins}</div>
              <div className="text-sm text-gray-600">Wins</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-600">{MOCK_USER.losses}</div>
              <div className="text-sm text-gray-600">Losses</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600">{MOCK_USER.winRate}%</div>
              <div className="text-sm text-gray-600">Win Rate</div>
            </div>
          </div>
        </div>

        {/* Find Battle Button */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-8 text-center mb-8">
          <h3 className="text-2xl font-bold text-white mb-4">Ready for Battle?</h3>
          <p className="text-indigo-100 mb-6">Face AI judges in epic verbal duels</p>
          <button
            onClick={handleFindBattle}
            className="bg-white text-indigo-600 font-bold py-3 px-8 rounded-xl text-lg hover:bg-gray-100 transition-colors"
          >
            🔥 Find Battle
          </button>
        </div>

        {/* Recent Battles */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Recent Battles</h3>
          <div className="space-y-4">
            {MOCK_BATTLES.map((battle) => (
              <div key={battle.id} className="border rounded-xl p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      battle.role === 'PROP' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {battle.role}
                    </span>
                    <span className={`px-2 py-1 rounded text-sm font-semibold ${
                      battle.result === 'WIN' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {battle.result}
                    </span>
                    <span className="text-gray-600 text-sm">{battle.date}</span>
                  </div>
                  <div className="text-lg font-bold text-gray-800">
                    {battle.score}/100
                  </div>
                </div>
                <p className="text-gray-700 font-medium">{battle.motion}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}