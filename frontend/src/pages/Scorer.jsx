/**
 * FILE: frontend/src/pages/Scorer.jsx
 * PURPOSE: UI for the Resume ATS Scorer. Allows users to upload a PDF, deducts coins,
 * and displays the AI-generated score, matched skills, missing skills, and recommendations.
 */
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from "motion/react";
import { FiSidebar, FiAlertCircle, FiTrendingUp, FiUploadCloud, FiUser, FiZap, FiCheckCircle } from 'react-icons/fi';
import api from '../utils/axios';
import { useDispatch, useSelector } from 'react-redux';
import { setResume } from '../redux/resumeSlice';
import { PolarAngleAxis, RadialBar, RadialBarChart } from "recharts";
import { useCoins } from '../apis/user.api';

const ScoreRing = ({ score }) => {
    const color = score >= 75 ? "#4F46E5" : score >= 50 ? "#F59E0B" : "#EF4444"; // Indigo, Amber, Red
    return (
        <div className='relative flex items-center justify-center'>
            <RadialBarChart
                width={120}
                height={120}
                cx={60}
                cy={60}
                innerRadius={45}
                outerRadius={60}
                startAngle={90}
                endAngle={-270}
                data={[{ value: score, fill: color }]}
                barSize={10}
            >
                <PolarAngleAxis type="number" domain={[0, 100]} tick={false} />
                <RadialBar background={{ fill: "#F4F4F5" }} dataKey="value" cornerRadius={10} />
            </RadialBarChart>
            <div className='absolute flex items-end'>
                <span className='text-2xl font-black text-zinc-900 leading-none'>{score}</span>
                <span className='text-xs font-semibold text-zinc-400 mb-0.5'>/100</span>
            </div>
        </div>
    );
};

const Tag = ({ text, color }) => {
    const styles = {
        purple: "bg-indigo-50 text-indigo-700 border-indigo-200",
        red: "bg-red-50 text-red-700 border-red-200",
        green: "bg-emerald-50 text-emerald-700 border-emerald-200",
        yellow: "bg-amber-50 text-amber-700 border-amber-200",
    };
    return (
        <div className={`text-xs px-2.5 py-1.5 rounded-md border font-medium shadow-sm ${styles[color]}`}>
            {text}
        </div>
    );
};


