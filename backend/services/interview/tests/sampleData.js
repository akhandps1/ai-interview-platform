/**
 * FILE: backend/services/interview/tests/sampleData.js
 * PURPOSE: Core logic and configuration for sampleData.js.
 */
// Sample Mock Data for Testing

export const mockInterviewPayload = {
    role: "Frontend Developer",
    type: "technical",
    difficulty: "medium",
    persona: "FAANG Strict"
};

export const mockSubmitAnswerPayload = {
    answer: "I would use React.memo to prevent unnecessary re-renders in this component."
};

export const mockRedisData = JSON.stringify({
    success: true,
    interviews: [
        {
            _id: "test_interview_123",
            role: "Frontend Developer",
            type: "technical",
            status: "completed",
            overallScore: 85,
            questions: [
                { question: "Explain Virtual DOM", userAnswer: "It's a representation..." }
            ]
        }
    ],
    stats: {
        totalInterviews: 1,
        totalQuestions: 1,
        completed: 1,
        averageScore: 85
    }
});
