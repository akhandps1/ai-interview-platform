/**
 * FILE: backend/services/roadmap/graph/roadmap.state.js
 * PURPOSE: Core logic and configuration for roadmap.state.js.
 */
import {Annotation} from "@langchain/langgraph"
  
export const RoadmapState = Annotation.Root({
    
  role: Annotation,

  targetPackage: Annotation,

  useResume: Annotation,

  resume: Annotation,

  roadmap: Annotation,

})