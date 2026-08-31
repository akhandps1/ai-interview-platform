/**
 * FILE: frontend/src/pages/History.jsx
 * PURPOSE: Core logic and configuration for History.jsx.
 */
import { useOutletContext } from 'react-router-dom';
import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import { FiSidebar, FiFileText, FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import { getAllInterviews } from '../apis/interview.api';

function History() {
  const { user, setUser, sidebarOpen, setSidebarOpen, moblieOpen, setMoblieOpen } = useOutletContext();
  const [interviews, setInterviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const response = await getAllInterviews();
        if (response) {
          setInterviews(response.interviews || []);
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchInterviews();
  }, []);

  return (
    

      <motion.div className={`px-4 sm:px-6 md:px-8 py-6 md:py-8 transition-all duration-300 w-full`}>
        
        {/* Header */}
        <div className='flex items-center justify-between mb-8'>
          <div className='flex items-center gap-3'>
            <button
              onClick={() => setMoblieOpen(true)}
              className='md:hidden text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 p-1.5 rounded-md transition-colors'>
              <FiSidebar size={18} />
            </button>
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
              <p className='text-zinc-500 text-xs font-medium mb-1 uppercase tracking-wider'>Logs</p>
              <h2 className='text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight'>
                Interview History
              </h2>
            </motion.div>
          </div>
        </div>

        {/* Interview History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className='bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm'>
          <div className='px-6 py-5 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center'>
            <div>
              <h3 className='text-zinc-900 font-semibold text-lg'>All Interviews</h3>
              <p className='text-zinc-500 text-sm'>A complete log of your past mock interviews.</p>
            </div>
          </div>
          <div className='overflow-x-auto'>
            <table className='w-full text-left border-collapse'>
              <thead>
                <tr className='bg-zinc-50 text-zinc-500 text-xs uppercase tracking-wider font-semibold border-b border-zinc-200'>
                  <th className='px-6 py-4'>Role & Type</th>
                  <th className='px-6 py-4'>Date</th>
                  <th className='px-6 py-4'>Questions</th>
                  <th className='px-6 py-4'>Status</th>
                  <th className='px-6 py-4'>Score</th>
                  <th className='px-6 py-4 text-right'>Action</th>
                </tr>
              </thead>
              <tbody className='divide-y divide-zinc-200'>
                {loading ? (
                   <tr>
                   <td colSpan="6" className='px-6 py-12 text-center text-zinc-500 text-sm'>
                     Loading history...
                   </td>
                 </tr>
                ) : interviews.length === 0 ? (
                  
                  <tr>
                    <td colSpan="6" className='px-6 py-16 text-center text-zinc-500 text-sm'>
                      <div className="flex flex-col items-center justify-center gap-3">
                         <div className="w-16 h-16 rounded-full bg-indigo-50 flex items-center justify-center text-indigo-300 mb-2">
                             <FiFileText size={24} />
                         </div>
                         <h4 className="text-zinc-900 font-semibold text-base">No interviews yet</h4>
                         <p className="text-zinc-500 mb-2 max-w-sm">You haven't taken any mock interviews. Create your first interview to track your progress here.</p>
                         <button onClick={() => navigate('/interview')} className="mt-2 bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-all shadow-sm active:scale-95">
                             Start Interview
                         </button>
                      </div>
                    </td>
                  </tr>

                ) : (
                  interviews.map((inv) => (
                    <tr key={inv._id} className='hover:bg-zinc-50/50 transition-colors'>
                      <td className='px-6 py-4'>
                        <div className='flex items-center gap-3'>
                          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${inv.type === 'technical' ? 'bg-indigo-50 text-indigo-600' : 'bg-emerald-50 text-emerald-600'}`}>
                            <FiFileText size={14} />
                          </div>
                          <div>
                            <p className='text-sm font-semibold text-zinc-900 capitalize truncate max-w-[150px]'>{inv.role || "General"}</p>
                            <p className='text-xs text-zinc-500 capitalize'>{inv.type} Interview</p>
                          </div>
                        </div>
                      </td>
                      <td className='px-6 py-4 text-sm text-zinc-600'>
                        {new Date(inv.createdAt).toLocaleDateString()}
                      </td>
                      <td className='px-6 py-4 text-sm text-zinc-600 font-medium'>
                        {inv.questions.length}
                      </td>
                      <td className='px-6 py-4'>
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${
                          inv.status === 'completed' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {inv.status === 'completed' ? <FiCheckCircle size={12}/> : <FiClock size={12}/>}
                          {inv.status === 'completed' ? "Completed" : "In Progress"}
                        </span>
                      </td>
                      <td className='px-6 py-4'>
                        <span className={`text-sm font-bold ${inv.status === 'completed' ? 'text-zinc-900' : 'text-zinc-400'}`}>
                          {inv.status === 'completed' ? `${Math.round(inv.overallScore)}/100` : "-"}
                        </span>
                      </td>
                      <td className='px-6 py-4 text-right'>
                        {inv.status === 'completed' ? (
                          <button
                            onClick={() => navigate(`/interview/${inv._id}/report`)}
                            className='inline-flex items-center gap-2 text-sm font-semibold text-indigo-600 hover:text-indigo-700 transition-colors'>
                            View Report <FiArrowRight size={14} />
                          </button>
                        ) : (
                          <button
                            onClick={() => navigate(`/interview/${inv._id}`)}
                            className='inline-flex items-center gap-2 text-sm font-semibold text-amber-600 hover:text-amber-700 transition-colors'>
                            Continue <FiArrowRight size={14} />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
        
      </motion.div>
    
  );
}
export default History;
