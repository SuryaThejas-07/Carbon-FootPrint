# CarbonWise AI

CarbonWise AI is a premium, designer-grade sustainability platform built on Google Cloud. It enables individuals to calculate and track transport, energy, food, and waste emissions, adopt targeted reduction measures, simulate virtual offsets in a sandbox, and receive custom net-zero roadmap guidance powered by Gemini AI.

---

## Key Features

1. **Live Eco Score Circular Gauge**: A responsive, animated SVG progress ring that visualizes your real-time carbon rating, sweeping from 0 to your calculated score on mount.
2. **Interactive Carbon Offset Sandbox**: Virtual simulator for estimating emissions mitigation via afforestation (planting trees), green power grid matching, and ocean plastic recovery.
3. **Travel Commute Mode Simulator**: Interactive route analysis comparing emissions and costs across driving, public transit, cycling, and electric vehicles.
4. **4-Week Net-Zero AI Coach**: Guided step-by-step checklist checklist integrated with Gemini AI for building cleaner lifestyle habits.
5. **Analytics Deep-Dive**: Visual charts showing category breakdowns, monthly carbon trends, and personal footprint comparisons against international climate targets.
6. **Telemetry Math Matrix**: Immersive "Under the Hood" matrix presenting exact equations and data inputs powering each tracking module.

---

## Technical Stack

- **Monorepo Architecture**: Managed with NPM Workspaces
- **Frontend App**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, Recharts
- **Backend API**: Node.js, Express, TSUp (ESM output), Helmet, Cors
- **Database Layer**: PostgreSQL database mapped via Prisma ORM
- **Identity Provider**: Firebase Auth (Client SDK + Admin Node.js validation)
- **Generative AI**: Gemini API (Google Generative AI SDK)
- **Cloud Infrastructure**: Google Cloud Run, Cloud Build, Artifact Registry, Cloud SQL

---

## Monorepo Layout

```txt
├── apps
│   ├── api                   # Node.js backend Express server
│   └── web                   # Next.js 15 dashboard frontend application
├── packages
│   ├── database              # Prisma schema definition, migration logs & client wrapper
│   └── shared                # Shared TypeScript models and utility functions
├── scripts
│   ├── setup-gcp.ps1         # One-time Google Cloud Project API & Repo provisioner
│   ├── deploy.ps1            # Main build-and-deploy executor scripts (Windows)
│   └── docker-entrypoint-api.sh  # Backend container startup schema migration trigger
├── deploy.config             # Deployment environment parameters configuration
└── package.json              # Main workspaces configuration
```

---

## Local Development Setup

### Prerequisites
- Node.js version 20+
- A running PostgreSQL instance
- Google Cloud CLI (`gcloud`) installed locally

### Step-by-step Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up Environment Variables**:
   Create a `.env` file in the root workspace (copied from `.env.example` or matching the schema below) containing your PostgreSQL string, Firebase keys, and Gemini key.

3. **Initialize Database Schema & Seeds**:
   ```bash
   # Generate Prisma Client
   npm run db:generate
   
   # Run PostgreSQL migrations
   npm run db:migrate
   
   # Seed default database metrics
   npm run db:seed
   ```

4. **Launch Dev Server**:
   ```bash
   npm run dev
   ```
   - Frontend: `http://localhost:3000`
   - Backend API: `http://localhost:8088`

---

## Environment Variables Configuration

Copy `.env.example` to `.env` and configure:

```env
# Database Credentials
DATABASE_URL="postgresql://user:password@localhost:5473/carbonwise"

# Server Execution Parameters
PORT=8088

# API Access Credentials
GEMINI_API_KEY="your-gemini-key"
FIREBASE_API_KEY="your-firebase-key"
FIREBASE_PROJECT_ID="your-firebase-project-id"

# Frontend / Web Parameters (baked in at build time)
NEXT_PUBLIC_API_BASE_URL="http://localhost:8088"
NEXT_PUBLIC_FIREBASE_API_KEY="your-firebase-key"
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN="your-firebase-project.firebaseapp.com"
NEXT_PUBLIC_FIREBASE_PROJECT_ID="your-firebase-project-id"
```

---

## Google Cloud Run Deployment

Deployment is automated using Cloud Build and Cloud Run.

### 1. Configure deployment values
Create a `deploy.config` file at the root:
```env
GOOGLE_CLOUD_PROJECT=your-gcp-project-id
GCP_REGION=us-east4
GCP_CLOUD_SQL_INSTANCE=project-id:region:db-instance-name
DATABASE_URL=postgresql://user:password@localhost/carbonwise?host=/cloudsql/project-id:region:db-instance-name
GEMINI_API_KEY=your-gemini-key
NEXT_PUBLIC_FIREBASE_API_KEY=your-firebase-key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your-firebase-project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your-firebase-project-id
USE_SECRET_MANAGER=false
```

### 2. Run Setup Provisioner
Configure GCP permissions, enable Cloud Run/Build APIs, and provision the Artifact Registry repository:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 setup
```

### 3. Deploy API
Build and submit the container to Cloud Run:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 api
```
Take note of the deployed URL (e.g., `https://carbonwise-api-xxxxx.run.app`).

### 4. Deploy Frontend Web
Add `NEXT_PUBLIC_API_BASE_URL` to `deploy.config` and deploy:
```powershell
NEXT_PUBLIC_API_BASE_URL=https://carbonwise-api-xxxxx.run.app
```
Then run:
```powershell
powershell -ExecutionPolicy Bypass -File scripts/deploy.ps1 web
```
Once completed, it will print the public URL of the web dashboard.

---

## Testing & Accessibility Verification

### Automated Testing
Unit tests are implemented using **Vitest** in the shared package `@carbonwise/shared` to validate core carbon math, band categorization, recommendations, and gamified challenges.
- To execute tests locally:
  ```bash
  npm test
  ```

### Accessibility (A11y) Focus
The user interface conforms to web accessibility standards:
- **Semantic HTML Structure**: Elements are organized using native HTML5 markup (`<header>`, `<main>`, `<section>`, `<footer>`, `<article>`).
- **Explicit Label Associations**: All input fields (text, numbers, selectors, and range sliders) use explicit `id` parameters mapped directly to corresponding `<label htmlFor="...">` elements. This guarantees full compatibility with screen readers and keyboard focus managers.
- **Visual Contrast**: Dark modes leverage HSL color pairings with sufficient contrast ratios to accommodate visually impaired users.

