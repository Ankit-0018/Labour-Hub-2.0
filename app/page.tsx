import Link from "next/link"

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#E5E5E5] p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 shadow-lg text-center">
          <h1 className="text-3xl font-bold text-black mb-4">Labour Hub</h1>
          <p className="text-gray-600 mb-8">Welcome to Labour Hub</p>

          <div className="space-y-4">
            <Link
              href="auth?mode=login"
              className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-4 rounded-2xl transition"
            >
              Login
            </Link>
            <Link
              href="/auth?mode=register"
              className="block w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 rounded-2xl transition"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
