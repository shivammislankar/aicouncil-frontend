import { useState, useEffect, useCallback } from 'react'
import CouncilResult from '../components/CouncilResult'
import Sidebar from '../components/Sidebar'
import { useNavigate } from "react-router-dom"
import { signOut, onAuthStateChanged } from 'firebase/auth'
import { auth } from '../services/firebase'
import { askCouncil } from '../services/councilApi'
import { saveChat, loadChats, removeChat } from '../services/chatHistory'
import { useAuth } from '../context/AuthContext'

export default function Council() {
  const token = localStorage.getItem("token")
  const userEmail = localStorage.getItem("userEmail")
  const { logout: logoutFromContext } = useAuth() || {}
  const [question, setQuestion] = useState('')
  const [result, setResult] = useState(null)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // Sidebar + history state
  const [sidebarOpen, setSidebarOpen] = useState(
    () => localStorage.getItem("sidebarOpen") !== "false"
  )
  const [chats, setChats] = useState([])
  const [activeChatId, setActiveChatId] = useState(null)
  const [historyLoading, setHistoryLoading] = useState(false)
  const [user, setUser] = useState(null)

  const navigate = useNavigate()

  // Track the signed-in Firebase user (uid is needed for Firestore)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser)
    })
    return () => unsubscribe()
  }, [])

  // Load history whenever the user changes
  const fetchHistory = useCallback(async (uid) => {
    if (!uid) return
    setHistoryLoading(true)
    try {
      const history = await loadChats(uid)
      // Merge instead of replace: if a chat was just saved while this load
      // was in flight, a plain replace would wipe it from the sidebar.
      setChats((prev) => {
        const loadedIds = new Set(history.map((c) => c.id))
        const justSaved = prev.filter((c) => !loadedIds.has(c.id))
        return [...history, ...justSaved].sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        )
      })
    } catch (err) {
      console.error("Failed to load chat history", err)
    } finally {
      setHistoryLoading(false)
    }
  }, [])

  useEffect(() => {
    if (user?.uid) {
      fetchHistory(user.uid)
    }
  }, [user?.uid, fetchHistory])

  // Persist sidebar open/closed preference
  useEffect(() => {
    localStorage.setItem("sidebarOpen", String(sidebarOpen))
  }, [sidebarOpen])

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
      // Clear AuthContext state too, otherwise ProtectedRoute still sees a token
      if (typeof logoutFromContext === "function") logoutFromContext()
      navigate("/login")
    } catch (err) {
      console.error("Logout failed", err)
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!question.trim() || loading) return

    setError('')

    try {
      setLoading(true)

      const data = await askCouncil(token, question.trim())
      const payload = data.payload
      setResult(payload)

      // Save to Firestore history (if signed in).
      // Greetings/trivial inputs are replied to but never persisted, so the
      // sidebar isn't cluttered with one-word chats.
      if (user?.uid && !payload.greeting) {
        try {
          const saved = await saveChat(user.uid, question.trim(), payload)
          setChats((prev) => [saved, ...prev])
          setActiveChatId(saved.id)
        } catch (err) {
          console.error("Failed to save chat history", err)
        }
      } else if (payload.greeting) {
        // Greeting isn't in history — clear the selection so the sidebar
        // doesn't keep highlighting a chat the view no longer shows.
        setActiveChatId(null)
      }

      setQuestion('')
    } catch (err) {
      console.error(err)
      setError(err?.message || 'Failed to get a response from Veritas')
    } finally {
      setLoading(false)
    }
  }

  function handleNewChat() {
    setResult(null)
    setQuestion('')
    setError('')
    setActiveChatId(null)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  function handleSelectChat(chat) {
    setQuestion(chat.question)
    setResult(chat.result)
    setError('')
    setActiveChatId(chat.id)
    if (window.innerWidth < 1024) setSidebarOpen(false)
  }

  async function handleDeleteChat(id) {
    // Optimistically remove from UI
    setChats((prev) => prev.filter((c) => c.id !== id))
    if (activeChatId === id) {
      handleNewChat()
    }
    try {
      await removeChat(id)
    } catch (err) {
      console.error("Failed to delete chat", err)
      // Restore on failure
      if (user?.uid) fetchHistory(user.uid)
    }
  }

  return (
    <div className="min-h-screen bg-white text-gray-900 flex flex-col
                   dark:bg-gray-900 dark:text-gray-100 relative">

      {/* Sidebar */}
      <Sidebar
        open={sidebarOpen}
        onToggle={() => setSidebarOpen((prev) => !prev)}
        chats={chats}
        activeChatId={activeChatId}
        loading={historyLoading}
        onSelect={handleSelectChat}
        onNewChat={handleNewChat}
        onDelete={handleDeleteChat}
      />

      {/* Main content - shifts right when sidebar is open on large screens */}
      <div
        className={`flex flex-col flex-1 min-h-screen transition-all duration-300
                    ${sidebarOpen ? "lg:ml-72" : "ml-0"}`}
      >
        {/* Header */}
        <div className="max-w-6xl mx-auto w-full px-6 pt-16 flex justify-between items-start
                        text-gray-900 dark:text-gray-100">
          <div>
            <h1 className="text-4xl font-semibold mb-2">
              {result
                ? activeChatId
                  ? "Chat"
                  : "Hello"
                : `Hello, ${userEmail ? userEmail.split("@")[0] : "there"}`}
            </h1>
            <p className="text-gray-500 text-xl">
              Find what matters, faster.
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="text-sm text-gray-600 hover:text-black
                       dark:text-gray-400 dark:hover:text-white"
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
              "Want everything connected?",
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

        {/* Result */}
        {result && (
          <div className="max-w-4xl mx-auto w-full px-6 mt-10">
            <CouncilResult data={result} />
          </div>
        )}

        {error && (
          <p className="text-red-500 text-center pb-6 mt-4">{error}</p>
        )}

        {/* Input Bar */}
        <div className="mt-auto w-full px-6 py-10">
          <form
            onSubmit={handleSubmit}
            className="max-w-4xl mx-auto flex items-center gap-3 bg-gray-100 rounded-full px-6 py-4 shadow-sm
                       dark:bg-gray-800"
          >
            <input
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Ask me anything..."
              className="flex-1 bg-transparent outline-none text-gray-800 placeholder-gray-500
                         dark:text-gray-100 dark:placeholder-gray-400"
            />

            <button
              type="submit"
              disabled={loading || !question.trim()}
              className="bg-black text-white rounded-full px-4 py-2 hover:opacity-90 transition
                         disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {loading ? "…" : "→"}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
