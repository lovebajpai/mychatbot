# Second Innings Chatbot — Complete Setup Guide

This guide walks you through deploying a chatbot on your Wix website (www.oursecondinnings.org) using **Cloudflare Workers** as the backend and the **Anthropic Claude API** for AI responses.

---

## Prerequisites

- **Claude Code** installed on your machine
- **Node.js** (v18+) installed — check with `node --version`
- A **GitHub account** (optional but helpful)

---

## Step 1: Get Your Anthropic API Key

1. Go to **https://console.anthropic.com**
2. Create an account (or sign in)
3. Navigate to **API Keys** in the left sidebar
4. Click **Create Key**, give it a name like `second-innings-chatbot`
5. Copy the key — it starts with `sk-ant-...`
6. Add billing info under **Plans & Billing** (pay-per-use; typical chatbot usage costs pennies/day)

> **Save this key somewhere safe.** You'll need it in Step 3.

---

## Step 2: Set Up the Cloudflare Worker Project

### 2a. Create a Cloudflare account

1. Go to **https://dash.cloudflare.com/sign-up**
2. Create a free account (no credit card needed)

### 2b. Install Wrangler (Cloudflare's CLI tool)

Open your terminal and run:

```bash
npm install -g wrangler
```

### 2c. Log in to Cloudflare from your terminal

```bash
npx wrangler login
```

This opens a browser window — authorize the connection.

### 2d. Create the project folder

```bash
mkdir second-innings-chatbot
cd second-innings-chatbot
```

### 2e. Add the project files

Place the two files I've provided into this folder:
- **`worker.js`** — the backend logic
- **`wrangler.toml`** — the Cloudflare configuration

Your folder should look like:
```
second-innings-chatbot/
├── worker.js
└── wrangler.toml
```

---

## Step 3: Deploy the Worker to Cloudflare

### 3a. Add your Anthropic API key as a secret

From inside the `second-innings-chatbot` folder, run:

```bash
npx wrangler secret put ANTHROPIC_API_KEY
```

It will prompt you to paste your API key. Paste it and press Enter.

> This stores the key securely — it never appears in your code or config files.

### 3b. Deploy

```bash
npx wrangler deploy
```

You'll see output like:
```
Uploaded second-innings-chatbot
Published second-innings-chatbot
  https://second-innings-chatbot.YOUR_SUBDOMAIN.workers.dev
```

**Copy that URL** — you need it for the next step.

### 3c. Test the Worker

You can test it immediately using curl:

```bash
curl -X POST https://second-innings-chatbot.YOUR_SUBDOMAIN.workers.dev \
  -H "Content-Type: application/json" \
  -d '{"message": "Who founded Second Innings?"}'
```

You should get a JSON response with a `reply` field containing the answer.

---

## Step 4: Add the Chat Widget to Your Wix Site

### 4a. Update the Worker URL in the widget

Open **`chat-widget.html`** and find this line near the top of the `<script>` section:

```javascript
const WORKER_URL = "https://second-innings-chatbot.YOUR_SUBDOMAIN.workers.dev";
```

Replace it with your actual Worker URL from Step 3b.

### 4b. Add the widget to Wix

1. Go to your **Wix Editor** (log in at wix.com → select your site → Edit Site)
2. Click **Add Elements** (the "+" button on the left)
3. Search for **"Embed"** → select **"Custom Element"** or **"Embed a Widget"**
   - In newer Wix editors: **Add** → **Embed Code** → **Embed HTML**
4. An HTML iframe box appears on your page
5. Click it → **Enter Code**
6. Paste the **entire contents** of `chat-widget.html`
7. Resize the iframe to approximately **400px wide × 550px tall**
8. Position it where you want (bottom-right corner is standard for chat widgets)
9. **Publish** your site

### 4c. Alternative: Use as a floating widget

If you want the chatbot to appear as a floating bubble on every page (like Intercom or Drift), you can use Wix's **Custom Code** injection instead:

1. In Wix Dashboard: **Settings** → **Custom Code** (under Advanced)
2. Click **Add Custom Code**
3. Paste this wrapper code:

```html
<div id="si-chatbot-wrapper" style="
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 380px;
  height: 540px;
  z-index: 9999;
  display: none;
">
  <iframe
    src="URL_WHERE_YOU_HOST_THE_HTML"
    style="width:100%; height:100%; border:none; border-radius:16px;"
  ></iframe>
</div>

<button id="si-chatbot-toggle" onclick="
  var w = document.getElementById('si-chatbot-wrapper');
  w.style.display = w.style.display === 'none' ? 'block' : 'none';
  this.textContent = w.style.display === 'none' ? '💬' : '✕';
" style="
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: linear-gradient(135deg, #2d6a4f, #40916c);
  color: white;
  border: none;
  font-size: 24px;
  cursor: pointer;
  z-index: 10000;
  box-shadow: 0 4px 20px rgba(0,0,0,0.15);
">💬</button>
```

