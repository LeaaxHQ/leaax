# leaax
Leaax — find out where your [li:ks] are

*English version*
![Leaax result showing a found public AI chat link](screenshots/Leaax-result-en.png)

*German version*
![Leaax-Ergebnis mit gefundenem KI-Chat-Freigabelink](screenshots/Leaax-result-de.png)

## **What's this about?**
Anyone using ChatGPT or other AI chats for work — client data, project details, internal notes — risks having a shared chat end up public without noticing. Freelancers and small businesses handling sensitive information in AI tools are especially exposed — but individuals aren't immune either.

## **The problem**
Shared ChatGPT chats alone have repeatedly turned up in plain Google searches in recent months — customer names, internal strategy, even credentials. The same applies to Claude, Gemini, and other AI chats. Most existing security tools are built for developers and large IT departments. For freelancers and small businesses who just want to know "is my ChatGPT chat exposed?", nothing has really fit — until now.

## **What Leaax does**
A free check in under 60 seconds: is your ChatGPT or AI chat publicly exposed, or does your email show up in a known data breach? Results come as a clear traffic-light score — red, yellow, green — in plain language, no jargon. Your checked data is never stored.

## **Status**
🚧 Building in public.

## MVP 1 — scope

MVP 1 ships exactly one core flow, live and usable: enter a name or
company → the app checks for publicly indexed AI chat share links tied to
it → result comes back as a traffic light (red/yellow/green).

Explicitly **not** part of MVP 1: cloud-share-link checks, user accounts,
paid subscriptions/ongoing monitoring. Those come later.

Checked providers (public, search-engine-indexed share links only —
see [`src/lib/providers.ts`](src/lib/providers.ts) to extend):
ChatGPT, Claude, Gemini, Grok, DeepSeek, Microsoft Copilot, Qwen.

## MVP 2 — scope

MVP 2 adds a second, independent check alongside MVP 1's (nothing from
MVP 1 is removed or replaced): enter an email address → the app checks it
against known data-breach databases via the
[XposedOrNot API](https://xposedornot.com/api_doc) (free, keyless) →
result comes back as the same red/yellow/green traffic light.

The homepage now has two optional fields (name/company, email) — at
least one must be filled to run a check. If both are filled, both checks
run in parallel and are shown as an overall result (the worse of the two)
with a per-check breakdown underneath.

See [`src/lib/breach/`](src/lib/breach) for the provider implementation
and [`src/app/api/check-email/route.ts`](src/app/api/check-email/route.ts)
for the endpoint.

## Getting started

Requirements: Node.js 20+ and npm.

```bash
npm install
cp .env.example .env.local
```

Then fill in `BRAVE_SEARCH_API_KEY` in `.env.local` (get a free key at the
[Brave Search API dashboard](https://api-dashboard.search.brave.com/)).
Without it, `/api/check` responds with a clear "not configured" error
instead of crashing — the UI still runs for local development.

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Security & privacy notes (MVP 1 + MVP 2)

- Neither the search query/name nor the email address (nor either check's
  results) are ever persisted (no DB, no file, no analytics call) — they
  live only in the memory of the request that handles them. See
  [`src/app/api/check/route.ts`](src/app/api/check/route.ts) and
  [`src/app/api/check-email/route.ts`](src/app/api/check-email/route.ts).
- Server logs never contain the search term or the email address, see
  [`src/lib/logger.ts`](src/lib/logger.ts) (shared by both endpoints).
- Input is sanitized/validated server-side for both checks, see
  [`src/lib/validate.ts`](src/lib/validate.ts) (`sanitizeQuery` /
  `sanitizeEmail`).
- Requests are rate-limited per IP, see [`src/lib/rateLimit.ts`](src/lib/rateLimit.ts)
  (in-memory per serverless instance — good enough for MVP-1/2's "no backend"
  constraint; swap for a shared store like Upstash Redis if abuse becomes an issue).
  The same limiter instance is shared across both `/api/check` and
  `/api/check-email`, keyed by IP.
- Security headers (CSP, HSTS, etc.) are set in [`next.config.ts`](next.config.ts).
- Full chat contents / breach details are never shown — only a masked
  label plus the source domain or breach name, see
  [`src/lib/mask.ts`](src/lib/mask.ts).

## Deployment

The app is a standard Next.js app, deployable on Vercel's free tier:

1. Push this repo to GitHub (already done — `LeaaxHQ/leaax`).
2. Import the repo in the [Vercel dashboard](https://vercel.com/new).
3. Add the `BRAVE_SEARCH_API_KEY` environment variable in the Vercel
   project settings.
4. Deploy, then attach the `leaax.com` domain under Project → Settings →
   Domains, and point its DNS at Vercel per their instructions.
