/**
 * FILE: frontend/src/pages/ResumeBuilder.jsx
 * PURPOSE: A multi-step wizard for building a resume from scratch. Includes a live preview
 * pane on desktop, mobile-responsive forms, and exports to PDF.
 */
import { useOutletContext } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import ResumeForm from '../components/resume/ResumeForm';
import initialData from '../components/resume/initialData';
import { motion } from "motion/react";
import { FiSidebar, FiArrowLeft, FiArrowRight, FiEye, FiDownload } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import PreviewResume from '../components/resume/PreviewResume';
import ATSTemplate from '../components/resume/ATSTemplate';
import DownloadBtn from '../components/resume/DownloadBtn';

const STEPS = [
  { step: 1, title: "Personal Information", subtitle: "Your basic contact details" },
  { step: 2, title: "Professional Summary", subtitle: "A quick intro about yourself" },
  { step: 3, title: "Skills", subtitle: "Your technical skills" },
  { step: 4, title: "Work Experience", subtitle: "Your past jobs & internships" },
  { step: 5, title: "Projects", subtitle: "Projects you have built" },
  { step: 6, title: "Education", subtitle: "Your academic background" },
];

const TOTAL_STEPS = STEPS.length;

function ResumeBuilder() {
    const { setMoblieOpen, user, setUser } = useOutletContext();
    const [currentStep, setCurrentStep] = useState(1);
    const [data, setData] = useState(initialData);
    const [showPreview, setShowPreview] = useState(false);
    const navigate = useNavigate();
    const resumeRef = useRef(null);
    const [scale, setScale] = useState(0.7);

    useEffect(() => {
        const updateScale = () => {
            const rightPane = document.getElementById('preview-pane');
            if (rightPane) {
                // Approximate A4 scaling based on container width
                const containerWidth = rightPane.clientWidth - 48; // padding
                const targetWidth = 794; // A4 width at 96dpi
                setScale(containerWidth / targetWidth > 1 ? 1 : containerWidth / targetWidth);
            }
        };
        updateScale();
        window.addEventListener("resize", updateScale);
        return () => window.removeEventListener("resize", updateScale);
    }, []);

    const progressPct = (currentStep / TOTAL_STEPS) * 100;
    const activeStep = STEPS.find((s) => s.step === currentStep);
    
    const goPrev = () => { if (currentStep > 1) setCurrentStep(currentStep - 1); };
    const goNext = () => { if (currentStep < TOTAL_STEPS) setCurrentStep(currentStep + 1); };
    const isLastStep = currentStep === STEPS.length;

    // Mobile fallback preview full screen
    if (showPreview && window.innerWidth < 1024) {
      return <PreviewResume data={data} user={user} setUser={setUser} onBack={() => setShowPreview(false)} />;
    }

    return (
        <div className='absolute inset-0 flex flex-col font-sans z-10 bg-white'>

            <div className='px-4 sm:px-6 md:px-8 py-6 md:py-8 transition-all duration-300 w-full'>
              <div className='flex items-center justify-between mb-8'>
                <div className='flex items-center gap-3'>
                  <button onClick={() => setMoblieOpen(true)} className='md:hidden text-zinc-500 hover:text-zinc-900 bg-white border border-zinc-200 p-1.5 rounded-md transition-colors'>
                    <FiSidebar size={18} />
                  </button>
                  <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <p className='text-zinc-500 text-xs font-medium mb-1 uppercase tracking-wider'>Career Tools</p>
                    <h2 className='text-2xl md:text-3xl font-bold text-zinc-900 tracking-tight'>
                      Resume Builder
                    </h2>
                  </motion.div>
                </div>
              </div>
            </div>

{/* Split Screen Layout */}
            <div className='flex-1 flex w-full'>
                
                {/* Left Pane: Form (Wizard) */}
                <div className='w-full lg:w-5/12 xl:w-1/3 flex flex-col bg-white border-r border-zinc-200'>
                    <div className='flex-1 px-5 py-6 sm:px-8 sm:py-8 overflow-y-auto'>
                        <div className='mb-6'>
                            <div className='flex items-center justify-between mb-2'>
                                <p className='text-xs text-zinc-400 font-semibold uppercase tracking-wider'>
                                    Step {currentStep} of {TOTAL_STEPS}
                                </p>
                                <p className='hidden text-xs text-zinc-400 sm:block font-medium'>
                                    {Math.round(progressPct)}%
                                </p>
                            </div>
                            <div className='w-full h-1.5 bg-zinc-100 rounded-full overflow-hidden'>
                                <div className='h-full bg-indigo-600 rounded-full transition-all duration-300' style={{ width: `${progressPct}%` }} />
                            </div>
                            <div className='mt-6'>
                                <h2 className='text-2xl font-bold text-zinc-900'>{activeStep.title}</h2>
                                <p className='mt-1 text-sm text-zinc-500'>{activeStep.subtitle}</p>
                            </div>
                        </div>

                        <div className='border-t border-zinc-100 mb-6'/>
                        
                        <div className="min-h-[400px]">
                             <ResumeForm step={currentStep} data={data} setData={setData} />
                        </div>

                        <div className='border-t border-zinc-100 mt-8 mb-6'/>

                        {/* Navigation buttons */}
                        <div className='flex items-center justify-between pb-8'>
                            <button
                                onClick={goPrev}
                                disabled={currentStep === 1}
                                className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium border transition-all
                                ${currentStep === 1
                                    ? "border-zinc-100 text-zinc-300 cursor-not-allowed bg-zinc-50"
                                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 bg-white shadow-sm"
                                }`}>
                                <FiArrowLeft size={16} />
                                <span className='hidden sm:block'>Back</span>
                            </button>

                            <div className='flex items-center gap-1.5'>
                                {STEPS.map((s) => (
                                    <button key={s.step}
                                        onClick={() => setCurrentStep(s.step)}
                                        className={`rounded-full transition-all ${s.step === currentStep
                                            ? "w-5 h-1.5 bg-indigo-600"
                                            : s.step < currentStep
                                            ? "w-1.5 h-1.5 bg-zinc-300"
                                            : "w-1.5 h-1.5 bg-zinc-200"
                                        }`} />
                                ))}
                            </div>

                            {isLastStep ? (
                                <DownloadBtn docRef={resumeRef} user={user} setUser={setUser} className="lg:hidden" />
                            ) : (
                                <button onClick={goNext} className='flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium bg-zinc-900 border border-zinc-800 text-white shadow-md hover:bg-zinc-800 transition-all'>
                                    <span className='hidden sm:block'>Next</span><FiArrowRight size={16} />
                                </button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Pane: Live Preview (Hidden on mobile) */}
                <div id="preview-pane" className='hidden lg:flex flex-col flex-1 bg-transparent overflow-y-auto items-center relative'>
                    
                    {/* Top action bar for live preview */}
                    <div className='sticky top-0 w-full flex justify-end px-6 py-4 z-10'>
                       <DownloadBtn docRef={resumeRef} user={user} setUser={setUser} />
                    </div>

                    <div className="flex-1 flex justify-center py-6 w-full">
                        <div style={{
                            transform: `scale(${scale})`,
                            transformOrigin: "top center",
                            height: "max-content"
                        }}>
                            <div ref={resumeRef} className='rounded-sm bg-white shadow-2xl border border-zinc-200'>
                                <ATSTemplate data={data} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>

            {/* Mobile Preview FAB */}
            <button 
                onClick={() => setShowPreview(true)} 
                className='lg:hidden fixed bottom-6 right-6 z-50 flex items-center justify-center gap-2 bg-indigo-600 text-white px-5 py-3 rounded-full shadow-lg shadow-indigo-600/30 font-medium active:scale-95 transition-transform'>
                <FiEye size={18} /> Preview
            </button>
        </div>
    );
}

export default ResumeBuilder;
