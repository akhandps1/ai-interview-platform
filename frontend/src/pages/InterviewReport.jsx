/**
 * FILE: frontend/src/pages/InterviewReport.jsx
 * PURPOSE: Fetches the completed interview data and passes it to the report component
 * for displaying the 6-axis radar chart and detailed feedback per question.
 */
import { FiSidebar } from 'react-icons/fi';
import { motion } from 'motion/react';
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import React, { useEffect, useState } from 'react'
import Step3report from '../components/interview/Step3report'
import { useNavigate, useParams } from 'react-router-dom'
import { getInterview } from '../apis/interview.api'

function InterviewReport() {
  const {id} = useParams()
    const [loading , setLoading] = useState(true)
    const [report,setReport] = useState(null)
    const navigate = useNavigate()
    const { setMoblieOpen, user, setUser } = useOutletContext();

    useEffect(()=>{
        const fetchReport = async () => {
            const response = await getInterview(id)
            const data = response?.interview
            if (!data) {
                toast.error("Failed to load interview report. Please check your connection.")
                navigate("/dashboard")
                return;
            }
            if(data.status !== "completed"){
                navigate(`/interview/${id}`,
                    {replace: true});
                    return;
            }
            setReport(data)
            setLoading(false)
         }

         fetchReport()

    },[id,navigate])

    if(loading){
        return(
            <div className="min-h-screen bg-[#07000F] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-zinc-200 border-t-indigo-600 animate-spin" />
      </div>
        )
    }
    if(!report) return null


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
                Analysis Report
              </h2>
            </motion.div>
          </div>
        </div>
      </div>
      <Step3report
   user={user}
   setUser={setUser}
   report={report}
   />
    </div>
  )
}

export default InterviewReport
