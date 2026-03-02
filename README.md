# ⚡ Tech Strategist — Weekly Email + Calendar

> AI-powered weekly tech research brief, delivered to your inbox every Monday
> with a `.ics` calendar attachment that blocks your Saturday + Sunday learning time.

---

## What It Does

Every week (Monday 8am by default), this script:

1. **Calls Claude API** (with web search) to generate 4 curated tech picks with full weekend learning plans
2. **Sends a rich HTML email** to your inbox with all picks, priority scores, use cases, and Fri→Sat→Sun plans
3. **Attaches a `.ics` file** with two calendar events — Saturday (learning day) and Sunday (build day), 9am–9pm — ready to import into Google Calendar, Apple Calendar, or Outlook in one click

---

## Sample Email Preview

```
⚡ Tech Brief — Week of March 3, 2026 · 4 Picks, 34h

PICKS:
1. LangGraph  [9/10]  AI
2. Bun v2     [8/10]  Backend  
3. Tauri 2    [8/10]  Frontend
4. Falco      [7/10]  Security

📅 Calendar events attached (Sat + Sun, 9am–9pm)
```

---

## Prerequisites

- **Node.js 18+** (`node --version`)
- **Anthropic API key** — get one at [console.anthropic.com](https://console.anthropic.com)
- **Gmail account** with an App Password (or any SMTP server)

---

## Setup

### 1. Install dependencies

```bash
cd tech-strategist
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and fill in:

```env
# Required
ANTHROPIC_API_KEY=sk-ant-api03-xxxxxxxxxxxxxxxx
SMTP_USER=your.email@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx    # Gmail App Password
EMAIL_TO=your.email@gmail.com

# Personalize your brief
DEV_STACK=TypeScript, Python, React
DEV_FOCUS=AI/ML, DevOps, Backend
DEV_LEVEL=intermediate
```

### 3. Get a Gmail App Password

If using Gmail (recommended):

1. Go to [myaccount.google.com/apppasswords](https://myaccount.google.com/apppasswords)
2. Sign in → Select app: **Mail** → Select device: **Other** → type "Tech Strategist"
3. Click **Generate** → copy the 16-character password
4. Paste it into `SMTP_PASS` in your `.env` file

> **Note:** 2-Step Verification must be enabled on your Google account first.

---

## Running

### Send immediately (test run)

```bash
# Test mode — generates brief, logs it, skips sending email
node index.js --test

# Send mode — generates and actually sends the email
node index.js --send
```

### Run as a cron job (automatic weekly delivery)

```bash
# Start the scheduler (runs in foreground)
node index.js
```

This starts a cron scheduler based on `CRON_SCHEDULE` in your `.env`.
Default: **Every Monday at 8:00 AM**.

### Run as a background service (production)

Using **PM2** (recommended):

```bash
npm install -g pm2

# Start
pm2 start index.js --name "tech-strategist"

# Auto-restart on reboot
pm2 startup
pm2 save

# View logs
pm2 logs tech-strategist

# Stop
pm2 stop tech-strategist
```

Using **systemd** (Linux):

```bash
# Create service file
sudo nano /etc/systemd/system/tech-strategist.service
```

```ini
[Unit]
Description=Tech Strategist Weekly Mailer
After=network.target

[Service]
Type=simple
User=YOUR_USERNAME
WorkingDirectory=/path/to/tech-strategist
ExecStart=/usr/bin/node /path/to/tech-strategist/index.js
Restart=on-failure
RestartSec=10
EnvironmentFile=/path/to/tech-strategist/.env

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable tech-strategist
sudo systemctl start tech-strategist
sudo systemctl status tech-strategist
```

---

## Cron Schedule Reference

Edit `CRON_SCHEDULE` in `.env`:

```
CRON_SCHEDULE=0 8 * * 1    # Monday 8:00 AM (default)
CRON_SCHEDULE=0 9 * * 1    # Monday 9:00 AM
CRON_SCHEDULE=0 8 * * 0    # Sunday 8:00 AM
CRON_SCHEDULE=0 7 * * 5    # Friday 7:00 AM
```

Cron syntax: `minute hour day-of-month month day-of-week`

---

## Calendar Events

The attached `.ics` file creates **two events** in your calendar:

| Event | Day | Time | Description |
|-------|-----|------|-------------|
| 🧠 Tech Learning Day | Saturday | 9am – 9pm | Follow tutorials, learn concepts |
| 🏗 Tech Build Day | Sunday | 9am – 9pm | Build your weekend project |

Both events include:
- Full brief details in the description
- 30-minute reminder notification
- Resource links for each pick

**To import:** Open the `.ics` attachment in your email — your calendar app will prompt you to add the events.

---

## Configuration Options

| Variable | Default | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | required | Your Claude API key |
| `SMTP_HOST` | `smtp.gmail.com` | SMTP server host |
| `SMTP_PORT` | `587` | SMTP port (587=TLS, 465=SSL) |
| `SMTP_USER` | required | Email sender address |
| `SMTP_PASS` | required | SMTP password / App Password |
| `EMAIL_TO` | same as SMTP_USER | Recipient(s), comma-separated |
| `ANTHROPIC_MODEL` | `claude-sonnet-4-20250514` | Claude model to use |
| `DEV_STACK` | - | Your tech stack (personalizes picks) |
| `DEV_FOCUS` | - | Your focus areas |
| `DEV_LEVEL` | `intermediate` | Your experience level |
| `DEV_CONTEXT` | - | Any extra context |
| `PICKS_COUNT` | `4` | Number of tech picks per brief |
| `PROD_READY_ONLY` | `true` | Prefer production-ready tools |
| `CRON_SCHEDULE` | `0 8 * * 1` | When to run (cron syntax) |
| `TIMEZONE` | `Asia/Kolkata` | Your timezone |

---

## Multiple Recipients

To send to multiple people:

```env
EMAIL_TO=you@gmail.com,colleague@company.com,team@startup.io
```

---

## Troubleshooting

**"Invalid login" error from Gmail**
→ You need an App Password, not your real Gmail password.
→ See the Gmail App Password section above.

**"Self signed certificate" error**
→ This is normal for some SMTP configs. The `rejectUnauthorized: false` setting handles it.

**Claude API errors**
→ Check your `ANTHROPIC_API_KEY` is valid at [console.anthropic.com](https://console.anthropic.com)
→ Make sure you have credits available.

**Calendar not importing**
→ Try opening the `.ics` file directly (double-click on Mac/Windows)
→ Or in Gmail: click the attachment → "Open with Google Calendar"

---

## File Structure

```
tech-strategist/
├── index.js              # Main entry point + cron scheduler
├── package.json
├── .env.example          # Copy to .env and fill in values
├── .env                  # Your config (gitignored)
└── src/
    ├── generator.js      # Claude API — generates the brief
    ├── mailer.js         # Nodemailer — sends the email
    ├── emailTemplate.js  # HTML + plain text email builder
    ├── calendar.js       # .ics file generator
    └── logger.js         # Terminal output formatting
```

---

## Cost Estimate

Each brief generation uses approximately:
- ~2,000–4,000 input tokens
- ~2,000–3,000 output tokens

With Claude Sonnet 4: roughly **$0.02–0.05 per brief**.
Monthly cost: ~$0.10–0.20 (4 briefs/month).

---

Built with ❤️ using [Anthropic Claude](https://anthropic.com) · [Nodemailer](https://nodemailer.com) · [node-cron](https://github.com/node-cron/node-cron)
