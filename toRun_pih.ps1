Set-Location $PSScriptRoot
if (-not (Test-Path ".\venv")) {
    python -m venv venv
}
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt --quiet
Write-Host "Site  : http://localhost:5000" -ForegroundColor Green
Write-Host "Admin : http://localhost:5000/admin/login" -ForegroundColor Green
python app.py
