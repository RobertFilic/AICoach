'use client'

export default function ConfirmEmailPage() {
  return (
    <main className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="bg-gray-800 rounded-lg shadow-lg p-8 text-center">
          <div className="text-6xl mb-6">📧</div>
          <h1 className="text-3xl font-bold text-white mb-4">
            Check Your Email
          </h1>
          <p className="text-gray-300 mb-6">
            We've sent you a confirmation email. Please click the link in the email to activate your account.
          </p>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-400">
              💡 <strong className="text-white">Tip:</strong> Check your spam folder if you don't see the email within a few minutes.
            </p>
          </div>
          <a
            href="/"
            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Back to Home
          </a>
        </div>
      </div>
    </main>
  )
}
