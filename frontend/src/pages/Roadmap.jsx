/**
 * FILE: frontend/src/pages/Roadmap.jsx
 * PURPOSE: UI for generating AI learning roadmaps. Allows users to input a target role 
 * and package, optionally attach their resume score, and renders the generated roadmap.
 */
import { useOutletContext } from 'react-router-dom';
import toast from 'react-hot-toast';
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from "motion/react";
import { FiSidebar, FiCheck, FiChevronDown, FiClock, FiFileText, FiSend, FiX, FiZap } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { BsRocketTakeoff } from "react-icons/bs";
import { useCoins } from '../apis/user.api';
import api from '../utils/axios';
import { useSelector } from 'react-redux';
import RoadmapResult from '../components/roadmap/RoadmapResult';

const PACKAGE_OPTIONS = ["10 LPA", "15 LPA", "20 LPA", "30 LPA", "40 LPA"];

function Roadmap() {
  const { user, setUser, sidebarOpen, setSidebarOpen, moblieOpen, setMoblieOpen } = useOutletContext();
    const navigate = useNavigate();
    const [historyOpen, setHistoryOpen] = useState(false);
    const [roadmap, setRoadmap] = useState(null);
    const [role, setRole] = useState("");
    const [targetPackage, setTargetPackage] = useState(PACKAGE_OPTIONS[2]); // default "20 LPA"
    const [packageOpen, setPackageOpen] = useState(false);
    const [useResume, setUseResume] = useState(false);
    const [loading, setLoading] = useState(false);
    const [historyLoading, setHistoryLoading] = useState(false);
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    const { resume } = useSelector((state) => state.resume);

    useEffect(() => {
        getAllRoadmaps();
    }, []);

    const getAllRoadmaps = async () => {
        setHistoryLoading(true);
        try {
            const response = await api.get("/api/roadmap/all");
            setHistory(response.data.data);
            setHistoryLoading(false);
        } catch (error) {
            console.log(error);
            setHistoryLoading(false);
        }
    };

    const getRoadmapById = async (id) => {
        try {
            const response = await api.get(`/api/roadmap/${id}`);
            setRoadmap(response.data.data);
        } catch (error) {
            console.log(error);
        }
    };

    const handleGenerate = async () => {
        if (!role.trim() || loading) return;
        setLoading(true);
        setError("");
        try {
            try {
                const coinResponse = await useCoins({ coins: 20, action: "roadmap-builder" });
                setUser((prev) => ({
                    ...prev, interviewCoin: coinResponse?.interviewCoin,
                }));
            } catch (error) {
                setLoading(false);
                toast.error("Failed to use coins.");
                return;
            }

            const response = await api.post("/api/roadmap/generate", {
                role: role.trim(),
                targetPackage,
                useResume,
                resume
            });
            setRoadmap(response.data.data);
            getAllRoadmaps();
            setLoading(false);

        } catch (error) {
            console.error("Failed to generate roadmap:", error);
            setError("Something went wrong while generating your roadmap. Please try again.");
            setLoading(false);
        }
    };

    return (
        <div className='font-sans text-zinc-900 flex flex-col w-full h-full relative z-10'>
            {/* Header */}
            <div className='px-4 sm:px-6 md:px-8 py-6 md:py-8 transition-all duration-300 w-full'>
          <div className='flex items-center justify-between mb-8'>
            <div className='flex items-center gap-3'>
              <button onClick={() => setMoblieOpen(true)} className='md:hidden text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 p-1.5 rounded-md transition-colors'>
                <FiSidebar size={18} />
              </button>
              <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                <p className='text-zinc-500 text-xs font-medium mb-1 uppercase tracking-wider'>Planning</p>
                <h2 className='text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight'>
                  AI Roadmap
                </h2>
              </motion.div>
            </div>
            <button onClick={() => setHistoryOpen(!historyOpen)} className='flex h-9 items-center justify-center gap-2 rounded-lg border border-zinc-200 text-zinc-600 bg-white hover:bg-zinc-50 transition-colors px-4 shadow-sm'>
                <FiClock size={16} />
                <span className="text-sm font-semibold">History</span>
            </button>
          </div>
        </div>


            <main className='flex-1 overflow-y-auto pb-28 sm:pb-32'>
                <div className='max-w-4xl mx-auto px-4 sm:px-6'>
                    <AnimatePresence mode='wait'>
                        {!roadmap ? (
                            <motion.div
                                key="hero"
                                initial={{ opacity: 0, y: 15 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -15 }}
                                transition={{ duration: 0.4 }}
                                className='flex flex-col items-center text-center mt-12 sm:mt-20'>
                                <div className='w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center mb-6 text-indigo-600 shadow-sm'>
                                    <BsRocketTakeoff size={28} />
                                </div>
                                <h1 className='text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-900 mb-4'>
                                    Your Custom Career Path
                                </h1>
                                <p className='text-zinc-500 text-base md:text-lg max-w-xl leading-relaxed'>
                                    Enter your target role and expected package. Our AI will generate a personalized step-by-step roadmap tailored to your goals.
                                </p>
                            </motion.div>
                        ) : (
                            <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <RoadmapResult roadmap={roadmap} onClear={() => setRoadmap(null)} />
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </main>

            {/* Bottom Input Area */}
            <div className={`fixed bottom-0 right-0 z-20 bg-white border-t border-zinc-200 p-4 shadow-[0_-10px_40px_rgba(0,0,0,0.05)] transition-all duration-300 ${sidebarOpen ? "md:left-[260px] left-0" : "md:left-[72px] left-0"}`}>
                <div className='mx-auto max-w-4xl'>
                    <motion.div
                        initial={{ y: 20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.4, delay: 0.2 }}
                        className='flex items-center gap-2 p-2 rounded-2xl bg-zinc-50 border border-zinc-200 shadow-sm'>
                        <input
                            type='text'
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
                            placeholder='e.g., Frontend Developer, Data Scientist'
                            className='flex-1 bg-transparent border-none text-zinc-900 px-3 py-2 text-sm focus:outline-none placeholder:text-zinc-400'
                        />

                        {/* Package Dropdown */}
                        <div className='relative'>
                            <button
                                onClick={() => setPackageOpen(!packageOpen)}
                                className='flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold bg-white border border-zinc-200 text-zinc-700 hover:bg-zinc-50 transition-colors shadow-sm whitespace-nowrap'>
                                {targetPackage}
                                <FiChevronDown size={14} className="text-zinc-400" />
                            </button>
                            <AnimatePresence>
                                {packageOpen && (
                                    <motion.div
                                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                                        animate={{ opacity: 1, y: 0, scale: 1 }}
                                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                                        transition={{ duration: 0.15 }}
                                        className='absolute bottom-[calc(100%+8px)] right-0 w-32 rounded-xl border border-zinc-200 bg-white shadow-xl overflow-hidden py-1 z-30'>
                                        {PACKAGE_OPTIONS.map((pkg) => (
                                            <button
                                                key={pkg}
                                                onClick={() => { setTargetPackage(pkg); setPackageOpen(false); }}
                                                className={`w-full text-left text-xs px-4 py-2.5 transition-colors ${pkg === targetPackage ? "bg-indigo-50 text-indigo-700 font-semibold" : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"}`}>
                                                {pkg}
                                            </button>
                                        ))}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Use Resume Toggle */}
                        <button
                            onClick={() => setUseResume(!useResume)}
                            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all border ${useResume ? "bg-emerald-50 border-emerald-200 text-emerald-700" : "bg-white border-zinc-200 text-zinc-600 hover:bg-zinc-50 shadow-sm"}`}>
                            {useResume ? <><FiCheck size={14} /> Added</> : <><FiFileText size={14} /> Resume</>}
                        </button>

                        {/* Generate Button */}
                        <button
                            disabled={loading || !role.trim()}
                            onClick={handleGenerate}
                            className='flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap active:scale-[0.98]'>
                            {loading ? (
                                <><motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="inline-block"><FiZap size={14} /></motion.span><span className="hidden sm:inline">Generating…</span></>
                            ) : (
                                <><FiSend size={14} /><span className="hidden sm:inline">Generate</span></>
                            )}
                        </button>
                    </motion.div>
                    {error && <p className='text-[10px] text-red-500 mt-2 px-3'>{error}</p>}
                    <p className='text-[10px] text-center text-zinc-400 mt-2 font-medium uppercase tracking-wider'>Cost: 20 Credits</p>
                </div>
            </div>

            {/* History Sidebar */}
            <AnimatePresence>
                {historyOpen && (
                    <>
                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setHistoryOpen(false)}
                            className='fixed inset-0 z-40 bg-zinc-950/20 backdrop-blur-sm' />
                        <motion.aside
                            initial={{ x: "100%" }}
                            animate={{ x: 0 }}
                            exit={{ x: "100%" }}
                            transition={{ type: "spring", stiffness: 300, damping: 30 }}
                            className='fixed right-0 top-0 bottom-0 z-50 w-[300px] max-w-[85vw] bg-white border-l border-zinc-200 flex flex-col shadow-2xl'>
                            
                            <div className='flex items-center justify-between px-5 py-4 border-b border-zinc-200 bg-zinc-50'>
                                <span className='text-sm font-bold text-zinc-900'>Roadmap History</span>
                                <button onClick={() => setHistoryOpen(false)} className='p-1 rounded-md text-zinc-400 hover:text-zinc-900 hover:bg-zinc-200 transition-colors'><FiX size={16} /></button>
                            </div>

                            <div className='flex-1 overflow-y-auto p-4 space-y-3'>
                                {historyLoading ? (
                                    <p className="text-xs text-zinc-500 text-center py-8 font-medium">Loading history...</p>
                                ) : history.length === 0 ? (
                                    <p className="text-xs text-zinc-500 text-center py-8 font-medium">No roadmaps generated yet.</p>
                                ) : (
                                    history.map((h, i) => (
                                        <button key={i} onClick={() => { getRoadmapById(h._id); setHistoryOpen(false); }} className='w-full text-left p-4 rounded-xl bg-white border border-zinc-200 shadow-sm hover:shadow-md hover:border-indigo-300 transition-all'>
                                            <h3 className='text-sm font-bold text-zinc-900 truncate'>{h.title}</h3>
                                            <div className='flex justify-between items-center mt-2'>
                                                <span className='text-indigo-600 text-xs font-semibold bg-indigo-50 px-2 py-0.5 rounded-md'>{h.targetPackage}</span>
                                                <p className='text-xs text-zinc-500 font-medium'>{h.duration}</p>
                                            </div>
                                            <p className='text-[10px] text-zinc-400 mt-3 font-medium uppercase tracking-wider'>
                                                {new Date(h.createdAt).toLocaleDateString()}
                                            </p>
                                        </button>
                                    ))
                                )}
                            </div>
                        </motion.aside>
                    </>
                )}
            </AnimatePresence>
        </div>
    );
}
export default Roadmap;
