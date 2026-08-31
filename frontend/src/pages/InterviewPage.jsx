/**
 * FILE: frontend/src/pages/InterviewPage.jsx
 * PURPOSE: Hosts the live interview session. Fetches the interview state from the backend
 * and passes it to the Step2interview component which handles the actual webcam and chat UI.
 */
import { FiSidebar } from 'react-icons/fi';
import { motion } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import React from 'react'
import { useEffect } from 'react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { getInterview } from '../apis/interview.api'
import Step2interview from '../components/interview/Step2interview'

function InterviewPage() {
    const {id} = useParams()
    const [loading , setLoading] = useState(true)
    const [interview,setInterview] = useState(null)
    const navigate = useNavigate()
    const { setMoblieOpen, user, setUser } = useOutletContext();

    useEffect(()=>{
        const fetchInterview = async () => {
            const response = await getInterview(id)
            const data = response?.interview
            if (!data) {
                // If there's an error fetching (like DB down), redirect back or show error
                toast.error("Failed to load interview. Please check your connection.")
                navigate("/dashboard")
                return;
            }
            if(data.status === "completed"){
                navigate(`/interview/${id}/report`,
                    {replace: true});
                    return;
            }
            setInterview(data)
            setLoading(false)
         }

         fetchInterview()

    },[id,navigate])

    if(loading){
        return(
            <div className="min-h-screen bg-[#07000F] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-white/20 border-t-white animate-spin" />
      </div>
        )
    }
    if(!interview) return null
    
    return (
    <div className='flex-1 flex flex-col font-sans w-full h-full relative z-10'>
      <div className='px-4 sm:px-6 md:px-8 py-6 md:py-8 transition-all duration-300 w-full'>
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <button onClick={() => setMoblieOpen(true)} className='md:hidden text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 p-1.5 rounded-md transition-colors'>
              <FiSidebar size={18} />
            </button>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p className='text-zinc-500 text-xs font-medium mb-1 uppercase tracking-wider'>Interview Room</p>
              <h2 className='text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight'>
                Live Session
              </h2>
            </motion.div>
          </div>
        </div>
      </div>
      <Step2interview 
    interviewData={{
        interviewId: interview._id,
        currentQuestion: interview.currentQuestion,
        totalQuestions: interview.questions.length,
        question: interview.questions[interview.currentQuestion],
    }} user={user}    />
    </div>
  )
}

export default InterviewPage