function Scorer() {
  const { user, setUser, sidebarOpen, setSidebarOpen, moblieOpen, setMoblieOpen } = useOutletContext();
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const dispatch = useDispatch();
    const { resume } = useSelector((state) => state.resume);

    const uploadResume = async () => {
        if (!file) return toast.error("Please select a PDF");
        try {
            setLoading(true);
            try {
                const coinResponse = await useCoins({ coins: 10, action: "resume-scorer" });
                setUser((prev) => ({ ...prev, interviewCoin: coinResponse?.interviewCoin }));
            } catch (error) {
                setLoading(false);
                toast.error("Failed to use coins.");
                return;
            }
            const formData = new FormData();
            formData.append("resume", file);
            const response = await api.post("/api/resume/upload", formData);
            dispatch(setResume(response?.data?.data));
            setLoading(false);
        } catch (error) {
            console.log(error);
            toast.error("Upload failed");
            setLoading(false);
        }
    };

    if (resume) return (
    <div className='flex-1 flex flex-col font-sans text-zinc-900 w-full relative z-10'>

        <div className='px-4 sm:px-6 md:px-8 py-6 md:py-8 transition-all duration-300 w-full flex-1 flex flex-col'>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <button onClick={() => setMoblieOpen(true)} className='md:hidden text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 p-1.5 rounded-md transition-colors'>
                <FiSidebar size={18} />
              </button>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <p className='text-zinc-500 text-xs font-medium mb-1 uppercase tracking-wider'>Career Tools</p>
                <h2 className='text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight'>
                  ATS Scorer
                </h2>
              </motion.div>
            </div>
            {resume && (
                <button onClick={() => dispatch(setResume(null))} className='flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm transition-all active:scale-95'>
                    <FiUploadCloud size={16} />
                    <span className="hidden sm:inline">Score New Resume</span>
                    <span className="sm:hidden">New</span>
                </button>
            )}
          </div>

          <section className='mx-auto w-full max-w-5xl flex flex-col gap-6'>
                <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
                    {/* Score Card */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4 }}
                        className='col-span-1 md:col-span-1 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-3xl p-6 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col items-center justify-center text-center'>
                        <h3 className='text-sm font-bold text-zinc-500 uppercase tracking-wider mb-4'>ATS Score</h3>
                        <ScoreRing score={resume?.score || 0} />
                        <p className='mt-4 text-xs font-semibold text-zinc-400'>
                            {resume?.score >= 75 ? 'Excellent Profile' : resume?.score >= 50 ? 'Needs Polish' : 'Needs Work'}
                        </p>
                    </motion.div>

                    {/* Basic Info & Matched Skills */}
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.1 }}
                        className='col-span-1 md:col-span-2 bg-white/80 backdrop-blur-md border border-zinc-200 rounded-3xl p-6 sm:p-8 shadow-sm hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col'>
                        
                        <div className='flex items-start gap-4 mb-6 border-b border-zinc-100 pb-6'>
                            <div className='w-14 h-14 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xl shrink-0'>
                                {resume?.name?.[0] || <FiUser />}
                            </div>
                            <div>
                                <h2 className='text-2xl font-bold text-zinc-900 leading-tight'>
                                    {resume?.name || 'Candidate Name'}
                                </h2>
                                <p className='text-zinc-500 font-medium'>{resume?.email}</p>
                            </div>
                        </div>

                        <div>
                            <div className='flex items-center gap-2 mb-3'>
                                <FiCheckCircle className='text-emerald-500' size={16} strokeWidth={3} />
                                <span className='text-sm font-bold text-zinc-900'>Found Skills</span>
                            </div>
                            <div className='flex flex-wrap gap-2'>
                                {resume?.skills?.slice(0, 15).map(s => <Tag key={s} text={s} color="green" />)}
                                {resume?.skills?.length > 15 && <Tag text={`+${resume.skills.length - 15} more`} color="green" />}
                            </div>
                        </div>
                    </motion.div>
                </div>

                {/* Missing Skills */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                    className='bg-white border border-red-100 rounded-2xl p-6 shadow-sm flex flex-col'>
                    <div className='flex items-center gap-2 mb-4'>
                        <FiZap className='text-red-500' size={18} />
                        <span className='text-sm font-bold text-zinc-900'>Missing Keywords & Skills</span>
                    </div>
                    <div className='flex flex-wrap gap-2'>
                        {resume?.missingSkills?.length > 0 
                            ? resume.missingSkills.map(s => <Tag key={s} text={s} color="red" />)
                            : <span className='text-sm text-zinc-500'>Your resume seems to cover standard industry keywords!</span>
                        }
                    </div>
                </motion.div>

                {/* Recommendations */}
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                    className='bg-white border border-indigo-100 rounded-2xl p-6 shadow-sm flex flex-col'>
                    <div className='flex items-center gap-2 mb-4'>
                        <FiTrendingUp className='text-indigo-500' size={18} />
                        <span className='text-sm font-bold text-zinc-900'>Recommendations to Improve</span>
                    </div>
                    <div className='flex flex-col gap-3'>
                        {resume?.recommendations?.map((s, i) => (
                            <div key={i} className='flex gap-3 items-start bg-indigo-50/50 p-4 rounded-xl border border-indigo-50'>
                                <span className='text-indigo-400 font-bold'>{(i+1).toString().padStart(2, '0')}</span>
                                <p className='text-sm text-zinc-700 leading-relaxed'>{s}</p>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </section>
        </div>
    </div>
    );

    // Upload section
    return (
    <div className='flex-1 flex flex-col text-zinc-900 font-sans w-full relative z-10'>

        <div className='px-4 sm:px-6 md:px-8 py-6 md:py-8 transition-all duration-300 w-full flex-1 flex flex-col'>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <button onClick={() => setMoblieOpen(true)} className='md:hidden text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 p-1.5 rounded-md transition-colors'>
                <FiSidebar size={18} />
              </button>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <p className='text-zinc-500 text-xs font-medium mb-1 uppercase tracking-wider'>Career Tools</p>
                <h2 className='text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight'>
                  ATS Scorer
                </h2>
              </motion.div>
            </div>
            {resume && (
                <button onClick={() => dispatch(setResume(null))} className='flex items-center gap-2 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-lg shadow-sm transition-all active:scale-95'>
                    <FiUploadCloud size={16} />
                    <span className="hidden sm:inline">Score New Resume</span>
                    <span className="sm:hidden">New</span>
                </button>
            )}
          </div>

          <section className='flex flex-1 items-center justify-center pb-12'>
                <motion.div
                    initial={{ y: 30, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 0.4 }}
                    className='w-full max-w-md rounded-3xl overflow-hidden bg-white border border-zinc-200 p-6 sm:p-8 shadow-xl shadow-black/5'>
                    
                    <p className='text-xs text-indigo-600 font-bold tracking-widest uppercase mb-2'>Step 1 of 2</p>
                    <div className='w-full h-1.5 bg-zinc-100 rounded-full mb-6'>
                        <div className='h-full bg-indigo-600 rounded-full w-1/2' />
                    </div>

                    <h2 className='text-2xl font-bold mb-2 text-zinc-900'>Upload Your Resume</h2>
                    <p className='text-zinc-500 text-sm mb-6 leading-relaxed'>
                        We'll score your ATS compliance and give you actionable feedback to improve.
                    </p>

                    <label className={`relative flex flex-col items-center justify-center w-full h-48 sm:h-56 rounded-2xl border-2 border-dashed cursor-pointer transition-colors ${file ? "border-indigo-400 bg-indigo-50" : "border-zinc-300 bg-zinc-50 hover:border-indigo-300 hover:bg-zinc-100/50"}`}>
                        <FiUploadCloud className={`text-4xl sm:text-5xl mb-3 ${file ? "text-indigo-500" : "text-zinc-400"}`} />
                        <p className={`text-sm font-semibold text-center px-4 ${file ? "text-indigo-700" : "text-zinc-600"}`}>
                            {file ? file.name : "Click or drag PDF here"}
                        </p>
                        <p className="text-xs text-zinc-400 mt-2">PDF only • Max 2MB</p>
                        <input type='file' accept='.pdf' className='hidden' onChange={(e) => setFile(e.target.files[0])} />
                    </label>

                    <button
                        onClick={uploadResume}
                        disabled={!file || loading} 
                        className='mt-6 w-full h-12 rounded-xl font-bold text-sm bg-zinc-900 text-white shadow-md hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]'>
                        {loading ? "Analyzing..." : "Analyze Resume"}
                    </button>
                    
                    <p className='text-[10px] text-center text-zinc-400 mt-4 font-bold uppercase tracking-wider'>Cost: 10 Credits</p>
                </motion.div>
            </section>
        </div>
    </div>
    );
}
export default Scorer;
