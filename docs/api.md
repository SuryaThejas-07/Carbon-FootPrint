# CarbonWise AI API

Base URL: `https://carbonwise-api-<region>.run.app`

## Health

`GET /health`

Response:

```json
{
  "status": "ok",
  "service": "carbonwise-api",
  "timestamp": "2026-06-13T12:00:00.000Z"
}
```

## Carbon Calculator

`POST /v1/carbon/calculate`

Request body:

```json
{
  "transport": {
    "carKmPerDay": 14,
    "bikeKmPerDay": 2,
    "publicTransportKmPerDay": 6,
    "evKmPerDay": 1
  },
  "energy": {
    "monthlyKwh": 340,
    "renewableSharePercent": 28
  },
  "food": {
    "habit": "mixed"
  },
  "waste": {
    "recyclingFrequencyPerWeek": 4,
    "plasticUsageScore": 5
  },
  "flights": {
    "domesticPerYear": 4,
    "internationalPerYear": 1
  }
}
```

## AI Carbon Coach

`POST /v1/insights/chat`

## Dashboard Summary

`GET /v1/dashboard/summary`

## Challenges

`GET /v1/challenges`

## Recommendations

`GET /v1/recommendations`

## Forecast

`POST /v1/forecast`

## Weekly Report

`POST /v1/reports/weekly`
