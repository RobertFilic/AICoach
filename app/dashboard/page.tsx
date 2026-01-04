'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'

export default function DashboardPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [profile, setProfile] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

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
              })
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
    } catch (error) {
      console.error('Error:', error)
    } finally {
      setIsLoading(false)
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
        <div className="bg-gray-800 rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-bold text-white mb-4">
            Coming Soon
          </h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-gray-700 rounded-lg p-6 text-center">
              <div className="text-4xl mb-3">🏋️</div>
              <h3 className="font-semibold text-white mb-2">AI-Generated Workouts</h3>
              <p className="text-sm text-gray-400">
                Personalized workout plans created by your AI trainer
              </p>
            </div>
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
