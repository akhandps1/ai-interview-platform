/**
 * FILE: frontend/src/components/interview/Step1setup.jsx
 * PURPOSE: Collects user preferences (role, persona, github URL, resume PDF) before starting 
 * an AI interview. Also deducts coins via the API.
 */
import toast from 'react-hot-toast';
import React, { useState } from 'react';
import { motion } from "motion/react";
import { FiArrowLeft, FiArrowRight, FiBriefcase, FiCheck, FiCheckCircle, FiFileText, FiUploadCloud } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { useCoins } from '../../apis/user.api';
import api from '../../utils/axios';
import { setResume } from '../../redux/resumeSlice';
import { startInterview } from '../../apis/interview.api';

function Step1setup({ user, setUser }) {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { resume } = useSelector((state) => state.resume);
    const [role, setRole] = useState("");
    const [type, setType] = useState("technical");
    const [persona, setPersona] = useState("Standard");
    const [githubUrl, setGithubUrl] = useState("");
    const [useResume, setUseResume] = useState(!!resume);
    const [file, setFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [starting, setStarting] = useState(false);

    const uploadResume = async () => {
        if (!file) return toast.error("Please select a PDF");
        
        try {
            setUploading(true);
            try {
                const coinResponse = await useCoins({ coins: 10, action: "resume-scorer" });
                setUser((prev) => ({ ...prev, interviewCoin: coinResponse?.interviewCoin }));
            } catch (error) {
                setUploading(false);
                toast.error("Failed to use coins.");
                return;
            }

            const formData = new FormData();
            formData.append("resume", file);
            const response = await api.post("/api/resume/upload", formData);
            dispatch(setResume(response?.data?.data));
            setUploading(false);
            setFile(null);
        } catch (error) {
            console.log(error);
            toast.error("Upload failed");
            setUploading(false);
        }
    };

    const start = async () => {
        setStarting(true);
        const response = await startInterview({ role, type, persona, githubUrl, useResume, resume });

        if (response) {
            try {
                const coinResponse = await useCoins({ coins: 50, action: "start-interview" });
                setUser((prev) => ({ ...prev, interviewCoin: coinResponse?.interviewCoin }));
            } catch (error) {
                setStarting(false);
                toast.error("Failed to use coins.");
                return;
            }
        }

        setStarting(false);
        if (response?.interviewId) {
            navigate(`/interview/${response.interviewId}`);
        } else {
            toast.error("Failed to start interview. Please check your connection and try again.");
        }
    };

    return (
        <div className='flex-1 w-full flex items-center justify-center p-4 sm:p-6 font-sans'>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className='w-full max-w-4xl bg-white/90 backdrop-blur-xl border border-zinc-200/80 rounded-2xl sm:rounded-3xl overflow-hidden grid lg:grid-cols-[40%_60%] shadow-2xl shadow-indigo-900/5'>

                {/* left pane */}
                <div className='p-6 sm:p-8 border-b lg:border-b-0 lg:border-r border-zinc-200 flex flex-col justify-start gap-6 bg-zinc-50'>
                    <div>
                        
                        <h2 className='mt-6 text-2xl sm:text-3xl font-bold text-zinc-900 leading-snug'>
                            Welcome back,<br />
                            {user?.name?.split(" ")[0]}
                        </h2>
                        <p className='mt-3 text-sm leading-relaxed text-zinc-500'>
                            Practice realistic AI interviews, receive instant feedback, and refine your skills before your next real-world interview.
                        </p>
                    </div>

                    <div className='space-y-3 mt-4'>
                        {[
                            "Personalized AI Questions",
                            "Resume Based Context",
                            "Detailed Performance Report",
                            "Real Interview Experience",
                        ].map((item, index) => (
                            <div key={index} className='flex items-center gap-3'>
                                <div className='flex items-center justify-center w-5 h-5 rounded-full bg-indigo-100 text-indigo-600'>
                                    <FiCheck size={12} strokeWidth={3} />
                                </div>
                                <span className='text-sm font-medium text-zinc-700'>{item}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* right pane */}
                <div className='p-6 sm:p-8 flex flex-col'>
                    <div className='flex-1'>
                        <h3 className='text-xl font-bold text-zinc-900 mb-6'>Interview Configuration</h3>
                        
                        <div className='space-y-6'>
                            <div>
                                <label className='flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2'>
                                    <FiBriefcase size={16} className="text-zinc-400" />
                                    Target Role
                                </label>
                                <input
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    placeholder='e.g. Frontend Developer, Product Manager'
                                    className='w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-400 shadow-sm'
                                />
                            </div>

                            <div>
                                <label className='flex items-center gap-2 text-sm font-semibold text-zinc-700 mb-2'>
                                    GitHub Profile URL (Optional - Wow Factor!)
                                </label>
                                <input
                                    value={githubUrl}
                                    onChange={(e) => setGithubUrl(e.target.value)}
                                    placeholder='e.g. https://github.com/torvalds'
                                    className='w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all placeholder:text-zinc-400 shadow-sm'
                                />
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-zinc-700 mb-2 block'>
                                    Interview Type
                                </label>
                                <div className='grid grid-cols-2 gap-3'>
                                    {['technical', 'hr'].map((t) => (
                                        <button key={t} onClick={() => setType(t)} className={`px-4 py-3 rounded-xl border text-sm font-semibold capitalize transition-all ${type === t ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm' : 'border-zinc-200 bg-white text-zinc-500 hover:border-zinc-300 hover:bg-zinc-50'}`}>
                                            {t}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-zinc-700 mb-2 block'>
                                    Interviewer Persona (Style)
                                </label>
                                <select 
                                    value={persona} 
                                    onChange={(e) => setPersona(e.target.value)}
                                    className='w-full bg-white border border-zinc-300 rounded-xl px-4 py-3 text-sm font-medium text-zinc-900 focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all shadow-sm cursor-pointer'
                                >
                                    <option value="Standard">Standard (Balanced)</option>
                                    <option value="FAANG Strict">FAANG Strict (Deep Algorithms & Hard Concepts)</option>
                                    <option value="Startup CTO">Startup CTO (Practical, Architecture, Shipping Fast)</option>
                                    <option value="Friendly HR">Friendly HR (Basic Tech, Heavy on Culture & Teamwork)</option>
                                </select>
                            </div>

                            <div>
                                <label className='text-sm font-semibold text-zinc-700 mb-2 block'>
                                    Base Questions on Resume?
                                </label>
                                <div className='flex items-center gap-4'>
                                    <button onClick={() => setUseResume(true)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${useResume ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
                                        <FiCheckCircle size={16} /> Yes
                                    </button>
                                    <button onClick={() => setUseResume(false)} className={`flex items-center gap-2 px-4 py-2.5 rounded-lg border text-sm font-medium transition-all ${!useResume ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-zinc-200 text-zinc-600 hover:bg-zinc-50'}`}>
                                        <FiCheckCircle size={16} /> No
                                    </button>
                                </div>
                            </div>

                            {/* Resume logic */}
                            {useResume && (
                                <div className='mt-2'>
                                    {resume ? (
                                        <div className='flex items-center justify-between p-4 rounded-xl border border-emerald-200 bg-emerald-50'>
                                            <div className='flex items-center gap-3'>
                                                <div className='w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600'>
                                                    <FiFileText size={18} />
                                                </div>
                                                <div>
                                                    <p className='text-sm font-bold text-emerald-800'>Resume Uploaded</p>
                                                    <p className='text-xs font-medium text-emerald-600 mt-0.5'>{resume.skills.length} skills analyzed</p>
                                                </div>
                                            </div>
                                            <button onClick={() => dispatch(setResume(null))} className='text-xs font-bold text-emerald-700 hover:text-emerald-900 px-3 py-1.5 rounded-md bg-emerald-100/50 hover:bg-emerald-200 transition-colors'>
                                                Change
                                            </button>
                                        </div>
                                    ) : (
                                        <div className='p-5 rounded-xl border border-dashed border-zinc-300 bg-zinc-50 flex flex-col items-center justify-center text-center gap-3'>
                                            <div className='w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center text-zinc-400'>
                                                <FiUploadCloud size={20} />
                                            </div>
                                            <div>
                                                <p className='text-sm font-semibold text-zinc-700'>Upload your Resume (PDF)</p>
                                                <p className='text-xs text-zinc-500 mt-1 max-w-[200px]'>AI will analyze it and tailor questions</p>
                                            </div>
                                            <input type='file' accept='.pdf' onChange={(e) => setFile(e.target.files[0])} className='text-xs w-full max-w-[220px] mx-auto file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100 cursor-pointer text-zinc-500' />
                                            {file && (
                                                <button onClick={uploadResume} disabled={uploading} className='w-full max-w-[220px] py-2 rounded-lg bg-zinc-900 text-white text-xs font-semibold hover:bg-zinc-800 transition-colors'>
                                                    {uploading ? 'Analyzing...' : 'Upload & Process'}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className='mt-8 pt-6 border-t border-zinc-200'>
                        <button
                            onClick={start}
                            disabled={!role || (useResume && !resume) || starting}
                            className='w-full h-12 flex items-center justify-center gap-2 rounded-xl bg-indigo-600 text-white text-sm font-bold shadow-md hover:bg-indigo-700 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]'>
                            {starting ? (
                                <>
                                    <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                                    Starting Interview...
                                </>
                            ) : (
                                <>Start Interview <FiArrowRight size={16} /></>
                            )}
                        </button>
                        <p className='text-[10px] text-center text-zinc-400 mt-3 font-medium uppercase tracking-wider'>Cost: 50 Credits</p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
}

export default Step1setup;
