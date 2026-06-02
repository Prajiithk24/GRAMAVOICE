# GramaVoice - Full Stack Run & Deploy Guide

This project includes:
- `frontend` (React + Vite)
- `backend` (Spring Boot + JPA + Security)
- Database support:
  - Local default: H2 file database
  - Deploy: MySQL via Docker Compose

## 1) One-time setup

From project root:

```powershell
Copy-Item .env.example .env.local
```

Then edit `.env.local` and set:
- `APP_AUTH_SECRET` (long random secret for auth token signing)
- `SARVAM_API_KEY` (your real Sarvam key)
- optional: `SARVAM_MODEL`, `SARVAM_ENABLED`

## 2) Run locally (Windows PowerShell)

If scripts are blocked:

```powershell
Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass
```

From project root:

```powershell
.\run-app.ps1
```

This starts:
- backend at `http://localhost:8080`
- frontend at `http://localhost:5173`

**குடிமக்கள்:** register new account, or login `citizen` / `password`

**நிர்வாகம் / துறை** (choose on login screen):

| Role / Department | Username | Password |
|-------------------|----------|----------|
| மாவட்ட நிர்வாகம் (மொத்த) | admin | admin123 |
| குடிநீர் | water | water123 |
| மின்சாரம் | electricity | electricity123 |
| சாலை | roads | roads123 |
| ஊராட்சி | municipal | municipal123 |
| ரேஷன் | ration | ration123 |
| பொது சேவை | general | general123 |

Department users are auto-reconciled on backend startup (username/password/role/departmentCode), so these credentials are restored even if older values existed in the database.

Stop both:

```powershell
.\stop-app.ps1
```

## 3) Run with Docker (deploy-style)

From project root:

```powershell
docker compose up -d --build
```

This starts:
- MySQL container
- Spring backend container
- Nginx frontend container

Open:
- `http://localhost:5173`

Stop:

```powershell
docker compose down
```

To remove DB volume too:

```powershell
docker compose down -v
```

## 4) Classification & severity (Sarvam + rules)

The backend now uses a **hybrid engine**:
- Tamil keyword rules (always on)
- Sarvam LLM (when `SARVAM_API_KEY` is valid)
- Severity boost from urgent Tamil phrases (children affected, many days, danger, etc.)

Preview while typing/speaking calls: `POST /api/analysis/preview`

**Demo test sentences (type or speak):**

| Tamil input | Expected category | Expected severity |
|-------------|-------------------|-------------------|
| மூன்று நாட்களாக குடிநீர் வரவில்லை குழந்தைகள் சிரமப்படுகின்றனர் | குடிநீர் | HIGH |
| மின் கம்பம் விழுந்து ஆபத்தாக உள்ளது | மின்சாரம் | CRITICAL |
| பள்ளி அருகே தெருவிளக்கு இரண்டு நாட்களாக எரியவில்லை | தெருவிளக்கு | MEDIUM |

Restart backend after editing `.env.local`:

```powershell
.\stop-app.ps1
.\run-app.ps1
```

Only if you want a full local data reset (not normally required):

```powershell
Remove-Item -Force ".\backend\data\gramavoice.mv.db",".\backend\data\gramavoice.trace.db" -ErrorAction SilentlyContinue
```

## 5) API key behavior

- If `SARVAM_ENABLED=true` and `SARVAM_API_KEY` is valid, backend uses Sarvam + rules (best accuracy).
- If key is missing/invalid, backend uses rules-only (still works, lower accuracy).

## 6) Quick health checks

```powershell
Invoke-RestMethod -Method Get -Uri "http://localhost:8080/api/dashboard/home" -Headers @{ Authorization = "Bearer <TOKEN>" }
```

Get token:

```powershell
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/auth/login" -ContentType "application/json" -Body '{"username":"admin","password":"admin123"}'
$login.token
```

Test classification API:

```powershell
$login = Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/auth/login" -ContentType "application/json" -Body '{"username":"citizen","password":"password"}'
$body = '{"text":"மூன்று நாட்களாக குடிநீர் வரவில்லை குழந்தைகள் சிரமப்படுகின்றனர்"}'
Invoke-RestMethod -Method Post -Uri "http://localhost:8080/api/analysis/preview" -ContentType "application/json" -Headers @{ Authorization = "Bearer $($login.token)" } -Body $body
```
