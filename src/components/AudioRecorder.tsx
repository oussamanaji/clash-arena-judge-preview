'use client'

import { useState, useRef, useEffect } from 'react'

interface AudioRecorderProps {
  onRecordingComplete?: (audioBlob: Blob) => void
  onPermissionDenied?: () => void
  maxDuration?: number // in seconds
}

export default function AudioRecorder({ 
  onRecordingComplete, 
  onPermissionDenied,
  maxDuration = 60 
}: AudioRecorderProps) {
  const [isRecording, setIsRecording] = useState(false)
  const [hasPermission, setHasPermission] = useState<boolean | null>(null)
  const [audioLevel, setAudioLevel] = useState(0)
  const [recordingTime, setRecordingTime] = useState(0)
  
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const streamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const animationFrameRef = useRef<number | undefined>(undefined)
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined)

  useEffect(() => {
    checkPermission()
    return () => {
      stopRecording()
      cleanupAudio()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const checkPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)
      stream.getTracks().forEach(track => track.stop()) // Stop the test stream
    } catch {
      setHasPermission(false)
      onPermissionDenied?.()
    }
  }

  const requestPermission = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      setHasPermission(true)
      stream.getTracks().forEach(track => track.stop())
    } catch {
      setHasPermission(false)
      onPermissionDenied?.()
    }
  }

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      streamRef.current = stream

      // Setup audio level monitoring
      const audioContext = new AudioContext()
      const analyser = audioContext.createAnalyser()
      const microphone = audioContext.createMediaStreamSource(stream)
      
      analyser.fftSize = 256
      microphone.connect(analyser)
      
      audioContextRef.current = audioContext
      analyserRef.current = analyser

      // Setup MediaRecorder
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/mp4'
      })
      
      const audioChunks: Blob[] = []
      
      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunks.push(event.data)
        }
      }
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/webm' })
        onRecordingComplete?.(audioBlob)
      }
      
      mediaRecorderRef.current = mediaRecorder
      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start audio level monitoring
      monitorAudioLevel()

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => {
          if (prev >= maxDuration - 1) {
            stopRecording()
            return maxDuration
          }
          return prev + 1
        })
      }, 1000)

    } catch (error) {
      console.error('Error starting recording:', error)
      setHasPermission(false)
      onPermissionDenied?.()
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
    }
    
    if (timerRef.current) {
      clearInterval(timerRef.current)
    }
    
    setIsRecording(false)
    cleanupAudio()
  }

  const cleanupAudio = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop())
      streamRef.current = null
    }
    
    if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = undefined
    }
    
    analyserRef.current = null
    setAudioLevel(0)
  }

  const monitorAudioLevel = () => {
    if (!analyserRef.current) return

    const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount)
    
    const updateLevel = () => {
      if (!analyserRef.current || !isRecording) return
      
      analyserRef.current.getByteFrequencyData(dataArray)
      const average = dataArray.reduce((a, b) => a + b) / dataArray.length
      setAudioLevel(average / 255) // Normalize to 0-1
      
      animationFrameRef.current = requestAnimationFrame(updateLevel)
    }
    
    updateLevel()
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  // Audio level visualization bars
  const renderAudioBars = () => {
    const bars = Array.from({ length: 20 }, (_, i) => {
      const barHeight = Math.max(0.1, audioLevel * Math.sin((i * 0.5) + Date.now() * 0.01))
      return (
        <div
          key={i}
          className="bg-green-500 rounded-sm transition-all duration-75"
          style={{
            height: `${barHeight * 100}%`,
            width: '3px',
            minHeight: '10%'
          }}
        />
      )
    })
    return bars
  }

  if (hasPermission === null) {
    return (
      <div className="text-center p-6">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Checking microphone access...</p>
      </div>
    )
  }

  if (hasPermission === false) {
    return (
      <div className="text-center p-6 bg-red-50 rounded-xl border border-red-200">
        <div className="text-red-600 text-4xl mb-4">🎤</div>
        <h3 className="text-lg font-semibold text-red-800 mb-2">Microphone Access Required</h3>
        <p className="text-red-700 mb-4">
          We need access to your microphone to record your speech for the debate.
        </p>
        <button
          onClick={requestPermission}
          className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg"
        >
          Grant Permission
        </button>
      </div>
    )
  }

  return (
    <div className="text-center">
      {isRecording ? (
        <div className="space-y-6">
          {/* Recording Timer */}
          <div className="text-2xl font-bold text-red-600">
            {formatTime(recordingTime)} / {formatTime(maxDuration)}
          </div>

          {/* Audio Level Visualization */}
          <div className="bg-gray-100 rounded-lg p-4 h-24 flex items-end justify-center space-x-1">
            {renderAudioBars()}
          </div>

          {/* Recording Status */}
          <div className="flex items-center justify-center space-x-2">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
            <span className="text-red-600 font-semibold">Recording...</span>
          </div>

          {/* Stop Button */}
          <button
            onClick={stopRecording}
            className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-6 rounded-xl"
          >
            ⏹ Stop Recording
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="text-gray-600">
            Ready to record your speech
          </div>
          
          <button
            onClick={startRecording}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors"
          >
            🎤 Start Recording
          </button>
          
          <div className="text-sm text-gray-500">
            You have {maxDuration} seconds to make your case
          </div>
        </div>
      )}
    </div>
  )
}