import Link from 'next/link'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-900">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4 text-white">
          AI Personal Trainer
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          Your personalized fitness journey starts here
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/intake">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Start Assessment
            </button>
          </Link>
          <Link href="/auth/signin">
            <button className="px-6 py-3 border-2 border-gray-600 text-gray-300 rounded-lg hover:bg-gray-800 transition">
              Sign In
            </button>
          </Link>
        </div>
      </div>
    </main>
  )
}
