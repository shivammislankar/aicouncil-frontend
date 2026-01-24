import { useState } from 'react'
import CouncilResult from '../components/CouncilResult'
import { useNavigate } from "react-router-dom"
import { signOut } from 'firebase/auth'
import { auth } from '../services/firebase'
import { Sun,Moon } from 'lucide-react'
import { useTheme } from '../context/ThemeContext'
import ThemeToggle from '../components/ThemeToggle'

export default function Council() {
  const token = localStorage.getItem("token")
  const userEmail = localStorage.getItem("userEmail")
  const { theme, toggleTheme } = useTheme()
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const navigate = useNavigate()

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg font-semibold">You must be logged in.</p>
      </div>
    )
  }

  const handleLogout = async () => {
    try {
      await signOut(auth)
      localStorage.removeItem("token")
      localStorage.removeItem("userEmail")
      navigate("/login")
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setResult(null)

    try {
      setLoading(true)

      const response = await fetch(
        'http://localhost:8080/api/council/ask',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ question }),
        }
      )

      if (!response.ok) {
        throw new Error(`Request failed: ${response.status}`)
      }

      const data = await response.json()
      setResult(data.payload)
    } catch (err) {
      console.error(err)
      setError('Failed to get council response')
    } finally {
      setLoading(false)
    }
  }

  return (
    
    <div className="min-h-screen bg-white text-gray-900 flex flex-col
                   dark:bg-gray-900 dark:text-gray-100  ">

      {/* Header */}
      <div className="max-w-6xl mx-auto w-full px-6 pt-16 flex justify-between items-start
                      text-gray-900 dark:text-gray-100">
        <div>
          <h1 className="text-4xl font-semibold mb-2">
            Hello, {userEmail ? userEmail.split("@")[0] : "there"}
          </h1>
          <p className="text-gray-500 text-xl">
            Find what matters, faster.
          </p>
        </div>

        <button
          onClick={handleLogout}
          className="text-sm text-gray-600 hover:text-black"
        >
          Logout
        </button>
      </div>
      

      {!result && (
  <div className="max-w-6xl mx-auto w-full px-6 mt-10
                  grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6
                  transition-opacity duration-300 opacity-100">
    {[
      "Looking for the most relevant answers?",
      "Too much data to analyze?",
      "Need the latest info?",
      "Want everything connected?"
    ].map((text, i) => (
      <div
        key={i}
        onClick={() => setQuestion(text)}
        className="cursor-pointer rounded-xl
                   bg-gray-50 dark:bg-gray-800
                   hover:bg-gray-100 dark:hover:bg-gray-700
                   transition p-6 h-40
                   flex items-end text-sm"
      >
        {text}
      </div>
    ))}
  </div>
)}


      {/* Input Bar */}
      <div className="mt-auto w-full px-6 pb-10">
        <form
          onSubmit={handleSubmit}
          className="max-w-4xl mx-auto flex items-center gap-3 bg-gray-100 rounded-full px-6 py-4 shadow-sm"
        >
          <input
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask me anything..."
            className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500"
          />

          <button
            type="submit"
            disabled={loading}
            className="bg-black text-white rounded-full px-4 py-2 hover:opacity-90 transition"
          >
            →
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div className="max-w-4xl mx-auto w-full px-6 pb-20">
          <CouncilResult data={result} />
        </div>
      )}

      {error && (
        <p className="text-red-500 text-center pb-6">{error}</p>
      )}
    </div>
  )
}
