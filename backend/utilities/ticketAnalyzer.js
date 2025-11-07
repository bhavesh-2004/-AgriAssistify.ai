/**
 * TICKET ANALYZER - Using Gemini 2.5 Flash (Direct REST API)
 * Works with v1 API endpoint and JSON responses
 */

import dotenv from "dotenv";
dotenv.config();

/**
 * ✅ Helper function to call Gemini 2.5 Flash API
 */
async function callGeminiAPI(prompt) {
  const API_KEY = process.env.GEMINI_API_KEY;

  if (!API_KEY) {
    throw new Error("❌ GEMINI_API_KEY missing in .env file");
  }

  const url = `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 4096,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Gemini API error: ${response.status} - ${errorText.substring(0, 200)}`
    );
  }

  const data = await response.json();

  if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
    return data.candidates[0].content.parts[0].text;
  }

  throw new Error("Invalid API response structure");
}

/**
 * ✅ Analyze ticket using Gemini 2.5 Flash
 */
export const analyzeTicketWithGemini = async (ticket) => {
  try {
    console.log("🤖 Starting Gemini 2.5 Flash analysis for ticket:", ticket._id);

    if (!process.env.GEMINI_API_KEY) {
      throw new Error("Gemini API key not configured");
    }

    const prompt = `You are AgriAssistify AI, an expert agricultural consultant analyzing farm issues in India.

**FARM ISSUE DETAILS:**
- Title: ${ticket.title}
- Issue Type: ${ticket.issueType}
- Description: ${ticket.description}
- Affected Crop: ${ticket.affectedCrop || "Not specified"}
- Field Location: ${ticket.fieldLocation || "Not specified"}
- Urgency Level: ${ticket.urgencyLevel}
- Estimated Impact: ${ticket.estimatedImpact || "Not specified"}

**YOUR TASK:**
Analyze this agricultural issue and provide a comprehensive solution in JSON format.

**REQUIRED JSON OUTPUT FORMAT:**
{
  "summary": "Brief 1-2 sentence summary of the issue",
  "solution": "Detailed 250-300 word practical solution with specific steps for Indian farmers.",
  "recommendations": ["Step 1", "Step 2", "Step 3"],
  "possibleCauses": ["Cause 1", "Cause 2"],
  "preventionTips": ["Tip 1", "Tip 2", "Tip 3"],
  "urgencyAssessment": "low|medium|high",
  "estimatedResolutionTime": "3-5 days",
  "confidence": 85,
  "relatedSkills": ["pest-control", "irrigation", "crop-management"],
  "helpfulNotes": "Additional notes or cost estimates in INR if applicable"
}

**IMPORTANT:**
- Use farmer-friendly, simple Indian English.
- Include immediate & long-term actions.
- Avoid Markdown, code blocks, or comments.
- Return ONLY valid JSON — no extra text or formatting.`;

    console.log("📤 Sending prompt to Gemini 2.5 Flash...");

    let aiText = await callGeminiAPI(prompt);
    console.log("✅ Raw AI response received.");

    // 🧹 Clean response (remove markdown, code blocks)
    aiText = aiText.trim();
    aiText = aiText.replace(/^```json\s*/g, "").replace(/```$/g, "").trim();

    // 🧩 Try parsing JSON
    let aiSolution;
    try {
      aiSolution = JSON.parse(aiText);
      console.log("✅ Successfully parsed JSON from AI response");
    } catch (err) {
      console.error("❌ JSON parse error:", err.message);
      console.error("📄 AI raw output (first 400 chars):", aiText.substring(0, 400));
      throw new Error("Invalid JSON format in Gemini response");
    }

    // ✅ Validate essential fields
    const requiredFields = ["summary", "solution", "recommendations"];
    const missing = requiredFields.filter((f) => !aiSolution[f]);
    if (missing.length > 0)
      throw new Error(`Missing required fields: ${missing.join(", ")}`);

    return {
      summary: aiSolution.summary,
      solution: aiSolution.solution,
      recommendations: aiSolution.recommendations || [],
      possibleCauses: aiSolution.possibleCauses || [],
      preventionTips: aiSolution.preventionTips || [],
      urgencyAssessment:
        aiSolution.urgencyAssessment || ticket.urgencyLevel || "medium",
      estimatedResolutionTime: aiSolution.estimatedResolutionTime || "N/A",
      confidence: aiSolution.confidence || 80,
      relatedSkills: aiSolution.relatedSkills || ["general-agriculture"],
      helpfulNotes: aiSolution.helpfulNotes || "",
    };
  } catch (error) {
    console.error("❌ Gemini AI analysis error:", error.message);
    return {
      summary:
        "AI analysis failed. Manual expert review required for accurate diagnosis.",
      solution:
        "The AI system encountered an error. Please wait while an agricultural expert reviews this issue.",
      recommendations: [
        "Capture clear images of the issue for manual review.",
        "Monitor daily changes in crop condition.",
        "Avoid immediate chemical use until expert advice.",
      ],
      possibleCauses: ["AI analysis incomplete", "Network or parsing issue"],
      preventionTips: [
        "Regularly check soil and leaf health.",
        "Maintain irrigation schedule consistency.",
      ],
      urgencyAssessment: ticket.urgencyLevel || "medium",
      estimatedResolutionTime: "Pending expert review",
      confidence: 0,
      relatedSkills: ["expert-review"],
      helpfulNotes: "Error: " + error.message,
    };
  }
};

/**
 * ✅ Main analyzer function
 */
const analyzeTicket = async (ticket) => {
  console.log("🔍 Starting analysis for ticket:", ticket.title);
  const result = await analyzeTicketWithGemini(ticket);
  console.log("✅ Analysis complete:", result.summary);
  return result;
};

export default analyzeTicket;
