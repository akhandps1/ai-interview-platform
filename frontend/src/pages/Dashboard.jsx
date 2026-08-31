/**
 * FILE: frontend/src/pages/Dashboard.jsx
 * PURPOSE: The main hub for the user after logging in. It aggregates their interview history,
 * calculates average scores, and renders performance charts via Recharts.
 */
import React, { useState, useEffect } from 'react';
import { useNavigate, useOutletContext } from 'react-router-dom';
import api from '../utils/axios';
import { motion } from "motion/react";
import { FiSidebar, FiFileText, FiCheckCircle, FiClock, FiArrowRight } from 'react-icons/fi';
import { getAllInterviews } from '../apis/interview.api';
import Statbox from '../components/Statbox';
import InterviewGraph from '../components/InterviewGraph';

function Dashboard() {
  const { user, setUser, sidebarOpen, setSidebarOpen, moblieOpen, setMoblieOpen } = useOutletContext();
  const [stats, setStats] = useState({
    totalInterviews: 0,
    totalQuestions: 0,
    completed: 0,
    averageScore: 0,
  });
  const [technicalData, setTechnicalData] = useState([]);
  const [hrData, setHrData] = useState([]);
  const [technicalCount, setTechnicalCount] = useState(0);
  const [hrCount, setHrCount] = useState(0);
  const [interviews, setInterviews] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchInterviews = async () => {
      try {
        const result = await getAllInterviews();
        if (result && result.success) {
          setStats(result.stats);
          setTechnicalData(result.technicalData);
          setTechnicalCount(result.technicalCount);
          setHrData(result.hrData);
          setHrCount(result.hrCount);
          setInterviews(result.interviews || []);
        }
      } catch (error) {
        console.error("Error fetching interviews:", error);
      }
    };
    fetchInterviews();
  }, []);

  return (
    <motion.div className={`px-4 sm:px-6 md:px-8 py-6 md:py-8 transition-all duration-300 w-full`}>
      
      {/* Header */}
      <div className='flex items-center justify-between mb-8'>
        <div className='flex items-center gap-3'>
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
            <p className='text-zinc-500 text-xs font-medium mb-1 uppercase tracking-wider'>Overview</p>
            <h2 className='text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight'>
              Welcome back, {user?.name?.split(" ")[0]} 👋
            </h2>
          </motion.div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10'>
        <Statbox
          label="Total Interviews"
          value={stats?.totalInterviews}
          subHighlight="All Time"
          sub="Interviews Created"
          index={0}
        />
        <Statbox
          label="Questions Solved"
          value={stats?.totalQuestions}
          subHighlight="Answered"
          sub="Across All Interviews"
          index={1}
        />
        <Statbox
          label="Completed"
          value={stats?.completed}
          subHighlight={`${stats?.totalInterviews || 0} Total`}
          sub="Interviews Finished"
          index={2}
        />
        <Statbox
          label="Average Score"
          value={`${Math.round(stats?.averageScore || 0)}/100`}
          subHighlight="Completed Only"
          sub="Average Performance"
          index={3}
        />
      </div>

      {/* Charts */}
      <motion.div  
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.4, delay: 0.3 }}
        className="mb-4">
          <h3 className='text-zinc-900 font-semibold text-lg'>Performance Radar</h3>
          <p className='text-zinc-500 text-sm mb-4'>Visual breakdown of your interview skills</p>
      </motion.div>
      
      <InterviewGraph
        technicalData={technicalData}
        technicalCount={technicalCount}
        hrData={hrData}
        hrCount={hrCount}
      />

      {/* Interview History Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className='mt-10 bg-white rounded-2xl border border-zinc-200 overflow-hidden shadow-sm'>
        <div className='px-6 py-5 border-b border-zinc-200 bg-zinc-50/50 flex justify-between items-center'>
          <div>
            <h3 className='text-zinc-900 font-semibold text-lg'>Interview History</h3>
            <p className='text-zinc-500 text-sm'>Review your past performances</p>
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
              {interviews.length === 0 ? (
                <tr>
                  <td colSpan="6" className='px-6 py-8 text-center text-zinc-500 text-sm'>
                    No interviews found. Start your first mock interview!
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
export default Dashboard;
