/**
 * FILE: frontend/src/pages/InterviewStart.jsx
 * PURPOSE: The setup screen where the user selects their role, inputs their GitHub URL,
 * chooses an interviewer persona, and starts the mock interview.
 */
import React from 'react'
import Step1setup from '../components/interview/Step1setup'

import { useOutletContext } from 'react-router-dom';
import { FiSidebar } from 'react-icons/fi';
import { motion } from "motion/react";

function InterviewStart() {
  const { setMoblieOpen, user, setUser } = useOutletContext();
  return (
    <div className='flex-1 flex flex-col font-sans w-full h-full relative z-10'>
      <div className='px-4 sm:px-6 md:px-8 py-6 md:py-8 transition-all duration-300 w-full'>
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <button onClick={() => setMoblieOpen(true)} className='md:hidden text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 p-1.5 rounded-md transition-colors'>
              <FiSidebar size={18} />
            </button>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p className='text-zinc-500 text-xs font-medium mb-1 uppercase tracking-wider'>Interview Prep</p>
              <h2 className='text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight'>
                New Mock Interview
              </h2>
            </motion.div>
          </div>
        </div>
      </div>
      <Step1setup user={user} setUser={setUser}/>
    </div>
  )
}
export default InterviewStart

