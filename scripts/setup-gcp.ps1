# One-time GCP setup for CarbonWise AI deploy
# Usage: .\scripts\setup-gcp.ps1

param(
    [string]$Project = $env:GOOGLE_CLOUD_PROJECT,
    [string]$Region = $env:GCP_REGION
)

if (-not $Project) { $Project = "carbonwise-499618" }
if (-not $Region) { $Region = "asia-south1" }

Write-Host "Project: $Project"
Write-Host "Region:  $Region"

gcloud config set project $Project

$apis = @(
    "run.googleapis.com",
    "cloudbuild.googleapis.com",
    "artifactregistry.googleapis.com",
    "secretmanager.googleapis.com",
    "sqladmin.googleapis.com",
    "storage.googleapis.com"
)

foreach ($api in $apis) {
    Write-Host "Enabling $api ..."
    gcloud services enable $api --project $Project
}

Write-Host "Creating Artifact Registry repo 'carbonwise' (if missing) ..."
$oldPreference = $ErrorActionPreference
$ErrorActionPreference = "SilentlyContinue"
gcloud artifacts repositories describe carbonwise --location=$Region --project=$Project 2>$null
$ErrorActionPreference = $oldPreference
if ($LASTEXITCODE -ne 0) {
    gcloud artifacts repositories create carbonwise `
        --repository-format=docker `
        --location=$Region `
        --description="CarbonWise AI containers" `
        --project=$Project
}

Write-Host "Granting Cloud Build permissions to deploy to Cloud Run ..."
$projectNumber = gcloud projects describe $Project --format="value(projectNumber)"
$cloudBuildSa = "$projectNumber@cloudbuild.gserviceaccount.com"

gcloud projects add-iam-policy-binding $Project `
    --member="serviceAccount:$cloudBuildSa" `
    --role="roles/run.admin" `
    --quiet | Out-Null

gcloud projects add-iam-policy-binding $Project `
    --member="serviceAccount:$cloudBuildSa" `
    --role="roles/iam.serviceAccountUser" `
    --quiet | Out-Null

gcloud projects add-iam-policy-binding $Project `
    --member="serviceAccount:$cloudBuildSa" `
    --role="roles/artifactregistry.writer" `
    --quiet | Out-Null

Write-Host ""
Write-Host "Setup complete. Next run: .\scripts\deploy.ps1 api"
