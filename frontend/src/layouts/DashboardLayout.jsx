/**
 * FILE: frontend/src/layouts/DashboardLayout.jsx
 * PURPOSE: Core logic and configuration for DashboardLayout.jsx.
 */
import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';

function DashboardLayout({ user, setUser }) {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const [moblieOpen, setMoblieOpen] = useState(false);

    return (
        <div className="flex h-screen bg-zinc-50 overflow-hidden w-full font-sans relative">
            {/* Global Platform Background Grid */}
            <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(#e5e7eb 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
            
            <Sidebar
                sidebarOpen={sidebarOpen}
                setSidebarOpen={setSidebarOpen}
                moblieOpen={moblieOpen}
                setMoblieOpen={setMoblieOpen}
                user={user}
                setUser={setUser}
            />
            <main className={`flex-1 flex flex-col h-screen overflow-hidden z-10 relative transition-all duration-300 ${sidebarOpen ? "md:pl-[260px]" : "md:pl-[72px]"}`}>
                
                
                <div className="flex-1 overflow-y-auto w-full relative flex flex-col">
                    <Outlet context={{ user, setUser, sidebarOpen, setSidebarOpen, moblieOpen, setMoblieOpen }} />
                </div>
            </main>
        </div>
    );
}

export default DashboardLayout;
