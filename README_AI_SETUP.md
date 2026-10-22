# Gibi Gubae AI Hub V7 — starter package

## What's included
- `index.html`: V6 app plus an AI page with four modes: Orthodox learning assistant, Bible quiz generator, lesson planner, and anonymous engagement insights.
- `backend/cloudflare-worker.js`: starter backend using Cloudflare Workers AI. The API key is not placed in the public website.
- `manifest.webmanifest`, `sw.js`, `assets/`: PWA files.

## Important status
The AI interface is added, but AI will **not answer yet** until the backend is deployed and its HTTPS URL is saved in the AI page. This package is not an APK. The current student database still uses localStorage on each device and does not sync between team members.

## Deploy the frontend
1. Back up your current GitHub repository first.
2. Replace the repository's `index.html` with this package's `index.html`; upload/replace the PWA files and `backend` folder too.
3. Commit the changes. GitHub Pages should redeploy automatically.

## Set up the AI backend (Cloudflare Workers AI)
1. Open https://dash.cloudflare.com/ and sign in/create an account.
2. Go to Workers & Pages and create a Worker.
3. Open the Worker editor and replace its code with `backend/cloudflare-worker.js`.
4. Enable Workers AI and add an AI binding named exactly `AI` (the UI may expose this under Settings/Bindings → AI).
5. Set the allowed site origin in the worker to `https://thalionthegreat-rgb.github.io` if your GitHub Pages host changes. The worker code already uses this origin.
6. Deploy the Worker and copy its `https://...workers.dev` URL.
7. Open the published Gibi Gubae app → AI page → paste the Worker URL → Save backend URL → test with a general Bible-study question.

Cloudflare Workers AI has a published free daily allocation, currently 10,000 Neurons/day, subject to model/account limits. Review current terms and usage before wider rollout: https://developers.cloudflare.com/workers-ai/platform/pricing/ .

## Safety and privacy
- Never add API tokens or secrets to `index.html` or GitHub.
- Do not send student names, phone numbers, internal IDs, Fayda IDs, confession details, sins, Communion participation, or priest/student private conversations to AI.
- The engagement tool inserts aggregate counts only, not the student list or follow-up notes.
- AI-generated Scripture references and doctrinal answers must be checked before teaching; AI is not a priest or an authoritative Church source.
- The included in-memory request throttle is best-effort only and not production-grade. Before opening this to thousands of students, add durable rate limiting, abuse protection, monitoring, and access controls.

## Suggested build order
1. Deploy/test the Orthodox learning assistant.
2. Validate quiz references and improve quiz formats.
3. Add reusable lesson templates and saved lesson drafts.
4. Expand engagement analysis using anonymous aggregates only.
5. Separately design authenticated shared data for the three team members; do not confuse AI backend with student-data synchronization.
