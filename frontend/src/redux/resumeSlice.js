/**
 * FILE: frontend/src/redux/resumeSlice.js
 * PURPOSE: Core logic and configuration for resumeSlice.js.
 */
import { createSlice } from "@reduxjs/toolkit";


const resumeSlice = createSlice({
    name:"resume",
    initialState:{
        resume:null
    },
    reducers:{
        setResume(state,action){
            state.resume = action.payload
        }
    }
})


export const {setResume} = resumeSlice.actions

export default resumeSlice.reducer