4. Set placement to **Body - End** and apply to **All Pages**

> **Note:** For the floating widget approach, the `chat-widget.html` file needs to be hosted somewhere accessible via URL. Options:
> - Upload it to Cloudflare Pages (free) — see Step 5 below
> - Or host it on any static file host (GitHub Pages, Netlify, etc.)

---

## Step 5 (Optional): Host the Widget HTML on Cloudflare Pages

If you chose the floating widget approach in 4c, you need the HTML file hosted at a public URL:

```bash
# From inside your project folder, create a pages directory
mkdir public
cp chat-widget.html public/index.html

# Deploy to Cloudflare Pages
npx wrangler pages deploy public --project-name second-innings-widget
```

This gives you a URL like `https://second-innings-widget.pages.dev` — use this as the iframe `src` in step 4c.

---

## Step 6: Update the Knowledge Base

When you're ready to add detailed information about Love Bajpai (or any other content):

1. Open **`worker.js`**
2. Find the `KNOWLEDGE_BASE` constant at the top
3. Replace the placeholder sections with real content:

```javascript
const KNOWLEDGE_BASE = `
## About the Founder — Love Bajpai

### Background & Education
Love Bajpai grew up in [city] and studied [degree] at [university]...

### Career History
Love has over [X] years of experience in [field]. Previously, Love worked at...

### Why Love Founded Second Innings
The idea for Second Innings came when Love noticed that...

// ... add as much detail as you want
`;
```

4. Redeploy:

```bash
npx wrangler deploy
```

That's it — the chatbot immediately uses the updated knowledge.

---

## Step 7: Test Everything End-to-End

1. Visit your published Wix site
2. Open the chat widget
3. Try these test questions:
   - "Who founded Second Innings?"
   - "What courses do you offer?"
   - "Tell me about Love Bajpai"
   - "How can I volunteer?"
   - "What is quantum physics?" (should get a polite redirect)
4. Check that multi-turn conversation works (ask a follow-up)

---

## Using Claude Code to Make Changes

Since you have Claude Code installed, you can use it to quickly modify the project. Here are some useful commands:

```bash
# Navigate to your project
cd second-innings-chatbot

# Ask Claude Code to update the knowledge base
claude "Update the KNOWLEDGE_BASE in worker.js to include this info about the founder: [paste info]"

# Ask Claude Code to change the chatbot's personality
claude "Make the system prompt in worker.js more casual and friendly"

# Ask Claude Code to restyle the widget
claude "Change the chat widget colors to use navy blue instead of green"

# Deploy after changes
npx wrangler deploy
```

---

## Ongoing Maintenance Cheat Sheet

| Task | Command |
|------|---------|
| Update knowledge base | Edit `KNOWLEDGE_BASE` in `worker.js` → `npx wrangler deploy` |
| Change bot behavior | Edit `SYSTEM_PROMPT` in `worker.js` → `npx wrangler deploy` |
| View logs (live) | `npx wrangler tail` |
| Check deployment status | `npx wrangler deployments list` |
| Update API key | `npx wrangler secret put ANTHROPIC_API_KEY` |
| Re-style the widget | Edit `chat-widget.html` → re-paste in Wix or redeploy Pages |

---

## Cost Estimates

- **Cloudflare Workers**: Free (up to 100,000 requests/day)
- **Cloudflare Pages**: Free (if using floating widget option)
- **Anthropic API**: ~$0.003–$0.01 per conversation turn with Sonnet
  - 100 conversations/day ≈ $1–3/month
  - 10 conversations/day ≈ $0.10–0.30/month

---

## Troubleshooting

**"CORS error" in browser console:**
Make sure your Wix site domain is in the `ALLOWED_ORIGINS` array in `worker.js`. Also check if Wix is serving from a `.wixsite.com` subdomain (already handled in the code).

**"502 Bad Gateway" responses:**
Your Anthropic API key may be invalid or out of credits. Check at https://console.anthropic.com.

**Chat widget doesn't appear on Wix:**
Make sure the HTML embed iframe is large enough (at least 380×500px) and that the site is published (not just in preview).

**Slow responses:**
This is normal — Claude typically takes 2–5 seconds to generate a response. The typing indicator gives visual feedback during this time.
