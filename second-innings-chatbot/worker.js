// ============================================================
// Second Innings Chatbot — Cloudflare Worker (v2 — fixed)
// ============================================================

// ----------------------------------------------------------
// KNOWLEDGE BASE
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

## 1. Identity & Overview

- **Full Name:** Love Bajpai
- **Title:** Vice President, Software & Data Engineering Chapter Lead
- **Employer:** Travelers (Hartford, CT)
- **Education:** Yale MBA; B.E. in Electronics & Communication (India)
- **Years of Experience:** 26+ years in enterprise technology
- **Location:** Hartford, CT area
- **Languages:** English, Hindi, Spanish
- **Personal Site:** [lovebajpai.com](https://www.lovebajpai.com)
- **Background:** First-generation American immigrant from India (arrived 1999)

---

### 2. Career Timeline

| Year | Role | Company / Location |
|------|------|--------------------|
| 2026–present | VP, Software & Data Engineering Chapter Lead | Travelers, Hartford, CT |
| 2023–2026 | AVP, Software Engineering — Bond & Specialty Insurance | Travelers, Hartford, CT |
| 2018–2023 | AVP, Enterprise Data & Analytics | Travelers, Hartford, CT |
| 2016–2018 | Senior Director, Organizational Strategy – IT | Travelers, Hartford, CT |
| 2015–2016 | VP, Health Care Data Operations | Health Technology Firm, West Hartford, CT |
| 2000–2015 | Software Developer → Senior Program Manager | Healthcare Technology, Hartford, CT (14-year progression) |
| 1999 | Immigrated to the United States | India → USA |

---

### 3. Measurable Impact & Key Metrics

- **$435M** acquisition integration successfully managed (end-to-end, due diligence through operational alignment)
- **$50M** in savings driven through AI and GenAI adoption
- **$100M** in new business opportunities unlocked through digital strategy
- **25%** engineering productivity increase over 3 years
- **10 months → 3 weeks** ML deployment time reduction via standardized frameworks
- **1,500+ students** taught technology skills for free (nonprofit)
- **26 years** of enterprise technology leadership

---

### 4. Areas of Expertise

- **AI & GenAI Strategy** — Moving AI from pilot to production at enterprise scale; currently leading GenAI-driven efficiency transformation across software and data engineering
- **Enterprise Data & Analytics** — Cloud-native data platforms, data strategy, cloud migration, DataSecOps, Centers of Excellence
- **Digital Transformation** — Structural and technological reinvention; strategy plus disciplined execution
- **M&A Technology Integration** — End-to-end technology integration for large acquisitions
- **Organizational Leadership** — Building high-performing engineering and data organizations; coaching, culture, psychological safety
- **FinOps & Cost Optimization** — Cloud financial discipline; cost avoidance without sacrificing innovation velocity

---

### 5. Technical Projects (Built by Hand)

#### Live: ¡Aprende Español! — Adaptive AI Language Coach
- **URL:** lovebajpai.com/lovespanishapp
- **Stack:** Claude Sonnet, Next.js, TypeScript, CSS Modules
- **Features:** 10 difficulty levels, AI-graded translation exercises, streak tracking, spaced repetition, conjugation reference guide, server-side API proxy, per-IP rate limiting
- **Purpose:** Personal Spanish learning; also a proof-of-concept for what a single engineer can build with a frontier AI model


### 6. Personal Story & Background

- Arrived in the US in 1999 from India with an engineering degree and no safety net
- Progressed from software developer to VP over 26 years across healthcare, insurance, and financial services
- First-generation immigrant; "earned every room" through work ethic and leadership
- Deeply believes in the multiplicative power of combining executive leadership with hands-on technical fluency

---

### 7. Personal Achievements & Interests

- **Yale MBA**
- **Black belt in karate**
- **Trekked to Everest Base Camp**
- **First-generation American immigrant**
- **Nonprofit Founder** — *Our Second Innings*: free tech education to 1,500+ students (courses include Generative AI for Professionals, Generative AI for Programmers, Python, Data Analytics 101)
- **Family man**
- **Multilingual:** English, Hindi, Spanish

---

### 8. Core Philosophies ("Work Hard. Be Nice. Have Fun.")

#### Work Hard
- Relentless, intentional effort is the common denominator behind every meaningful accomplishment
- "Full presence" over talent or luck — finishing what you start, staying invested
- Applied at Everest Base Camp (months of training), in the nonprofit (built evenings and weekends for years), and in enterprise leadership (thorough preparation for every decision)

#### Be Nice
- Psychological safety is the single greatest predictor of team performance
- Kindness and demanding excellence are not opposites
- Hard conversations done with care; public celebration, private feedback
- Teaches technology for free because access to opportunity should not depend on ability to pay

#### Have Fun
- The best teams laugh together as much as they ship together — joy is a strategy
- Fun means creating environments where people look forward to showing up
- Even the most demanding challenges (Everest, enterprise transformation) can be deeply joyful if approached that way

---

### 9. Love's Current Role at Second Innings
Love is the founder and teacher at Second Innings. Currently he is teaching Generative AI courses.


## Contact
- Website: www.oursecondinnings.org
- Instagram: @oursecondinnings
- Facebook: Second Innings
- LinkedIn: Our Second Innings
`;

// ----------------------------------------------------------
// SYSTEM PROMPT
// ----------------------------------------------------------
const SYSTEM_PROMPT = `You are a friendly and helpful assistant for Second Innings, a nonprofit organization. Your primary role is to answer questions about Second Innings and its founder, Love Bajpai.

RULES:
- Answer questions based ONLY on the knowledge base provided below. Do not make up information.
- If someone asks something not covered in the knowledge base, politely say you don't have that information and suggest they visit www.oursecondinnings.org or use the Contact Us page.
- Be warm, encouraging, and professional — reflecting the supportive mission of Second Innings.
- Keep answers concise but informative. Use 2-4 sentences for simple questions, more for complex ones.
- If asked about courses or getting involved, encourage them to visit the website or reach out via the contact page.

KNOWLEDGE BASE:
${KNOWLEDGE_BASE}`;

// ----------------------------------------------------------
// CONFIGURATION
// ----------------------------------------------------------
//const CLAUDE_MODEL = "claude-sonnet-4-5-20250514";
const CLAUDE_MODEL = "claude-sonnet-4-5-20250929";
const MAX_TOKENS = 1024;

const ALLOWED_ORIGINS = [
    "https://www.oursecondinnings.org",
    "https://oursecondinnings.org",
    "http://localhost:3000",
    "http://127.0.0.1:3000",
];

// ----------------------------------------------------------
// CORS HEADERS
// ----------------------------------------------------------
/*function getCorsHeaders(request) {
    const origin = request.headers.get("Origin") || "";
    const isAllowed = ALLOWED_ORIGINS.some(
        (allowed) => origin === allowed
    ) || origin.endsWith(".wix.com") || origin.endsWith(".wixsite.com");

    return {
        "Access-Control-Allow-Origin": isAllowed ? origin : ALLOWED_ORIGINS[0],
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
    };
}*/
function getCorsHeaders(request) {
    const origin = request.headers.get("Origin") || "*";
    return {
        "Access-Control-Allow-Origin": origin,
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Max-Age": "86400",
    };
}

// ----------------------------------------------------------
// DIAGNOSTIC ENDPOINT
// Visit YOUR_WORKER_URL?test=true in browser to run this
// ----------------------------------------------------------
async function handleTest(env) {
    try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "x-api-key": env.ANTHROPIC_API_KEY,
                "anthropic-version": "2023-06-01",
            },
            body: JSON.stringify({
                model: CLAUDE_MODEL,
                max_tokens: 50,
                messages: [{ role: "user", content: "Say hello in one word." }],
            }),
        });

        const status = response.status;
        const body = await response.text();

        return new Response(
            JSON.stringify({
                anthropic_reachable: response.ok,
                status_code: status,
                response_preview: body.substring(0, 500),
                api_key_present: !!env.ANTHROPIC_API_KEY,
                api_key_prefix: env.ANTHROPIC_API_KEY
                    ? env.ANTHROPIC_API_KEY.substring(0, 10) + "..."
                    : "NOT SET",
            }, null, 2),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    } catch (err) {
        return new Response(
            JSON.stringify({
                anthropic_reachable: false,
                error: err.message,
                error_type: err.constructor.name,
                api_key_present: !!env.ANTHROPIC_API_KEY,
            }, null, 2),
            {
                status: 200,
                headers: { "Content-Type": "application/json" },
            }
        );
    }
}

// ----------------------------------------------------------
// MAIN HANDLER
// ----------------------------------------------------------
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);
        const corsHeaders = getCorsHeaders(request);

        // Handle preflight CORS
        if (request.method === "OPTIONS") {
            return new Response(null, { status: 204, headers: corsHeaders });
        }

        // GET — health check or diagnostic
        if (request.method === "GET") {
            if (url.searchParams.get("test") === "true") {
                return handleTest(env);
            }
            return new Response(
                JSON.stringify({ status: "ok", message: "Chatbot Worker is running." }),
                { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }

        // Only POST for chat
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

            if (!userMessage || typeof userMessage !== "string" || userMessage.trim().length === 0) {
                return new Response(JSON.stringify({ error: "Message is required" }), {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            if (userMessage.length > 2000) {
                return new Response(JSON.stringify({ error: "Message too long" }), {
                    status: 400,
                    headers: { ...corsHeaders, "Content-Type": "application/json" },
                });
            }

            // Build messages
            const messages = [];
            for (const msg of conversationHistory.slice(-10)) {
                if (msg.role === "user" || msg.role === "assistant") {
                    messages.push({ role: msg.role, content: msg.content });
                }
            }
            messages.push({ role: "user", content: userMessage });

            console.log("Calling Anthropic API...");
            console.log("API key present:", !!env.ANTHROPIC_API_KEY);

            const response = await fetch("https://api.anthropic.com/v1/messages", {
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

            console.log("Anthropic status:", response.status);

            if (!response.ok) {
                const errorText = await response.text();
                console.error("Anthropic error:", response.status, errorText);
                return new Response(
                    JSON.stringify({
                        error: "Sorry, I'm having trouble right now. Please try again.",
                        debug: { status: response.status, detail: errorText.substring(0, 300) },
                    }),
                    { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
                );
            }

            const data = await response.json();
            const assistantMessage = data.content
                .filter((block) => block.type === "text")
                .map((block) => block.text)
                .join("\n");

            console.log("Success! Length:", assistantMessage.length);

            return new Response(JSON.stringify({ reply: assistantMessage }), {
                status: 200,
                headers: { ...corsHeaders, "Content-Type": "application/json" },
            });
        } catch (err) {
            console.error("Worker error:", err.message, err.stack);
            return new Response(
                JSON.stringify({
                    error: "Something went wrong. Please try again.",
                    debug: { type: err.constructor.name, message: err.message },
                }),
                { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
        }
    },
};