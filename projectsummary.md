# Second Innings Chatbot — Project Summary

## What It Is
An AI-powered chatbot for [Second Innings](https://www.oursecondinnings.org), a nonprofit that provides free technical education (data analytics, cybersecurity, cloud computing) and career support to unemployed/underemployed people.

## Tech Stack
- **AI Model**: Anthropic Claude (`claude-sonnet-4-5-20250514`)
- **Backend**: Cloudflare Workers (edge-deployed, free up to 100k req/day)
- **Frontend**: Vanilla HTML/CSS/JS chat widget embedded in a Wix site
- **Deployment**: Wrangler CLI
- **API Key Storage**: Cloudflare Worker secret (`ANTHROPIC_API_KEY`)

## How It Works
1. Visitor types in the chat widget on the Wix site
2. Widget POSTs `{ message, history }` to the Cloudflare Worker
3. Worker injects a knowledge base into the system prompt and calls the Claude API
4. Claude's reply is returned to the widget as `{ reply: "..." }`
- Multi-turn context: last 10 messages from history are passed each request
- CORS is restricted to `oursecondinnings.org` and `.wix.com`/`.wixsite.com` domains

## Project Structure
```
mychatbot/
├── second-innings-chatbot/
│   ├── worker.js          # Main Cloudflare Worker (deployed)
│   ├── wrangler.toml      # Cloudflare deployment config
│   ├── chat-widget.html   # Frontend chat widget HTML/CSS/JS
│   └── public/
│       └── index.html     # Hosted widget (Cloudflare Pages)
├── worker1.js             # Earlier/alternate worker version
├── README.md              # Project overview
├── SETUP-GUIDE.md         # Full step-by-step deployment guide
└── package.json           # Has wrangler as a dependency
```

## Key Files
| File | Purpose |
|------|---------|
| `second-innings-chatbot/worker.js` | Main backend — knowledge base, system prompt, Claude API call |
| `second-innings-chatbot/wrangler.toml` | Cloudflare Worker config (name, compatibility date) |
| `second-innings-chatbot/chat-widget.html` | The embeddable frontend chat UI |
| `worker1.js` | Older version of the worker (reference/backup) |

## Knowledge Base (in worker.js)
Hardcoded in the `KNOWLEDGE_BASE` constant inside `worker.js`:
- About Second Innings (mission, what they provide, the team)
- About the founder Love Bajpai (background, Yale MBA, VP at Travelers Insurance)
- Contact info (website, Instagram, Facebook, LinkedIn)

**To update**: edit `KNOWLEDGE_BASE` in `second-innings-chatbot/worker.js`, then run `npx wrangler deploy`.

## System Prompt Behavior
- Answers only from the knowledge base (no hallucination)
- Redirects off-topic questions to the website
- Warm, encouraging, professional tone

## Deployment Commands
```bash
cd second-innings-chatbot
npx wrangler secret put ANTHROPIC_API_KEY   # set/update API key
npx wrangler deploy                          # deploy worker
npx wrangler tail                            # live logs
npx wrangler pages deploy public --project-name second-innings-widget  # deploy widget
```

## Cost Estimates
- Cloudflare Workers: Free (up to 100k req/day)
- Anthropic API: ~$0.003–$0.01 per conversation turn; ~$1–3/month at 100 conversations/day

## Owner / Context
- **Founder**: Love Bajpai — VP of Software, Data & AI Engineering at Travelers Insurance; Yale MBA
- **Site**: www.oursecondinnings.org
- **Wix embedding**: Widget pasted as HTML embed or injected via Wix Custom Code as a floating bubble
