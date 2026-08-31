/**
 * FILE: frontend/src/components/Sidebar.jsx
 * PURPOSE: Global navigation component. Handles responsive toggling (desktop/mobile),
 * user logout, and displaying current credit balance.
 */
import React from 'react'
import { motion, AnimatePresence } from "motion/react"
import { GiTwoCoins } from "react-icons/gi";
import { FiSidebar, FiPlus, FiGrid, FiMic, FiFileText, FiMap, FiLogOut, FiAward, FiClock } from "react-icons/fi";
import { FaCirclePlus } from "react-icons/fa6";
import { useNavigate, useLocation } from 'react-router-dom';
import api from '../utils/axios';

const NAV_ITEMS = [
    { label: "Dashboard", icon: <FiGrid size={16} />, path: "/dashboard" },
    { label: "AI Mock Interview", icon: <FiMic size={16} />, path: "/interview" },
    { label: "Resume Builder", icon: <FiFileText size={16} />, path: "/resume" },
    { label: "AI Roadmap", icon: <FiMap size={16} />, path: "/roadmap" },
    { label: "Interview History", icon: <FiClock size={16} />, path: "/history" },
    { label: "ATS Scorer", icon: <FiAward size={16} />, path: "/scorer" },
];

function Sidebar({ sidebarOpen, setSidebarOpen, moblieOpen, setMoblieOpen, user, setUser }) {
    const navigate = useNavigate();
    const location = useLocation();

    const onLogout = async () => {
        try {
            await api.get("/api/auth/logout");
            setUser(null);
            navigate("/");
        } catch (error) {
            console.log(error);
        }
    };

    const onNewInterview = () => {
        navigate("/interview");
        setMoblieOpen(false);
    };

    const avatar = user?.name ? user.name.charAt(0).toUpperCase() : "U";

    const inner = (
        <div className='flex flex-col h-full bg-white shadow-sm'>
            {/* Header */}
            <div className='flex items-center justify-between px-4 py-4 shrink-0 border-b border-zinc-100'>
                <div className='flex items-center gap-2 overflow-hidden cursor-pointer' onClick={() => navigate("/")}>
                    <img src="/logo.png" alt="NexHire Logo" className="w-8 h-8 rounded-lg object-contain shrink-0 shadow-sm border border-zinc-200" />
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.span
                                initial={{ opacity: 0, width: 0 }}
                                animate={{ opacity: 1, width: "auto" }}
                                exit={{ opacity: 0, width: 0 }}
                                transition={{ duration: 0.2 }}
                                className='font-bold text-sm text-zinc-900 whitespace-nowrap overflow-hidden'>
                                NexHire
                            </motion.span>
                        )}
                    </AnimatePresence>
                </div>
                <div className='flex items-center'>
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className='hidden md:flex p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-md transition-all shrink-0'>
                        <FiSidebar size={16} />
                    </button>
                    <button
                        onClick={() => setMoblieOpen(false)}
                        className='md:hidden p-1 text-zinc-400 hover:text-zinc-800 hover:bg-zinc-100 rounded-md transition-all shrink-0'>
                        <FiSidebar size={16} />
                    </button>
                </div>
            </div>

            {/* Create Button */}
            <div className='px-3 pt-4 pb-2 shrink-0'>
                <button
                    onClick={onNewInterview}
                    className={`w-full flex items-center justify-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg py-2.5 transition-all shadow-sm active:scale-95 ${!sidebarOpen && 'px-0'}`}>
                    <FiPlus size={16} className='shrink-0' />
                    {sidebarOpen && <span className='text-sm whitespace-nowrap'>Create Interview</span>}
                </button>
            </div>

            {/* Nav Links */}
            {sidebarOpen && (
                <div className='px-4 pt-4 pb-2 text-[10px] font-semibold uppercase tracking-wider text-zinc-400'>
                    Platform
                </div>
            )}
            <nav className='flex flex-col gap-1 px-3 flex-1 overflow-y-auto mt-2'>
                {NAV_ITEMS.map((nav, i) => {
                    const isActive = location.pathname.includes(nav.path) || (location.pathname === '/' && nav.path === '/dashboard');
                    return (
                        <button
                            key={i}
                            onClick={() => {
                                navigate(nav.path);
                                setMoblieOpen(false);
                            }}
                            className={`flex items-center gap-3 rounded-lg py-2 transition-all text-sm font-medium ${
                                isActive
                                    ? "bg-indigo-50 text-indigo-700"
                                    : "text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100"
                            } ${sidebarOpen ? "px-3" : "justify-center px-0"}`}>
                            <span className='shrink-0'>{nav.icon}</span>
                            {sidebarOpen && <span className='whitespace-nowrap'>{nav.label}</span>}
                        </button>
                    );
                })}
            </nav>

            {/* Footer Profile & Coins */}
            <div className='border-t border-zinc-200 p-3 shrink-0 bg-zinc-50/50'>
                {sidebarOpen && (
                    <div
                        onClick={() => navigate("/billing")}
                        className='group flex cursor-pointer items-center justify-between gap-3 rounded-lg border border-zinc-200 bg-white px-3 py-2.5 mb-3 transition-all hover:border-indigo-300 hover:shadow-sm'>
                        <div className='flex items-center gap-2'>
                            <GiTwoCoins size={18} className='text-amber-500 shrink-0' />
                            <div className='flex flex-col text-left'>
                                <span className='text-[10px] uppercase tracking-wider text-zinc-500 font-medium'>Credits</span>
                                <span className='text-sm font-bold text-zinc-900'>{user?.interviewCoin || 0}</span>
                            </div>
                        </div>
                        <FaCirclePlus size={16} className='text-indigo-600 transition-transform group-hover:scale-110' />
                    </div>
                )}
                
                <div className={`flex items-center gap-3 ${!sidebarOpen && "justify-center"}`}>
                    <div className='w-8 h-8 rounded-full bg-zinc-900 flex items-center justify-center shrink-0 shadow-sm'>
                        <span className='text-white font-semibold text-xs'>{avatar}</span>
                    </div>
                    {sidebarOpen && (
                        <div className="flex-1 min-w-0 text-left">
                            <p className="text-zinc-900 text-sm font-medium truncate">{user?.name ?? "User"}</p>
                            <p className="text-zinc-500 text-xs truncate">{user?.email ?? "user@email.com"}</p>
                        </div>
                    )}
                    {sidebarOpen && (
                        <button
                            onClick={onLogout}
                            className='p-1.5 text-zinc-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors ml-auto'>
                            <FiLogOut size={16} />
                        </button>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            <motion.aside
                animate={{ width: sidebarOpen ? 260 : 72 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className='hidden md:flex fixed top-0 left-0 h-screen bg-white border-r border-zinc-200 flex-col z-40 overflow-hidden'>
                {inner}
            </motion.aside>

            <AnimatePresence>
                {moblieOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setMoblieOpen(false)}
                        className='fixed inset-0 bg-zinc-950/40 z-40 md:hidden backdrop-blur-sm' />
                )}
            </AnimatePresence>

            <AnimatePresence>
                {moblieOpen && (
                    <motion.aside
                        initial={{ x: -280 }}
                        animate={{ x: 0 }}
                        exit={{ x: -280 }}
                        transition={{ duration: 0.25, ease: "easeInOut" }}
                        className='fixed top-0 left-0 h-screen w-[280px] max-w-[85vw] bg-white border-r border-zinc-200 flex flex-col z-50 md:hidden overflow-hidden'>
                        {inner}
                    </motion.aside>
                )}
            </AnimatePresence>
        </>
    );
}

export default Sidebar;
