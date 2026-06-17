#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

if [[ -f deploy.config ]]; then
  set -a
  # shellcheck disable=SC1091
  source deploy.config
  set +a
fi

: "${GOOGLE_CLOUD_PROJECT:=carbonwise-499618}"
: "${GCP_REGION:=asia-south1}"

API_IMAGE="${GCP_REGION}-docker.pkg.dev/${GOOGLE_CLOUD_PROJECT}/carbonwise/carbonwise-api:latest"
WEB_IMAGE="${GCP_REGION}-docker.pkg.dev/${GOOGLE_CLOUD_PROJECT}/carbonwise/carbonwise-web:latest"

echo "Project: ${GOOGLE_CLOUD_PROJECT}"
echo "Region:  ${GCP_REGION}"

gcloud config set project "${GOOGLE_CLOUD_PROJECT}"

echo "Building API image from repository root..."
gcloud builds submit \
  --config cloudbuild.api.yaml \
  --substitutions="_REGION=${GCP_REGION}" \
  .

echo "Deploying API..."
API_DEPLOY_ARGS=(
  run deploy carbonwise-api
  --image "${API_IMAGE}"
  --region "${GCP_REGION}"
  --platform managed
  --allow-unauthenticated
  --port 8080
  --timeout 300
  --memory 512Mi
  --quiet
)

ENV_VARS="GOOGLE_CLOUD_PROJECT=${GOOGLE_CLOUD_PROJECT}"
[[ -n "${GOOGLE_CLOUD_BUCKET:-}" ]] && ENV_VARS+=",GOOGLE_CLOUD_BUCKET=${GOOGLE_CLOUD_BUCKET}"
[[ -n "${FIREBASE_PROJECT_ID:-}" ]] && ENV_VARS+=",FIREBASE_PROJECT_ID=${FIREBASE_PROJECT_ID}"
[[ -n "${GEMINI_API_KEY:-}" ]] && ENV_VARS+=",GEMINI_API_KEY=${GEMINI_API_KEY}"
API_DEPLOY_ARGS+=(--set-env-vars "${ENV_VARS}")

if [[ "${USE_SECRET_MANAGER:-}" == "true" ]]; then
  API_DEPLOY_ARGS+=(
    --set-secrets "DATABASE_URL=DATABASE_URL:latest,GEMINI_API_KEY=GEMINI_API_KEY:latest,GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY:latest,FIREBASE_API_KEY=FIREBASE_API_KEY:latest"
  )
fi

if [[ -n "${GCP_CLOUD_SQL_INSTANCE:-}" ]]; then
  API_DEPLOY_ARGS+=(--add-cloudsql-instances "${GCP_CLOUD_SQL_INSTANCE}")
fi

gcloud "${API_DEPLOY_ARGS[@]}"

API_URL="$(gcloud run services describe carbonwise-api --region "${GCP_REGION}" --format='value(status.url)')"
echo "API URL: ${API_URL}"

if [[ -z "${NEXT_PUBLIC_API_BASE_URL:-}" ]]; then
  export NEXT_PUBLIC_API_BASE_URL="${API_URL}"
fi

echo "Building Web image..."
gcloud builds submit \
  --config cloudbuild.web.yaml \
  --substitutions="_REGION=${GCP_REGION},_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL},_GOOGLE_MAPS_API_KEY=${NEXT_PUBLIC_GOOGLE_MAPS_API_KEY:-},_FIREBASE_API_KEY=${NEXT_PUBLIC_FIREBASE_API_KEY:-},_FIREBASE_AUTH_DOMAIN=${NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:-},_FIREBASE_PROJECT_ID=${NEXT_PUBLIC_FIREBASE_PROJECT_ID:-}" \
  .

echo "Deploying Web..."
gcloud run deploy carbonwise-web \
  --image "${WEB_IMAGE}" \
  --region "${GCP_REGION}" \
  --platform managed \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --quiet

WEB_URL="$(gcloud run services describe carbonwise-web --region "${GCP_REGION}" --format='value(status.url)')"
echo "Web URL: ${WEB_URL}"
echo "Deployment complete."
