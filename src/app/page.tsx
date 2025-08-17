'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function Home() {
  const [nickname, setNickname] = useState('')
  const router = useRouter()

  const handleEnterArena = () => {
    if (nickname.trim()) {
      localStorage.setItem('nickname', nickname.trim())
      router.push('/arena')
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleEnterArena()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/logo.svg"
            alt="Clash Arena"
            width={80}
            height={80}
            className="mx-auto mb-4"
          />
          <h1 className="text-4xl font-bold text-gray-800 mb-2">Clash Arena</h1>
          <p className="text-lg font-semibold text-indigo-600 mb-1">Early Access</p>
          <p className="text-gray-600">Event Special</p>
        </div>

        {/* Nickname Input */}
        <div className="space-y-6">
          <div className="text-left">
            <label htmlFor="nickname" className="block text-sm font-semibold text-gray-700 mb-2">
              Enter Your Nickname
            </label>
            <input
              id="nickname"
              type="text"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="e.g. DebateMaster"
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-indigo-500 focus:outline-none text-lg transition-colors"
              maxLength={20}
            />
          </div>

          <button
            onClick={handleEnterArena}
            disabled={!nickname.trim()}
            className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl text-lg transition-colors"
          >
            Enter Arena
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-sm text-gray-500">
          <p>🚀 Early Access Mode - Get exclusive preview!</p>
          <p className="mt-1">Experience AI-powered debate judging before anyone else!</p>
        </div>
      </div>
    </div>
  )
}
