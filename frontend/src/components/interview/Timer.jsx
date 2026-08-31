/**
 * FILE: frontend/src/components/interview/Timer.jsx
 * PURPOSE: Core logic and configuration for Timer.jsx.
 */
import React from 'react';
import { buildStyles, CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

function Timer({timeLeft, totalTime}) {
   const percentage = (timeLeft/totalTime)*100;
   
   // Transition to warning color when time is low
   const pathColor = percentage > 25 ? "#4F46E5" : "#EF4444"; // Indigo -> Red
   
  return (
    <div className='w-16 h-16 sm:w-20 sm:h-20 drop-shadow-sm'>
        <CircularProgressbar
          value={percentage}
          text={`${timeLeft}s`}
          styles={buildStyles({
            textSize: "26px",
            pathColor: pathColor,
            textColor: pathColor,
            trailColor: "#3F3F46", // zinc-700
            pathTransitionDuration: 0.5,
          })}
        />
    </div>
  );
}

export default Timer;
