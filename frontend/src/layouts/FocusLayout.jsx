/**
 * FILE: frontend/src/layouts/FocusLayout.jsx
 * PURPOSE: Core logic and configuration for FocusLayout.jsx.
 */
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';

function FocusLayout({ user, setUser }) {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col min-h-screen bg-zinc-50 font-sans relative">
            {/* Global Platform Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            {/* Minimal Sticky Top Navbar */}
            <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-zinc-200 h-14 flex items-center justify-between px-4 md:px-6 shrink-0 shadow-sm">
                <div className='flex items-center gap-3'>
                    <div className='flex items-center gap-2 cursor-pointer' onClick={() => navigate("/dashboard")}>
                        <img src="/logo.png" alt="NexHire Logo" className="w-8 h-8 rounded-lg object-contain shadow-sm border border-zinc-200" />
                        <span className='font-bold text-lg tracking-tight text-zinc-900 hidden sm:block'>NexHire</span>
                    </div>
                    <div className="h-4 w-[1px] bg-zinc-300 hidden sm:block"></div>
                    <span className="text-zinc-500 text-sm font-medium hidden sm:block">Workspace</span>
                </div>
                
                <button 
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 text-sm font-medium text-zinc-600 hover:text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-50 px-3 py-1.5 rounded-md transition-colors shadow-sm">
                    <FiArrowLeft size={14} /> 
                    <span className="hidden sm:inline">Back to Dashboard</span>
                </button>
            </header>
            
            {/* Tool Content */}
            <main className="flex-1 flex flex-col w-full relative z-10">
                <Outlet context={{ user, setUser }} />
            </main>
        </div>
    );
}

export default FocusLayout;
