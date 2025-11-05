import { createAgent, gemini } from "@inngest/agent-kit";

const analyzeTicket = async (ticket) => {
    const supportAgent = createAgent({
        model: gemini({
            model: "gemini-1.5-flash-8b",  
            apiKey: process.env.GEMINI_API_KEY,
        }),
        name: "AgriAssistify.ai Ticket Analyzer",
        
        description: "AI-powered farm management platform that intelligently tracks agricultural issues, automatically assigns tasks to skilled workers, and delivers real-time notifications to optimize crop productivity.",

        
        system: `You are an expert AI assistant that processes agricultural support tickets for farm management.
                    Your job is to:
                    1. Summarize the farm issue (pest, irrigation, equipment, disease, harvest, etc.).
                    2. Estimate priority based on crop impact and urgency.
                    3. Provide helpful agricultural notes and resource links for farm managers.
                    4. List relevant farming skills required (pest-control, irrigation, machinery-repair, etc.).

                    IMPORTANT:
                    - Respond with *only* valid raw JSON.
                    - Do NOT include markdown, code fences, comments, or any extra formatting.
                    - The format must be a raw JSON object.

                    Repeat: Do not wrap your output in markdown or code fences.`,
    });

    const response = await supportAgent.run(`You are an agricultural ticket triage agent. Only return a strict JSON object with no extra text, headers, or markdown.
        
Analyze the following farm support ticket and provide a JSON object with:

- summary: A short 1-2 sentence summary of the agricultural issue.
- priority: One of "low", "medium", or "high" based on crop impact.
- helpfulNotes: Detailed agricultural guidance that a farm manager can use to solve this issue. Include useful farming resources or techniques if possible.
- relatedSkills: An array of farming skills required (e.g., ["pest-control", "irrigation", "machinery-repair"]).

Respond ONLY in this JSON format:

{
"summary": "Short summary of the farm issue",
"priority": "high",
"helpfulNotes": "Here are useful agricultural tips...",
"relatedSkills": ["pest-control", "irrigation"]
}

---

Ticket information:

- Title: ${ticket.title}
- Description: ${ticket.description}`);

    const raw = response.output[0].context;

    try {  
        const match = raw.match(/```json\s*([\s\S]*?)\s*```/i);
        const jsonString = match ? match[1] : raw.trim();
        return JSON.parse(jsonString);
    } catch (error) { 
        console.log("Failed to parse JSON from AI response:", error.message);
        return null;
    }
};

export default analyzeTicket;
