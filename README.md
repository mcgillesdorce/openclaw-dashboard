# Psyche Dashboard

Mission control for the psychology video pipeline.

- `/` — KPIs, cost trend, top videos, topic leaderboard
- `/billing` — API spend breakdown

## How data gets here

Data is pushed to private GitHub Gists by the pipeline after every run.
The dashboard fetches from those Gist raw URLs via `config.js` (gitignored).

## Setup

1. Deploy this repo to Vercel (connect GitHub → Import → Deploy)
2. In the pipeline directory, run:
   ```
   python sync_dashboard.py --init
   ```
   This creates the Gists and generates `config.js` automatically.
3. Copy the generated `config.js` into this directory.
4. Redeploy Vercel (or push a dummy commit to trigger rebuild).

## Sensitive data

- `config.js` is gitignored — Gist URLs never hit the repo
- No API keys, tokens, or pipeline secrets are ever in this repo
- Billing figures are real costs — Gists are unlisted (not indexed, but anyone with the URL can read them)
