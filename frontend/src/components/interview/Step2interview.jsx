/**
 * FILE: frontend/src/components/interview/Step2interview.jsx
 * PURPOSE: The core interview interaction UI. Handles real-time speech-to-text (WebSpeech API),
 * text-to-speech (Speech Synthesis API) for the AI, WebRTC camera toggling, code execution overlays, 
 * and submitting answers to the backend.
 */
import React, { useEffect, useRef } from 'react'
import { useState } from 'react'
import maleVideo from "../../assets/male-ai.mp4"
import femaleVideo from "../../assets/female-ai.mp4"
import { AnimatePresence, motion } from "motion/react"
import { FiArrowRight, FiCamera, FiCameraOff, FiClock, FiCode, FiMessageSquare, FiMic, FiMicOff } from 'react-icons/fi'
import CodeEditor from './CodeEditor'
import Timer from './Timer'
import { submitAnswer } from '../../apis/interview.api'
import { useNavigate } from 'react-router-dom'
function Step2interview({ interviewData, user }) {
const navigate = useNavigate()
  // ── State ──
  const [question, setQuestion] = useState(interviewData.question);
  const [currentIndex, setCurrentIndex] = useState(interviewData.currentQuestion || 0);
  const [answer, setAnswer] = useState("");
  const [interimAnswer, setInterimAnswer] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(interviewData.question.timer || 60);
  const [timerActive, setTimerActive] = useState(true); // paused once the answer is submitted

  // UI toggles
  const [micOn, setMicOn] = useState(true); // user's manual preference — only changed by the mic button
  const [cameraOn, setCameraOn] = useState(false);
  const [codeOpen, setCodeOpen] = useState(false);

  // Speech
  const [isAIPlaying, setIsAIPlaying] = useState(false);
  const [subtitle, setSubtitle] = useState("");
  const [selectedVoice, setSelectedVoice] = useState(null);
  const [voiceGender, setVoiceGender] = useState("female");
  const [introSpoken, setIntroSpoken] = useState(false);

  // Refs
  const aiVideoRef = useRef(null);
  const userVideoRef = useRef(null);
  const recognitionRef = useRef(null);
  const streamRef = useRef(null);


  const videoSource = voiceGender === "female" ? femaleVideo : maleVideo
  const progress = ((currentIndex + 1)/(interviewData.totalQuestions))*100
  const showMicon = micOn && !isAIPlaying

  // Speech recognition

  useEffect(()=>{
    if(!("webkitSpeechRecognition" in window))return;
    const rec = new window.webkitSpeechRecognition()
     rec.lang = "en-US";
    rec.continuous = true;
    rec.interimResults = true;
    rec.onresult = (e)=>{
      let currentFinal = "";
      let currentInterim = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) {
          currentFinal += e.results[i][0].transcript;
        } else {
          currentInterim += e.results[i][0].transcript;
        }
      }
      if (currentFinal) {
        setAnswer((prev) => prev + " " + currentFinal.trim());
      }
      setInterimAnswer(currentInterim);
    }
    recognitionRef.current = rec
  },[])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
        streamRef.current = null;
      }
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, []);


  const startMic = ()=>{
    recognitionRef.current?.start()
  }
  const stopMic = ()=>{
    recognitionRef.current?.stop()
  }

  const toggleMic = ()=>{
    if(micOn){
      stopMic()
    }else{
      startMic()
    }
    setMicOn(!micOn)
  }

  const toggleCamera =async ()=>{
    if(cameraOn){
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      setCameraOn(false);

    }else{
      try {
        const stream = await navigator.mediaDevices.getUserMedia({video:true})
        streamRef.current = stream
        setCameraOn(true)
        setTimeout(()=>{
          if(userVideoRef.current) userVideoRef.current.srcObject = stream

        },100)
      } catch (error) {
        setCameraOn(false)
      }
    }
  }

  const handleSubmitCode= (code) => {
   setAnswer((prev)=>{
    const separator = prev.trim() ? "\n\n--- Code ---\n" : "--- Code ---\n";
    return prev + separator + code
   });
   setCodeOpen(false)
    
  }

  useEffect(()=>{
    if (timeLeft <= 0 || !timerActive) return;
    const t = setInterval(() => setTimeLeft((p) => p - 1), 1000);
    return () => clearInterval(t);

  },[timeLeft , timerActive])


  useEffect(()=>{
    const load = ()=>{
      const voices = window.speechSynthesis.getVoices()
      if(!voices.length)return;
      const female = voices.find(v => /zira|samantha|female/i.test(v.name));
      const male   = voices.find(v => /david|mark|male/i.test(v.name));
      if (female)      { setSelectedVoice(female); setVoiceGender("female"); }
      else if (male)   { setSelectedVoice(male);   setVoiceGender("male"); }
      else             { setSelectedVoice(voices[0]); setVoiceGender("female"); }
    }
    load()
    window.speechSynthesis.onvoiceschanged = load

  },[])

  const speakText = (text)=>
    new Promise((resolve)=>{
      if (!window.speechSynthesis || !selectedVoice || !text?.trim()) { resolve(); return; }

      window.speechSynthesis.cancel()

      setTimeout(()=>{
        const utter = new SpeechSynthesisUtterance(text.replace(/,/g, ", ... ").replace(/\./g, ". ... "))
        utter.voice  = selectedVoice;
        utter.rate   = 0.92;
        utter.pitch  = 1.05;
        utter.volume = 1;
        utter.onstart=()=>{
          setIsAIPlaying(true)
          stopMic()
          // aiVideoRef.current?.play()
        }
        utter.onend=()=>{
          // aiVideoRef.current?.pause()
          setIsAIPlaying(false)
          if(micOn) startMic()
            setTimeout(()=>{ setSubtitle("");resolve() },300)
        }
        setSubtitle(text)
        window.speechSynthesis.speak(utter)
      },150)
    
    })
  

  useEffect(()=>{
    if(!selectedVoice || introSpoken)return;
    const runIntro=async () => {
      setIntroSpoken(true)
      await new Promise((r) => setTimeout(r, 1200));
      await speakText(`Welcome ${user?.name.split(" ")[0]}! Let's begin your interview.`);
      await new Promise((r) => setTimeout(r, 900));
      await speakText(interviewData.question.question);
    }
    runIntro()

  },[selectedVoice])



  useEffect(()=>{
    setQuestion(interviewData.question);
    setCurrentIndex(interviewData.currentQuestion);
    setTimeLeft(interviewData.question.timer || 60);

  },[interviewData])

  
  useEffect(()=>{
    if(!selectedVoice || !introSpoken)return;
    const speakQuestion = async () => {
      await new Promise((r) => setTimeout(r, 900));
      await speakText(question.question);
    }
    speakQuestion()

  },[question])

  useEffect(()=>{
     setTimeLeft(question.timer || 60);
    setTimerActive(true);

  },[question])



  useEffect(()=>{
    if(timeLeft !== 0)return;
    const autoSubmit = async () => {
      await speakText("Time is up. Submitting your answer now.");
      const finalAnswer = answer.trim() || "No answer provided. Time over.";

      setLoading(true)

    const res = await submitAnswer({ interviewId: interviewData.interviewId, answer:finalAnswer})

    if(res.completed){
       setFeedback(res.feedback);
        await new Promise((r) => setTimeout(r, 700));
        await speakText(
          res.feedback?.feedback ||
          "Great job! Your interview is complete. Preparing your report now."
        );
        setLoading(false);
        navigate(`/interview/${interviewData.interviewId}/report`);
        return;
    }

     setFeedback(res.feedback);
      await new Promise((r) => setTimeout(r, 700));
      await speakText(
        res.feedback?.feedback ||
        "Noted your answer. Let's move to the next question."
      );
      setLoading(false);
      setQuestion(res.question);
      setCurrentIndex(res.currentQuestion);
      setAnswer("");
      setFeedback(null);


    }


    autoSubmit()
   

  },[timeLeft])


  const submit =async ()=>{

    if(!answer.trim())return;

    setTimerActive(false)
    setLoading(true)

    const res = await submitAnswer({ interviewId: interviewData.interviewId, answer})

    if(res.completed){
       setFeedback(res.feedback);
        await new Promise((r) => setTimeout(r, 700));
        await speakText(
          res.feedback?.feedback ||
          "Great job! Your interview is complete. Preparing your report now."
        );
        setLoading(false);
        navigate(`/interview/${interviewData.interviewId}/report`);
        return;
    }

     setFeedback(res.feedback);
      await new Promise((r) => setTimeout(r, 700));
      await speakText(
        res.feedback?.feedback ||
        "Noted your answer. Let's move to the next question."
      );
      setLoading(false);
      setQuestion(res.question);
      setCurrentIndex(res.currentQuestion);
      setAnswer("");
      setFeedback(null);

  }

  


  return (
    <div className='flex-1 w-full relative z-10 flex items-center justify-center p-3 sm:p-5 font-sans'>

      {codeOpen && <CodeEditor onClose={()=>setCodeOpen(false)} onSubmitCode={handleSubmitCode} />}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className='w-full max-w-5xl bg-white/90 backdrop-blur-xl border border-zinc-200/80 rounded-[24px] overflow-hidden shadow-2xl shadow-indigo-900/5 grid lg:grid-cols-[36%_64%]'>
        {/* left */}

        <div className='flex flex-col border-b lg:border-b-0 lg:border-r border-zinc-200 p-4 sm:p-5 gap-4 bg-zinc-50/50'>

          {/* Ai Video */}
          <div className='relative rounded-2xl overflow-hidden bg-black aspect-video border border-zinc-200 shadow-sm'>
            <video
              src={videoSource}
              ref={aiVideoRef}
              muted
              playsInline
              preload="auto"
              loop
              className="w-full h-full object-cover"
            />
            {isAIPlaying && (
              <div className='absolute bottom-2 left-2 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-full px-2.5 py-1'>
                <div className='flex gap-0.5 items-end h-3'>
                  {[1, 2, 3].map(i => (
                    <motion.div
                      key={i}
                      className="w-0.5 bg-white rounded-full"
                      animate={{ height: ["4px", "12px", "4px"] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: i * 0.15 }}
                    />
                  ))}
                </div>
                <span className='text-[10px] text-white/90 font-medium'>AI Speaking</span>
              </div>
            )}
          </div>

          <div className='min-h-[52px] flex items-center'>
            <AnimatePresence>
              {subtitle &&
                <motion.div
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className='w-full rounded-xl bg-white border border-zinc-200 px-3 py-2 shadow-sm'>
                  <p className="text-xs text-zinc-600 leading-relaxed text-center font-medium">{subtitle}</p>
                </motion.div>}
            </AnimatePresence>
          </div>

          <div className='relative rounded-2xl overflow-hidden bg-zinc-100 border border-zinc-200 shadow-inner aspect-video flex items-center justify-center'>
            {cameraOn ?
              <>
                <video
                  ref={userVideoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-full object-cover scale-x-[-1]"
                />
                <div className='absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5'>
                <span className="text-[10px] text-white/90">You</span>
                </div>
              </>
              :
              <div className='flex flex-col items-center gap-2'>
                <div className='w-14 h-14 rounded-full bg-white border border-zinc-200 flex items-center justify-center shadow-sm'>
                <span className='text-2xl font-bold text-zinc-400'>{user?.name.charAt(0).toUpperCase()}</span>
                </div>
                <span className='text-xs text-zinc-500 font-medium'>{user?.name.split(" ")[0]}</span>
                </div>}     
          </div>

          <div className='flex flex-col items-center gap-1.5 pt-1'>
            <div className='flex items-center justify-center gap-3'>
              <motion.button
              aria-label={showMicon ? "Mute Microphone" : "Unmute Microphone"}
              onClick={toggleMic} 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  showMicon ? "bg-white border-zinc-200 text-zinc-700 shadow-sm hover:bg-zinc-50" : "bg-red-50 border-red-200 text-red-500 shadow-sm"
                }`}>
                  {showMicon ? <FiMic size={15}/> : <FiMicOff size={15}/>}
              </motion.button>

              <motion.button 
              aria-label={cameraOn ? "Turn off Camera" : "Turn on Camera"}
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={toggleCamera}
              className={`w-10 h-10 rounded-xl flex items-center justify-center border transition-all ${
                  cameraOn ? "bg-white border-zinc-200 text-zinc-700 shadow-sm hover:bg-zinc-50" : "bg-zinc-100 border-zinc-200 text-zinc-400 hover:text-zinc-600 shadow-sm"
                }`}>
                  {cameraOn ? <FiCamera size={15}/> : <FiCameraOff size={15}/>}
              </motion.button>

              <motion.button 
              aria-label="Open Code Editor"
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              onClick={()=>setCodeOpen(true)}
              className="w-10 h-10 rounded-xl flex items-center justify-center border bg-white border-zinc-200 text-zinc-600 hover:text-zinc-900 shadow-sm hover:bg-zinc-50 transition-all">
                <FiCode size={15}/>
              </motion.button>
            </div>

            <div className='min-h-[14px] flex items-center justify-center mt-1'>
              {micOn && isAIPlaying && (
                <span className="text-[10px] font-semibold text-amber-600">Mic paused — AI is speaking</span>)}
            </div>

            <span className="text-[10px] text-zinc-500 text-center font-medium mt-1">
              Coding question? Use <FiCode size={10} className="inline -mt-0.5" /> to write &amp; add code
            </span>
          </div>

        </div>
        {/* right */}

        <div className='flex flex-col p-4 sm:p-6 bg-white'>

          <div className='flex items-start justify-between mb-4'>
            <div> 
              <h2 className='text-base sm:text-lg font-bold text-zinc-900'>
                AI Interview
              </h2>
              <div className='flex items-center gap-2 text-zinc-500 font-medium text-xs mt-1'>
                <FiClock size={12}/>
                <span className='capitalize'>{question.difficulty}</span>
              </div>
            </div>

            <div className='flex flex-col items-end gap-1.5 min-w-[110px]'>
              <Timer timeLeft={timeLeft} totalTime={question.timer || 60}/>
            </div>
          </div>

          <motion.div 
          initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          className='relative overflow-hidden rounded-2xl bg-indigo-50 border border-indigo-100 p-4 sm:p-5 mb-4 shadow-sm'>
            <div className='relative flex items-center gap-2.5 mb-3'>
              <div className='w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center shrink-0 shadow-sm'>
                <FiMessageSquare size={14}/>
              </div>
              <p className='text-xs font-semibold text-indigo-700 uppercase tracking-wider'>Question {currentIndex + 1}</p>
            </div>
            <p className='relative text-indigo-950 font-medium text-sm sm:text-base leading-relaxed'>
              {question.question}</p>
          </motion.div>

          <div className='mb-4'>
            <div className='flex justify-between text-[10px] font-bold uppercase tracking-wider text-zinc-500 mb-1.5'>
            <span>Progress</span>
            <span>{currentIndex+1} / {interviewData.totalQuestions}</span>
            </div>
            <div className='w-full h-1.5 rounded-full bg-zinc-100 overflow-hidden'>
            <div className='h-full bg-indigo-600 rounded-full transition-all duration-500' style={{width: `${progress}%`}} /></div>
          </div>

          <div className='flex-1 flex flex-col min-h-0'>
            <label className='text-xs font-bold text-zinc-700 uppercase tracking-wider mb-2'>Your Answer</label>
            <textarea
            onChange={(e) => {
              setAnswer(e.target.value);
              setInterimAnswer("");
            }}
            value={answer + (interimAnswer ? (answer ? " " : "") + interimAnswer : "")}
            rows={5}
            onKeyDown={(e)=>{if(e.ctrlKey && e.key === "Enter") submit()}}
            placeholder='Write your answer here… or speak if mic is on'
             className='flex-1 w-full rounded-2xl bg-white border border-zinc-200 p-4 text-sm font-medium text-zinc-900 outline-none resize-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 shadow-sm transition-all placeholder:text-zinc-400'/>
          </div>

          <div className='mt-3 min-h-[0px]'>
            <AnimatePresence>
              {feedback && (
                <motion.div 
                initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 ,y:6}}
                className='rounded-2xl border border-emerald-200 bg-emerald-50 p-4 max-h-40 overflow-y-auto shadow-sm'>
                  <p className='text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2'>AI Feedback</p>
                  <p className='text-sm text-emerald-900 font-medium leading-relaxed'>{feedback.feedback}</p>
                </motion.div>)}
            </AnimatePresence>
          </div>

          <div className='flex items-center justify-between mt-5 pt-4 border-t border-zinc-100'>
          <span className='text-xs font-medium text-zinc-500 hidden sm:block'>
            Press{" "}
            <span className='mx-1 rounded-md border border-zinc-200 bg-zinc-50 px-1.5 py-0.5 text-zinc-600 text-[10px] font-bold'>
             Ctrl+Enter
            </span>to Submit
          </span>

          <motion.button 
          whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={submit}
              disabled={loading || !answer.trim()}
              className='ml-auto h-11 min-w-[160px] justify-center px-6 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold flex items-center gap-2 disabled:opacity-50 disabled:hover:bg-indigo-600 shadow-md transition-all'
              >
                 {loading ? (
                <>
                  <div className="w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
                  Submitting…
                </>
              ) : (
                <>Submit Answer <FiArrowRight size={16} /></>
              )}
          </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default Step2interview
