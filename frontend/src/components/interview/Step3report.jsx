/**
 * FILE: frontend/src/components/interview/Step3report.jsx
 * PURPOSE: Visualizes the interview results using Recharts (Radar Chart). Iterates over each 
 * question to show AI feedback, scores, and suggested improvements.
 */
import React, { useRef, useMemo } from 'react';
import { motion } from "motion/react";
import { FiArrowLeft, FiAward, FiCheck, FiTarget, FiTrendingUp, FiX, FiMessageSquare } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import DownloadBtn from '../resume/DownloadBtn';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer, Tooltip } from 'recharts';

function Step3report({ report, user, setUser }) {
  const navigate = useNavigate();
  const reportRef = useRef(null);
  
  const chartData = useMemo(() => {
    if (!report?.questions?.length) return [];
    
    let sums = {
      correctness: 0,
      clarity: 0,
      detail: 0,
      problemSolving: 0,
      communication: 0
    };
    
    let count = 0;
    report.questions.forEach(q => {
      if (q.feedback) {
        sums.correctness += q.feedback.correctness || 0;
        sums.clarity += q.feedback.clarity || 0;
        sums.detail += q.feedback.detail || 0;
        sums.problemSolving += q.feedback.problemSolving || 0;
        sums.communication += q.feedback.communication || 0;
        count++;
      }
    });

    if (count === 0) return [];
    
    return [
      { subject: 'Correctness', A: Math.round((sums.correctness / count) * 10), fullMark: 100 },
      { subject: 'Clarity', A: Math.round((sums.clarity / count) * 10), fullMark: 100 },
      { subject: 'Detail', A: Math.round((sums.detail / count) * 10), fullMark: 100 },
      { subject: 'Problem Solving', A: Math.round((sums.problemSolving / count) * 10), fullMark: 100 },
      { subject: 'Communication', A: Math.round((sums.communication / count) * 10), fullMark: 100 },
    ];
  }, [report]);

  return (
    <div className='flex-1 w-full relative z-10 flex items-start justify-center md:p-6 py-6 font-sans'>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-5xl rounded-3xl bg-white/90 backdrop-blur-xl border border-zinc-200/80 shadow-2xl shadow-indigo-900/5 overflow-hidden">
        
        {/* Header */}
        <div className='border-b border-zinc-200 px-6 sm:px-8 py-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-50/50'>
          <div>
            

            <h1 className='text-2xl sm:text-3xl font-bold text-zinc-900'>Interview Report</h1>
            <p className='text-xs text-zinc-500 mt-1.5 mb-4'>AI Generated Performance Analysis</p>

            <DownloadBtn docRef={reportRef} user={user} setUser={setUser} />
          </div>

          <div className='hidden sm:flex items-center gap-2.5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 shadow-sm'>
            <FiAward className="text-emerald-500" size={18} />
            <span className='text-sm font-bold text-emerald-700'>Completed</span>
          </div>
        </div>


        <div className='p-6 sm:p-8 bg-white' ref={reportRef}>
          {/* Top Stats */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-5 mb-10'>
            <div className='rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4'>
                <FiTarget size={22} />
              </div>
              <p className='text-zinc-500 text-xs font-semibold uppercase tracking-wider'>Overall Score</p>
              <h2 className='mt-1 text-4xl font-bold text-zinc-900'>
                {report.overallScore}
                <span className='text-xl text-zinc-400 font-medium'>/100</span>
              </h2>
            </div>

            <div className='rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4'>
                <FiTrendingUp size={22} />
              </div>
              <p className='text-zinc-500 text-xs font-semibold uppercase tracking-wider'>Questions</p>
              <h2 className='mt-1 text-4xl font-bold text-zinc-900'>{report.questions.length}</h2>
            </div>

            <div className='rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm hover:shadow-md transition-shadow'>
              <div className='w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4'>
                <FiAward size={22} />
              </div>
              <p className='text-zinc-500 text-xs font-semibold uppercase tracking-wider'>Role</p>
              <h2 className='mt-1 text-2xl font-bold text-zinc-900 truncate'>{report.role || "General"}</h2>
            </div>
          </div>

          {/* Skill Radar Chart */}
          {chartData.length > 0 && (
            <div className='mb-10 rounded-2xl bg-white border border-zinc-200 p-6 shadow-sm'>
              <h3 className='text-lg font-bold text-zinc-900 mb-4'>Skill Performance Heatmap</h3>
              <div className='w-full h-72'>
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="80%" data={chartData}>
                    <PolarGrid stroke="#e4e4e7" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#52525b', fontSize: 12, fontWeight: 600 }} />
                    <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fill: '#a1a1aa', fontSize: 10 }} />
                    <Radar
                      name="Score"
                      dataKey="A"
                      stroke="#6366f1"
                      strokeWidth={2}
                      fill="#818cf8"
                      fillOpacity={0.4}
                    />
                    <Tooltip 
                      contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                      itemStyle={{ color: '#4f46e5', fontWeight: 'bold' }}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}

          {/* Detailed Question Analysis */}
          <div className="mt-8">
              <h3 className='text-lg font-bold text-zinc-900 mb-6'>Detailed Breakdown</h3>

              <div className='space-y-6'>
                {report.questions.map((item, index) => (
                  <div key={index} className='rounded-2xl border border-zinc-200 bg-white shadow-sm p-6 sm:p-8'>
                    <div className='flex items-start gap-4'>
                        <div className='w-10 h-10 rounded-full bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold shrink-0'>
                            {index + 1}
                        </div>
                        <div>
                            <h4 className='text-base sm:text-lg font-bold text-zinc-900 leading-snug'>
                                {item.question}
                            </h4>
                            <div className='flex items-center gap-2 mt-2'>
                                <span className='text-[10px] font-semibold text-zinc-500 uppercase tracking-wider bg-zinc-100 px-2 py-0.5 rounded'>
                                    {item.difficulty}
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className='mt-6 border-l-2 border-indigo-200 pl-4 ml-5'>
                      <p className='text-[10px] uppercase tracking-widest text-zinc-400 font-semibold mb-2'>Your Answer</p>
                      <p className='text-sm leading-relaxed text-zinc-700'>
                        {item.userAnswer || "No answer submitted"}
                      </p>
                    </div>

                    {/* Metric Cards */}
                    <div className='grid grid-cols-2 md:grid-cols-4 gap-3 mt-8'>
                      {[
                          { label: 'Score', value: item.feedback?.score, color: 'text-indigo-600 bg-indigo-50 border-indigo-100' },
                          { label: 'Clarity', value: item.feedback?.clarity, color: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                          { label: 'Relevance', value: item.feedback?.relevance, color: 'text-amber-600 bg-amber-50 border-amber-100' },
                          { label: 'Comm.', value: item.feedback?.communication, color: 'text-blue-600 bg-blue-50 border-blue-100' }
                      ].map((metric, i) => (
                          <div key={i} className={`rounded-xl border p-4 ${metric.color}`}>
                              <p className='text-xs font-semibold opacity-80'>{metric.label}</p>
                              <h5 className='mt-1 text-2xl font-bold'>{metric.value ?? 0}<span className="text-sm opacity-60">/100</span></h5>
                          </div>
                      ))}
                    </div>

                    {/* AI Feedback */}
                    <div className='mt-6 rounded-xl border border-indigo-200 bg-indigo-50 p-5'>
                        <div className="flex items-center gap-2 mb-3">
                            <FiMessageSquare className="text-indigo-600" />
                            <p className='text-[11px] font-bold uppercase tracking-widest text-indigo-600'>AI Feedback</p>
                        </div>
                        <p className='text-sm leading-relaxed text-indigo-900'>{item.feedback?.feedback || "No feedback available."}</p>
                    </div>

                    {/* Improvements */}
                    {item.feedback?.improvements?.length > 0 && (
                      <div className='mt-6'>
                         <h5 className="text-sm font-bold text-zinc-900 mb-4">
                          Suggested Improvements
                        </h5>
                        <div className='space-y-2'>
                          {item.feedback?.improvements?.map((imp, i) => (
                            <div key={i} className='rounded-lg border border-red-100 bg-red-50 px-4 py-3 flex items-start gap-3'>
                              <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-2 shrink-0" />
                              <p className='text-sm text-red-900'>
                               {imp}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default Step3report;
