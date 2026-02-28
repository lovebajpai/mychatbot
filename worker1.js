// ============================================================
// Second Innings Chatbot — Cloudflare Worker
// ============================================================
// This worker acts as a secure proxy between your Wix chat
// widget and the Anthropic Claude API. It holds your API key
// safely and injects the knowledge base on every request.
// ============================================================

// ----------------------------------------------------------
// KNOWLEDGE BASE — Replace / expand this with real content
// ----------------------------------------------------------
const KNOWLEDGE_BASE = `
## About Second Innings
Second Innings (www.oursecondinnings.org) is a nonprofit organization that provides free-of-cost opportunities for unemployed and underemployed people to learn new technical skills and find better job opportunities.

### Why Second Innings Exists
Technical skills and tools used at workplaces have evolved rapidly in the last 10 years. People who entered the workforce earlier have not been able to keep up because:
- College courses are expensive and not everyone can afford them
- College courses are not necessarily designed for experienced professionals
- Learning methods have changed and content has moved online
- While online courses exist, getting started and finding the right starting point is a challenge

### What Second Innings Provides
1. **Free Educational Classes** — Courses in data analytics, cybersecurity, and cloud computing, designed by industry experts with emphasis on hands-on practice and capstone projects.
2. **Career Counselling & Placement Opportunities** — Partnerships with local employers, recruitment companies, and other organizations for career counseling and job interviews.
3. **Resume Review** — Industry experts and job placement professionals review student resumes and provide feedback.
4. **Mock Interviews** — Industry experts conduct mock interviews, provide insights into potential questions, critique answers, and build confidence.
5. **Community Connection** — Classes run in local libraries and online. Students and teachers are local, creating a supportive community.

### The Team
- **Love Bajpai** — Founder
- **Samir Bhatt** — Board/Steering Committee
- **Candace Freedenberg** — Board/Steering Committee
- **Kimberly Zanini-Bryant** — Industry Expert
- **Yogesh Kuvelkar** — Industry Expert
- **Pradumn Bajpai (Prad)** — Industry Expert
- **Mithilesh Satpathy** — Industry Expert
- **Varda Bajpai** — Contributor
- **Aryan Bajpai** — Contributor

## About the Founder — Love Bajpai
Love Bajpai is Vice president of software, data and AI engineering at Travelers Insurance. He has over 20 years of experience in the software industry, with a focus on data analytics, cloud computing, and cybersecurity. Love is passionate about using technology to create positive social impact and founded Second Innings to help people adapt to the changing job market and find meaningful employment opportunities.
### Background & Education
Engineer by training, Love holds an engineering degree in Electronics and communication engineering. He has MBA from Yale University. He has a strong background in software development, data engineering, and cloud architecture.


### Why Love Founded Second Innings
Love believes in the power of education and community to transform lives. He founded Second Innings to address in an attempt to give back to the society and help people who are struggling to find good job opportunities in the rapidly changing tech landscape. 

### Love's Current Role at Second Innings
Love is the founder and teacher at second innings. CUrrently he is teaching generative AI courses.


## Contact
- Website: www.oursecondinnings.org
- Instagram: @oursecondinnings
- Facebook: Second Innings
- LinkedIn: Our Second Innings
`;

// ----------------------------------------------------------
// SYSTEM PROMPT — Controls how the bot behaves
// ----------------------------------------------------------
const SYSTEM_PROMPT = `You are a friendly and helpful assistant for Second Innings, a nonprofit organization. Your primary role is to answer questions about Second Innings and its founder, Love Bajpai.

RULES:
- Answer questions based ONLY on the knowledge base provided below. Do not make up information.
- If someone asks something not covered in the knowledge base, politely say you don't have that information and suggest they visit www.oursecondinnings.org or use the Contact Us page.
- Be warm, encouraging, and professional — reflecting the supportive mission of Second Innings.
- Keep answers concise but informative. Use 2-4 sentences for simple questions, more for complex ones.
- If asked about courses or getting involved, encourage them to visit the website or reach out via the contact page.
- You may answer general questions about the topics Second Innings teaches (data analytics, cybersecurity, cloud computing) at a high level, but always tie it back to Second Innings.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}`;

// ----------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------
const CLAUDE_MODEL = "claude-sonnet-4-5-20250514";
const MAX_TOKENS = 1024;
const ANTHROPIC_API_URL = "https://api.anthropic.com/v1/messages";

// Update this to your Wix site's domain
const ALLOWED_ORIGINS = [
  "https://www.oursecondinnings.org",
  "https://oursecondinnings.org",
  // Add localhost for testing:
  "http://localhost:3000",
  "http://127.0.0.1:3000",
];

// ----------------------------------------------------------
// CORS HEADERS
// ----------------------------------------------------------
function getCorsHeaders(request) {
  const origin = request.headers.get("Origin") || "";
  const isAllowed = ALLOWED_ORIGINS.some(
    (allowed) => origin === allowed || origin.endsWith(".wix.com") || origin.endsWith(".wixsite.com")
  );

  return {
    "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400",
  };
}

// ----------------------------------------------------------
// MAIN HANDLER
// ----------------------------------------------------------
export default {
  async fetch(request, env) {
    const corsHeaders = getCorsHeaders(request);

    // Handle preflight CORS requests
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: corsHeaders });
    }

    // Only accept POST
    if (request.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    try {
      const body = await request.json();
      const userMessage = body.message;
      const conversationHistory = body.history || [];

      // Basic validation
      if (!userMessage || typeof userMessage !== "string" || userMessage.trim().length === 0) {
        return new Response(JSON.stringify({ error: "Message is required" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Length guard
      if (userMessage.length > 2000) {
        return new Response(JSON.stringify({ error: "Message too long (max 2000 characters)" }), {
          status: 400,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      // Build messages array (supports multi-turn conversation)
      const messages = [];
      for (const msg of conversationHistory.slice(-10)) {
        // Keep last 10 messages for context
        if (msg.role === "user" || msg.role === "assistant") {
          messages.push({ role: msg.role, content: msg.content });
        }
      }
      messages.push({ role: "user", content: userMessage });

      // Call Claude API
      const response = await fetch(ANTHROPIC_API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-api-key": env.ANTHROPIC_API_KEY,
          "anthropic-version": "2023-06-01",
        },
        body: JSON.stringify({
          model: CLAUDE_MODEL,
          max_tokens: MAX_TOKENS,
          system: SYSTEM_PROMPT,
          messages: messages,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Anthropic API error:", response.status, errorText);
        return new Response(
          JSON.stringify({ error: "Sorry, I'm having trouble right now. Please try again." }),
          {
            status: 502,
            headers: { ...corsHeaders, "Content-Type": "application/json" },
          }
        );
      }

      const data = await response.json();
      const assistantMessage = data.content
        .filter((block) => block.type === "text")
        .map((block) => block.text)
        .join("\n");

      return new Response(JSON.stringify({ reply: assistantMessage }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    } catch (err) {
      console.error("Worker error:", err);
      return new Response(
        JSON.stringify({ error: "Something went wrong. Please try again." }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }
  },
};
