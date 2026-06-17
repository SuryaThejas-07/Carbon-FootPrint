# CarbonWise AI — Cloud Run deploy (Windows)
# DO NOT use bare "gcloud run deploy" from the repo root — it uses Buildpacks and will fail.
#
# Usage:
#   .\scripts\deploy.ps1 setup     # one-time GCP setup
#   .\scripts\deploy.ps1 api       # build + deploy API
#   .\scripts\deploy.ps1 web       # build + deploy web (set NEXT_PUBLIC_API_BASE_URL first)
#   .\scripts\deploy.ps1 all       # API then web

param(
    [Parameter(Position = 0)]
    [ValidateSet("setup", "api", "web", "all")]
    [string]$Target = "api"
)

$ErrorActionPreference = "Stop"
$Root = Split-Path -Parent (Split-Path -Parent $MyInvocation.MyCommand.Path)
Set-Location $Root

# Load deploy.config if present
$ConfigFile = Join-Path $Root "deploy.config"
if (Test-Path $ConfigFile) {
    Get-Content $ConfigFile | ForEach-Object {
        if ($_ -match '^\s*([^#=]+)=(.*)$') {
            $name = $matches[1].Trim()
            $value = $matches[2].Trim()
            if ($value) { Set-Item -Path "env:$name" -Value $value }
        }
    }
}

$Project = if ($env:GOOGLE_CLOUD_PROJECT) { $env:GOOGLE_CLOUD_PROJECT } else { "carbonwise-499618" }
$Region = if ($env:GCP_REGION) { $env:GCP_REGION } else { "asia-south1" }

$ApiImage = "${Region}-docker.pkg.dev/${Project}/carbonwise/carbonwise-api:latest"
$WebImage = "${Region}-docker.pkg.dev/${Project}/carbonwise/carbonwise-web:latest"

function Deploy-Api {
    Write-Host "`n=== Building API image (Cloud Build) ===" -ForegroundColor Cyan
    gcloud builds submit `
        --project $Project `
        --config cloudbuild.api.yaml `
        --substitutions="_REGION=$Region" `
        .

    if ($LASTEXITCODE -ne 0) { throw "API image build failed" }

    Write-Host "`n=== Deploying carbonwise-api to Cloud Run ===" -ForegroundColor Cyan

    $deployArgs = @(
        "run", "deploy", "carbonwise-api",
        "--project", $Project,
        "--image", $ApiImage,
        "--region", $Region,
        "--platform", "managed",
        "--allow-unauthenticated",
        "--port", "8080",
        "--timeout", "300",
        "--memory", "512Mi",
        "--quiet"
    )

    $envVars = @("GOOGLE_CLOUD_PROJECT=$Project")
    if ($env:GOOGLE_CLOUD_BUCKET) { $envVars += "GOOGLE_CLOUD_BUCKET=$($env:GOOGLE_CLOUD_BUCKET)" }
    if ($env:FIREBASE_PROJECT_ID) { $envVars += "FIREBASE_PROJECT_ID=$($env:FIREBASE_PROJECT_ID)" }
    if ($env:GEMINI_API_KEY) { $envVars += "GEMINI_API_KEY=$($env:GEMINI_API_KEY)" }
    if ($env:USE_SECRET_MANAGER -ne "true" -and $env:DATABASE_URL) { $envVars += "DATABASE_URL=$($env:DATABASE_URL)" }

    $deployArgs += "--set-env-vars"
    $deployArgs += ($envVars -join ",")

    if ($env:USE_SECRET_MANAGER -eq "true") {
        $deployArgs += "--set-secrets"
        $deployArgs += "DATABASE_URL=DATABASE_URL:latest,GEMINI_API_KEY=GEMINI_API_KEY:latest,GOOGLE_MAPS_API_KEY=GOOGLE_MAPS_API_KEY:latest,FIREBASE_API_KEY=FIREBASE_API_KEY:latest"
    }

    if ($env:GCP_CLOUD_SQL_INSTANCE) {
        $deployArgs += "--add-cloudsql-instances"
        $deployArgs += $env:GCP_CLOUD_SQL_INSTANCE
    }

    & gcloud @deployArgs

    if ($LASTEXITCODE -ne 0) { throw "API deploy failed" }

    $apiUrl = gcloud run services describe carbonwise-api --project $Project --region $Region --format="value(status.url)"
    Write-Host "`nAPI deployed: $apiUrl" -ForegroundColor Green
    Write-Host "Set this in deploy.config / .env as NEXT_PUBLIC_API_BASE_URL before deploying web."
}

function Deploy-Web {
    if (-not $env:NEXT_PUBLIC_API_BASE_URL) {
        Write-Host "NEXT_PUBLIC_API_BASE_URL is not set. Trying to read from deployed API..." -ForegroundColor Yellow
        $env:NEXT_PUBLIC_API_BASE_URL = gcloud run services describe carbonwise-api --project $Project --region $Region --format="value(status.url)" 2>$null
    }

    if (-not $env:NEXT_PUBLIC_API_BASE_URL) {
        throw "Set NEXT_PUBLIC_API_BASE_URL to your API Cloud Run URL before deploying web."
    }

    Write-Host "`n=== Building Web image (API URL: $($env:NEXT_PUBLIC_API_BASE_URL)) ===" -ForegroundColor Cyan

    $subs = "_REGION=$Region,_API_BASE_URL=$($env:NEXT_PUBLIC_API_BASE_URL)"
    $subs += ",_GOOGLE_MAPS_API_KEY=$($env:NEXT_PUBLIC_GOOGLE_MAPS_API_KEY)"
    $subs += ",_FIREBASE_API_KEY=$($env:NEXT_PUBLIC_FIREBASE_API_KEY)"
    $subs += ",_FIREBASE_AUTH_DOMAIN=$($env:NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN)"
    $subs += ",_FIREBASE_PROJECT_ID=$($env:NEXT_PUBLIC_FIREBASE_PROJECT_ID)"

    gcloud builds submit `
        --project $Project `
        --config cloudbuild.web.yaml `
        --substitutions $subs `
        .

    if ($LASTEXITCODE -ne 0) { throw "Web image build failed" }

    Write-Host "`n=== Deploying carbonwise-web to Cloud Run ===" -ForegroundColor Cyan
    gcloud run deploy carbonwise-web `
        --project $Project `
        --image $WebImage `
        --region $Region `
        --platform managed `
        --allow-unauthenticated `
        --port 8080 `
        --memory 512Mi `
        --quiet

    if ($LASTEXITCODE -ne 0) { throw "Web deploy failed" }

    $webUrl = gcloud run services describe carbonwise-web --project $Project --region $Region --format="value(status.url)"
    Write-Host "`nWeb deployed: $webUrl" -ForegroundColor Green
}

switch ($Target) {
    "setup" { & (Join-Path $Root "scripts\setup-gcp.ps1") -Project $Project -Region $Region }
    "api"   { Deploy-Api }
    "web"   { Deploy-Web }
    "all"   { Deploy-Api; Deploy-Web }
}
