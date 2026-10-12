# MAHINDRA · The Scale Series

Freelance portfolio of **Chintala Mahindra**, full-stack & cloud engineer: system design, Spring Boot + React, AWS, Docker, Kubernetes and CI/CD.

Live: https://main-hub-mu.vercel.app

## What's inside

- **Systems Lab**: an interactive scaling model. Push traffic, toggle autoscaling, CDN, Redis, a write queue and read replicas, and watch latency, errors, cost and the bottleneck move (`src/lib/sim.ts`).
- **Originals**: six architectures (five reference blueprints + ARGUS, open source). Each opens into a clickable diagram with a live request trace, scaling stages, key decisions and failure modes.
- **Platform**: a CI/CD pipeline you can run, including a failing canary with automatic rollback, plus Dockerfile, Kubernetes, GitHub Actions and Terraform starter configs.
- **Services, process, standards, FAQ** and a **project brief builder** that pre-fills an email or WhatsApp message.
- "Who's watching?" profiles (Founder / CTO / Agency) reorder the sections.

## Run

```bash
npm install
npm run dev      # http://localhost:5173
npm run build    # static site in dist/
```

Pushing to `main` deploys to Vercel automatically.

## Edit content

- Site copy, blueprints, services, FAQ: `src/data/portfolio.ts`
- Pipeline stages and code samples: `src/data/configs.ts`
- Resume source: `resume/resume.html` (after `npm install`, open it in Chrome → Print → Save as PDF, margins *None*, *Background graphics* on) and save over `public/Chintala_Mahindra_Resume.pdf`.

Blueprints are reference architectures, labelled as such on the site. Not affiliated with any streaming service.
