/**
 * FILE: services/interview/graph/graph.js
 * PURPOSE: Defines the LangGraph state machine. 
 * This graph controls the flow of the interview (Start -> Ask Question -> Get Answer -> Give Feedback -> Summarize).
 */
import { END, START, StateGraph } from "@langchain/langgraph";
import InterviewState from "./state.js";
import { feedbackNode, interviewNode, summaryNode } from "./nodes.js";

/**
 * The initial router that decides what the AI should do first based on the user's action.
 */
function router(state){
    switch (state.action) {
    // If the interview just started, go to the interview agent to get the first question
    case "start":
      return "interviewAgent";

    // If the user just answered, go to the feedback agent to evaluate their answer
    case "feedback":
      return "feedbackAgent";

    default:
      return END;

  }
}

/**
 * After giving feedback, this router checks if the interview is over.
 */
function feedbackRouter(state){
    // If the required number of questions are completed, move to the summary agent
    if (state.completed) {
      return "summaryAgent";
    }

    // Otherwise, end this iteration (the frontend will trigger another 'start' for the next question)
    return END;
}


// Build the State Machine Graph
const graph = new StateGraph(InterviewState)
// Add all available agents as nodes in the graph
.addNode("interviewAgent",interviewNode)
.addNode("feedbackAgent",feedbackNode)
.addNode("summaryAgent",summaryNode)

// 1. Start the flow using the initial router
.addConditionalEdges(
    START,
    router,
    {
       interviewAgent:"interviewAgent" ,
       feedbackAgent:"feedbackAgent"
    }
)

// 2. Once the interview agent finishes generating a question, pause (END) and wait for user input
.addEdge(
    "interviewAgent",
    END
)

// 3. Once the feedback agent finishes grading an answer, check if we need to summarize
.addConditionalEdges(
    "feedbackAgent",
    feedbackRouter,
    {
        summaryAgent:"summaryAgent",
        [END]:END
    }
)

// 4. Once the summary is generated, the entire interview is officially over
.addEdge(
    "summaryAgent",
    END
)
.compile()


export default graph
