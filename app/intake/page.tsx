'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function IntakePage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    height: '',
    weight: '',
    goal: '',
    experience: '',
    sportPreferences: '',
    equipment: '',
    injuries: '',
    frequency: '',
    duration: '',
  })

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const handleNext = () => {
    if (step < 3) setStep(step + 1)
  }

  const handleBack = () => {
    if (step > 1) setStep(step - 1)
  }

  const handleSubmit = async () => {
    // Save intake data to localStorage so it persists through signup
    localStorage.setItem('intakeData', JSON.stringify(formData))
    console.log('Form data saved:', formData)
    router.push('/preview')
  }

  return (
    <main className="min-h-screen bg-gray-900 py-12 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8">
          {/* Progress indicator */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              <span className="text-sm font-medium text-gray-300">Step {step} of 3</span>
              <span className="text-sm text-gray-400">{Math.round((step / 3) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-700 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(step / 3) * 100}%` }}
              />
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-white">Tell us about yourself</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Age</label>
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => handleInputChange('age', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  placeholder="Enter your age"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Gender</label>
                <select
                  value={formData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">Select...</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Height (cm)</label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => handleInputChange('height', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="170"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-300">Weight (kg)</label>
                  <input
                    type="number"
                    value={formData.weight}
                    onChange={(e) => handleInputChange('weight', e.target.value)}
                    className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                    placeholder="70"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Goals & Experience */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-white">Your fitness goals</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Primary Goal</label>
                <select
                  value={formData.goal}
                  onChange={(e) => handleInputChange('goal', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">Select your goal...</option>
                  <option value="lose_weight">Lose Weight</option>
                  <option value="build_muscle">Build Muscle</option>
                  <option value="improve_endurance">Improve Endurance</option>
                  <option value="general_fitness">General Fitness</option>
                  <option value="sports_performance">Sports Performance</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Fitness & Sports Experience
                </label>
                <p className="text-sm text-gray-400 mb-2">
                  Tell us about your past and current sports experience, fitness level, and any relevant background.
                </p>
                <textarea
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  rows={5}
                  placeholder="e.g., I played soccer in high school, have been going to the gym for 6 months, comfortable with basic exercises..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Other Sport & Activity Preferences
                </label>
                <p className="text-sm text-gray-400 mb-2">
                  What activities do you enjoy? This helps us create a plan you'll actually love doing.
                </p>
                <textarea
                  value={formData.sportPreferences}
                  onChange={(e) => handleInputChange('sportPreferences', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  rows={4}
                  placeholder="e.g., I love hiking on weekends, enjoy playing basketball with friends, like running outdoors, prefer cycling over treadmill..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">How often can you work out?</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => handleInputChange('frequency', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">Select frequency...</option>
                  <option value="2">2 days per week</option>
                  <option value="3">3 days per week</option>
                  <option value="4">4 days per week</option>
                  <option value="5">5 days per week</option>
                  <option value="6">6 days per week</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">Session Duration</label>
                <select
                  value={formData.duration}
                  onChange={(e) => handleInputChange('duration', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white"
                >
                  <option value="">Select duration...</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                  <option value="90">90 minutes</option>
                </select>
              </div>
            </div>
          )}

          {/* Step 3: Equipment & Limitations */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-bold mb-6 text-white">Equipment & limitations</h2>
              
              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Available Equipment
                </label>
                <p className="text-sm text-gray-400 mb-2">
                  Describe what equipment you have access to (gym, home setup, etc.)
                </p>
                <textarea
                  value={formData.equipment}
                  onChange={(e) => handleInputChange('equipment', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  rows={4}
                  placeholder="e.g., Full gym membership with free weights, machines, cardio equipment, or just dumbbells at home, or bodyweight only..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-300">
                  Any injuries or limitations?
                </label>
                <textarea
                  value={formData.injuries}
                  onChange={(e) => handleInputChange('injuries', e.target.value)}
                  className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400"
                  rows={4}
                  placeholder="e.g., bad knee, lower back issues, shoulder pain, or write 'none' if no limitations..."
                />
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={handleBack}
              disabled={step === 1}
              className="px-6 py-2 border border-gray-600 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Back
            </button>
            
            {step < 3 ? (
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Next
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
              >
                Generate My Plan
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}
