# Second Innings Chatbot

An AI-powered chatbot for [Second Innings](https://www.oursecondinnings.org) — a nonprofit that provides free technical education and career support to unemployed and underemployed people.

The chatbot is built on **Cloudflare Workers** and powered by the **Anthropic Claude API**. It answers questions about Second Innings, its programs, and its founder, Love Bajpai.

---

## What It Does

- Answers visitor questions about Second Innings (courses, team, mission, contact info)
- Maintains multi-turn conversation context within a session
- Politely redirects off-topic questions back to the organization
- Runs at the edge via Cloudflare Workers — fast, globally distributed, and free up to 100k requests/day

---

## Tech Stack

| Layer | Technology |
|---|---|
| AI Model | Anthropic Claude (claude-sonnet) |
| Backend | Cloudflare Workers |
| Frontend Widget | Vanilla HTML/CSS/JS (embedded in Wix) |
| Deployment | Wrangler CLI |

---

## Project Structure

```
mychatbot/
├── second-innings-chatbot/
│   ├── worker.js          # Cloudflare Worker — Claude API proxy + knowledge base
│   ├── wrangler.toml      # Cloudflare deployment config
│   └── public/
│       └── index.html     # Hosted chat widget (for Cloudflare Pages)
├── worker1.js             # Alternate/earlier worker version
├── SETUP-GUIDE.md         # Full step-by-step deployment guide
└── package.json
```

---

## How It Works

1. A visitor types a message in the chat widget embedded on the Wix site
2. The widget sends the message (plus conversation history) to the Cloudflare Worker via POST request
3. The Worker injects the Second Innings knowledge base into the system prompt and calls the Anthropic Claude API
4. Claude's response is returned to the widget and displayed to the visitor

The Anthropic API key is stored as a Cloudflare Worker secret and never exposed in the code.

---

## Setup & Deployment

See [SETUP-GUIDE.md](./SETUP-GUIDE.md) for the full step-by-step instructions, including:

- Getting an Anthropic API key
- Setting up and deploying the Cloudflare Worker
- Embedding the chat widget in Wix
- Updating the knowledge base
- Cost estimates and troubleshooting

---

## About Second Innings

Second Innings is a nonprofit organization that offers free courses in **data analytics**, **cybersecurity**, and **cloud computing**, along with career counseling, resume reviews, and mock interviews — all run by industry experts in local libraries and online.

**Founder:** Love Bajpai — VP of Software, Data & AI Engineering at Travelers Insurance, Yale MBA
**Website:** [www.oursecondinnings.org](https://www.oursecondinnings.org)
**Instagram:** [@oursecondinnings](https://instagram.com/oursecondinnings)
