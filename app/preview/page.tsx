'use client'

import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

export default function PreviewPage() {
  const router = useRouter()
  const [isGenerating, setIsGenerating] = useState(true)

  useEffect(() => {
    // Simulate generating preview
    const timer = setTimeout(() => {
      setIsGenerating(false)
    }, 2000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {isGenerating ? (
          <div className="bg-gray-800 rounded-lg shadow-lg p-12 text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-6"></div>
            <h2 className="text-2xl font-bold text-white mb-2">
              Analyzing your profile...
            </h2>
            <p className="text-gray-400">
              Our AI trainer is creating your personalized workout plan
            </p>
          </div>
        ) : (
          <div className="bg-gray-800 rounded-lg shadow-lg p-8">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-white mb-2">
                Your Personalized Plan Preview
              </h1>
              <p className="text-gray-400">
                Here's a glimpse of what your AI trainer has prepared for you
              </p>
            </div>

            {/* Preview content */}
            <div className="bg-gray-700 rounded-lg p-6 mb-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                🎯 Your Training Program
              </h3>
              <div className="space-y-4 text-gray-300">
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-white mb-2">Week 1-4: Foundation Phase</h4>
                  <p className="text-sm">Focus on building proper form and establishing consistent habits...</p>
                </div>
                <div className="border-l-4 border-blue-600 pl-4">
                  <h4 className="font-semibold text-white mb-2">Sample Day 1: Upper Body Strength</h4>
                  <ul className="text-sm space-y-1 list-disc list-inside">
                    <li>Warm-up: 5 minutes dynamic stretching</li>
                    <li>Push-ups: 3 sets of 10-12 reps</li>
                    <li>Dumbbell rows: 3 sets of 10-12 reps</li>
                    <li>... and 4 more exercises</li>
                  </ul>
                </div>
                <div className="border-l-4 border-blue-600 pl-4 opacity-50 blur-sm">
                  <h4 className="font-semibold text-white mb-2">Day 2: Lower Body & Core</h4>
                  <p className="text-sm">Unlock full access to see your complete workout plan...</p>
                </div>
              </div>
            </div>

            {/* CTA section */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-center mb-6">
              <h3 className="text-2xl font-bold text-white mb-2">
                Ready to start your journey?
              </h3>
              <p className="text-blue-100 mb-6">
                Sign up now to unlock your complete personalized workout plan, track your progress, and get AI-powered coaching
              </p>
              <div className="flex gap-4 justify-center">
                <button 
                  onClick={() => router.push('/auth/signup')}
                  className="px-8 py-3 bg-white text-blue-600 font-semibold rounded-lg hover:bg-gray-100 transition"
                >
                  Create Free Account
                </button>
                <button 
                  onClick={() => router.push('/')}
                  className="px-8 py-3 border-2 border-white text-white font-semibold rounded-lg hover:bg-white/10 transition"
                >
                  Back to Home
                </button>
              </div>
            </div>

            {/* Features */}
            <div className="grid md:grid-cols-3 gap-4 text-center">
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-3xl mb-2">🎯</div>
                <h4 className="font-semibold text-white mb-1">Personalized Plans</h4>
                <p className="text-sm text-gray-400">Tailored to your goals and equipment</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-3xl mb-2">📊</div>
                <h4 className="font-semibold text-white mb-1">Progress Tracking</h4>
                <p className="text-sm text-gray-400">Monitor your fitness journey</p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <div className="text-3xl mb-2">🤖</div>
                <h4 className="font-semibold text-white mb-1">AI Coach</h4>
                <p className="text-sm text-gray-400">24/7 guidance and motivation</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  )
}
