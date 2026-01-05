'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [workouts, setWorkouts] = useState<any[]>([])
  const [isGenerating, setIsGenerating] = useState(false)
  const [generationError, setGenerationError] = useState<string | null>(null)
  const [testLoading, setTestLoading] = useState(false)
  const [testResult, setTestResult] = useState<string | null>(null)
  const [testError, setTestError] = useState<string | null>(null)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        router.push('/auth/signup')
        return
      }

      setUser(user)

      // Fetch user profile with intake data
      const { data: profileData, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user.id)
        .single()

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching profile:', error)
      }
      
      if (!profileData) {
        // Profile doesn't exist yet, try to create it from pending data
        const pendingIntakeData = localStorage.getItem('pendingIntakeData') || localStorage.getItem('intakeData')
        if (pendingIntakeData) {
          try {
            const intakeData = JSON.parse(pendingIntakeData)
            const { data: newProfile, error: insertError } = await supabase
              .from('profiles')
              .insert({
                user_id: user.id,
                intake_data: intakeData,
              } as any)
              .select()
              .single()

            if (!insertError) {
              setProfile(newProfile)
              localStorage.removeItem('pendingIntakeData')
              localStorage.removeItem('intakeData')
            }
          } catch (e) {
            console.error('Error creating profile:', e)
          }
        }
      } else {
        setProfile(profileData)
      }

      // Fetch existing workouts
      const { data: workoutsData } = await supabase
        .from('workouts')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (workoutsData) {
        setWorkouts(workoutsData)
      }
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleGenerateWorkout = async () => {
    if (!user) return

    setIsGenerating(true)
    setGenerationError(null)

    try {
      // Get the current session to obtain the auth token
      const { data: { session } } = await supabase.auth.getSession()
      
      if (!session?.access_token) {
        throw new Error('Not authenticated')
      }

      const response = await fetch('/api/generate-workout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.id,
          authToken: session.access_token,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to generate workout')
      }

      const data = await response.json()
      
      // Add the new workout to the list
      setWorkouts([data.workout, ...workouts])
    } catch (error: any) {
      console.error('Error generating workout:', error)
      setGenerationError(error.message || 'Failed to generate workout. Please try again.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleTestOpenAI = async () => {
    setTestLoading(true)
    setTestResult(null)
    setTestError(null)

    try {
      const response = await fetch('/api/test-openai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Test request failed')
      }

      setTestResult(data.message)
    } catch (error: any) {
      setTestError(error.message || 'Failed to call OpenAI')
    } finally {
      setTestLoading(false)
    }
  }

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  if (isLoading) {
    return (
      <main className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading your dashboard...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">
                Welcome to Your Dashboard! 🎉
              </h1>
              <p className="text-gray-400">
                {user?.email}
              </p>
            </div>
            <button
              onClick={handleSignOut}
              className="px-4 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 transition"
            >
              Sign Out
            </button>
          </div>
        </div>

        {/* Intake Data Summary */}
        {profile?.intake_data && (
          <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
            <h2 className="text-2xl font-bold text-white mb-4">
              Your Profile Summary
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Basic Info</h3>
                <p className="text-white">
                  {profile.intake_data.age} years old, {profile.intake_data.gender}
                </p>
                <p className="text-white">
                  {profile.intake_data.height}cm, {profile.intake_data.weight}kg
                </p>
              </div>
              
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Goal</h3>
                <p className="text-white capitalize">
                  {profile.intake_data.goal?.replace('_', ' ')}
                </p>
              </div>

              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-sm font-medium text-gray-400 mb-1">Training Schedule</h3>
                <p className="text-white">
                  {profile.intake_data.frequency} days/week, {profile.intake_data.duration} min sessions
                </p>
              </div>

              {profile.intake_data.experience && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Experience</h3>
                  <p className="text-white text-sm line-clamp-3">
                    {profile.intake_data.experience}
                  </p>
                </div>
              )}

              {profile.intake_data.sportPreferences && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Sport Preferences</h3>
                  <p className="text-white text-sm line-clamp-3">
                    {profile.intake_data.sportPreferences}
                  </p>
                </div>
              )}

              {profile.intake_data.equipment && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Equipment</h3>
                  <p className="text-white text-sm line-clamp-3">
                    {profile.intake_data.equipment}
                  </p>
                </div>
              )}

              {profile.intake_data.injuries && (
                <div className="bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-400 mb-1">Injuries/Limitations</h3>
                  <p className="text-white text-sm line-clamp-3">
                    {profile.intake_data.injuries}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Coming Soon Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-white">
              Your Workout Plans
            </h2>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={handleTestOpenAI}
                disabled={testLoading}
                className="px-4 py-2 border border-gray-600 text-gray-200 rounded-lg hover:bg-gray-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {testLoading ? 'Testing...' : 'Test OpenAI Key'}
              </button>
              <button
                onClick={handleGenerateWorkout}
                disabled={isGenerating || !profile?.intake_data}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isGenerating ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <span>✨</span>
                    Generate New Workout Plan
                  </>
                )}
              </button>
            </div>
          </div>

          {testError && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4">
              <p className="text-red-200">Test error: {testError}</p>
            </div>
          )}

          {testResult && (
            <div className="bg-green-900/40 border border-green-700 rounded-lg p-4 mb-4">
              <p className="text-green-200">Test success: {testResult}</p>
            </div>
          )}

          {generationError && (
            <div className="bg-red-900/50 border border-red-700 rounded-lg p-4 mb-4">
              <p className="text-red-200">{generationError}</p>
            </div>
          )}

          {!profile?.intake_data && (
            <div className="bg-yellow-900/50 border border-yellow-700 rounded-lg p-4 mb-4">
              <p className="text-yellow-200">
                Complete your assessment first to generate personalized workouts.
              </p>
            </div>
          )}

          {workouts.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">🏋️</div>
              <h3 className="text-xl font-semibold text-white mb-2">
                No Workouts Yet
              </h3>
              <p className="text-gray-400 mb-6">
                Click the button above to generate your first AI-powered workout plan!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {workouts.map((workout) => (
                <div key={workout.id} className="bg-gray-700 rounded-lg p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-white">{workout.title}</h3>
                    <span className="text-sm text-gray-400">
                      {new Date(workout.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="text-gray-300 whitespace-pre-wrap">
                    {workout.description}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Coming Soon Section */}
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Coming Soon
          </h2>
          <div className="grid md:grid-cols-2 gap-4">
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">📈</div>
              <h3 className="font-semibold text-white mb-2">Progress Tracking</h3>
              <p className="text-sm text-gray-400">
                Track your sets, reps, and improvements over time
              </p>
            </div>
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">💬</div>
              <h3 className="font-semibold text-white mb-2">AI Chat Coach</h3>
              <p className="text-sm text-gray-400">
                Get real-time advice and motivation from your AI trainer
              </p>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
