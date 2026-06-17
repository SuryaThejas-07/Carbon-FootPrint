#!/usr/bin/env bash
set -euo pipefail

PROJECT="${GOOGLE_CLOUD_PROJECT:-carbonwise-499618}"
REGION="${GCP_REGION:-asia-south1}"

echo "Project: $PROJECT"
echo "Region:  $REGION"

gcloud config set project "$PROJECT"

for api in run.googleapis.com cloudbuild.googleapis.com artifactregistry.googleapis.com secretmanager.googleapis.com sqladmin.googleapis.com storage.googleapis.com; do
  echo "Enabling $api ..."
  gcloud services enable "$api" --project="$PROJECT"
done

if ! gcloud artifacts repositories describe carbonwise --location="$REGION" --project="$PROJECT" >/dev/null 2>&1; then
  gcloud artifacts repositories create carbonwise \
    --repository-format=docker \
    --location="$REGION" \
    --description="CarbonWise AI containers" \
    --project="$PROJECT"
fi

PROJECT_NUMBER="$(gcloud projects describe "$PROJECT" --format='value(projectNumber)')"
CLOUD_BUILD_SA="${PROJECT_NUMBER}@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/run.admin" \
  --quiet >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/iam.serviceAccountUser" \
  --quiet >/dev/null

gcloud projects add-iam-policy-binding "$PROJECT" \
  --member="serviceAccount:${CLOUD_BUILD_SA}" \
  --role="roles/artifactregistry.writer" \
  --quiet >/dev/null

echo "Setup complete. Run: bash scripts/cloud-run-build.sh"
