/**
 * FILE: frontend/src/redux/store.js
 * PURPOSE: Core logic and configuration for store.js.
 */
import { configureStore } from '@reduxjs/toolkit'
import resumeSlice from "./resumeSlice"
export const store =  configureStore({
  reducer: {
    resume:resumeSlice,
  },
})