/**
 * FILE: backend/services/interview/graph/state.js
 * PURPOSE: Core logic and configuration for state.js.
 */
import { Annotation } from "@langchain/langgraph";


const InterviewState = Annotation.Root({
    action: Annotation(),

    type: Annotation(),

    role: Annotation(),

    persona: Annotation(),
    githubUrl: Annotation(),
    githubData: Annotation(),

    useResume: Annotation(),

    resume: Annotation(),

    questions: Annotation(),

    question: Annotation(),

    answer: Annotation(),

    difficulty: Annotation(),

    feedback: Annotation(),

    report: Annotation(),

    completed: Annotation(),
})


export default InterviewState