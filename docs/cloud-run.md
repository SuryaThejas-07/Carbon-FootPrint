# Cloud Run deployment

## Important — do NOT run bare `gcloud run deploy`

Running `gcloud run deploy` from the **repository root** uses **Buildpacks**, which expect a single Node app with `index.js` at the root. This monorepo has separate API and web apps, so that command fails with:

```txt
Error: Cannot find module '/workspace/index.js'
The user-provided container failed to start and listen on PORT=8080
```

Always build with the **Dockerfiles** from the repo root and deploy with `--image`.

---

## Quick deploy (Windows)

### 1. One-time setup

```powershell
gcloud auth login
gcloud config set project carbonwise-499618
copy deploy.config.example deploy.config
# Edit deploy.config — set GEMINI_API_KEY etc.
npm run deploy:setup
```

### 2. Deploy API

```powershell
npm run deploy:api
```

### 3. Deploy Web (after API URL is known)

Add to `deploy.config`:
```env
NEXT_PUBLIC_API_BASE_URL=https://carbonwise-api-xxxxx.asia-south1.run.app
```

Then:
```powershell
npm run deploy:web
```

Or deploy both:
```powershell
npm run deploy:all
```

---

## Manual commands (Git Bash / Linux)

```bash
export GOOGLE_CLOUD_PROJECT=carbonwise-499618
export GCP_REGION=asia-south1
export GEMINI_API_KEY=your-key   # optional for AI

bash scripts/setup-gcp.sh   # if using bash setup
bash scripts/cloud-run-build.sh
```

---

## Prerequisites

1. Billing enabled on the GCP project
2. Artifact Registry repo `carbonwise` in your region (`scripts/setup-gcp.ps1` creates it)
3. APIs enabled: Cloud Run, Cloud Build, Artifact Registry

---

## Secret Manager (optional, for production)

Create secrets in [Secret Manager](https://console.cloud.google.com/security/secret-manager):

- `DATABASE_URL`
- `GEMINI_API_KEY`
- `GOOGLE_MAPS_API_KEY`
- `FIREBASE_API_KEY`

Then in `deploy.config`:
```env
USE_SECRET_MANAGER=true
```

Without Secret Manager, put `GEMINI_API_KEY` in `deploy.config` and it is passed as a Cloud Run env var.

---

## Cloud SQL

`DATABASE_URL` for Cloud SQL via Unix socket:

```txt
postgresql://USER:PASSWORD@localhost/carbonwise?host=/cloudsql/PROJECT:REGION:INSTANCE
```

In `deploy.config`:
```env
GCP_CLOUD_SQL_INSTANCE=project:region:instance
USE_SECRET_MANAGER=true
```

The API container runs `prisma migrate deploy` on startup when `DATABASE_URL` is set.

---

## Troubleshooting

| Error | Fix |
|-------|-----|
| `Cannot find module '/workspace/index.js'` | Don't use bare `gcloud run deploy`. Use `npm run deploy:api` |
| `Billing must be enabled` | Link billing at [console.cloud.google.com/billing](https://console.cloud.google.com/billing) |
| `failed to start on PORT=8080` | Wrong build method — use Dockerfile via Cloud Build |
| `Secret ... not found` | Set `USE_SECRET_MANAGER=false` or create secrets first |
| DNS / connection error during build | Check internet; retry `gcloud builds submit` |

**View logs:**
```powershell
gcloud run services logs read carbonwise-api --region asia-south1 --limit 50
```

**Delete failed test service:**
```powershell
gcloud run services delete carbon --region asia-south1 --quiet
```
