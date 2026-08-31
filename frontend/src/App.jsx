/**
 * FILE: frontend/src/App.jsx
 * PURPOSE: Core logic and configuration for App.jsx.
 */
import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import Home from './pages/Home'
import Dashboard from './pages/Dashboard'
import Scorer from './pages/Scorer'
import ResumeBuilder from "./pages/ResumeBuilder"
import InterviewStart from './pages/InterviewStart'
import InterviewPage from './pages/InterviewPage'
import InterviewReport from './pages/InterviewReport'
import Roadmap from './pages/Roadmap'
import Billing from './pages/Billing'
import History from './pages/History'
import ErrorBoundary from './components/ErrorBoundary'
import DashboardLayout from './layouts/DashboardLayout'
import FocusLayout from './layouts/FocusLayout'
import { getCurrentUser } from './apis/user.api'
import { getResume } from './apis/resume.api'
import { useDispatch } from 'react-redux'
import { setResume } from './redux/resumeSlice'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const dispatch = useDispatch()

  useEffect(() => {
    const getUser = async () => {
      try {
        const data = await getCurrentUser()
        setUser(data?.user)
      } catch (err) {}
      setLoading(false)
    }
    getUser()
  }, [])

  useEffect(() => {
    const getResumeData = async () => {
      try {
        const result = await getResume()
        if (result?.data) {
          dispatch(setResume(result.data))
        }
      } catch (err) {}
    }
    getResumeData()
  }, [dispatch])

  if (loading) {
    return (
      <div className="fixed inset-0 bg-white flex flex-col items-center justify-center z-[9999]">
        <img src="/logo.png" alt="Loading" className="w-12 h-12 mb-4 animate-bounce rounded-lg shadow-sm" />
        <div className="w-48 h-1 bg-zinc-200 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 w-1/2 animate-[pulse_1s_ease-in-out_infinite]" style={{ transformOrigin: "left" }} />
        </div>
      </div>
    )
  }

  return (
    <ErrorBoundary fallback={<div className="p-8 text-center"><h1 className="text-2xl font-bold">Something went wrong</h1></div>}>
      <Toaster position="bottom-center" toastOptions={{ 
        style: { background: '#333', color: '#fff', borderRadius: '8px', fontSize: '14px' },
        success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
        error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
      }} />
      <Routes>
        <Route path='/' element={
          user ? <Navigate to="/dashboard" replace/> : <Home setUser={setUser}/>
        }/>

        {/* DASHBOARD LAYOUT (With Sidebar) */}
        <Route element={user ? <DashboardLayout user={user} setUser={setUser} /> : <Navigate to="/" replace />}>
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/scorer' element={<Scorer />} />
          <Route path='/roadmap' element={<Roadmap />} />
          <Route path='/history' element={<History />} />
          <Route path='/billing' element={<Billing />} />
                  <Route path='/resume' element={<ResumeBuilder />} />
          <Route path='/interview' element={<InterviewStart />} />
          <Route path='/interview/start' element={<InterviewStart />} />
          <Route path='/interview/:id' element={<InterviewPage />} />
          <Route path='/interview/:id/report' element={<InterviewReport />} />
</Route>

        {/* FOCUS LAYOUT (Tools without sidebar, top nav only) */}
        <Route element={user ? <FocusLayout user={user} setUser={setUser} /> : <Navigate to="/" replace />}>
                                                          </Route>
      </Routes>
    </ErrorBoundary>
  )
}

export default App
