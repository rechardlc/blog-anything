Write-Host "Starting local blockchain and deploying contracts..." -ForegroundColor Green
Write-Host ""

Write-Host "Step 1: Starting Hardhat node on port 9999..." -ForegroundColor Yellow
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd '$PWD'; pnpm ht-local:hnp"

Write-Host "Waiting for node to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 5

Write-Host "Step 2: Deploying contracts..." -ForegroundColor Yellow
pnpm ht-deploy

Write-Host ""
Write-Host "Local blockchain setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Network: localhost" -ForegroundColor Cyan
Write-Host "RPC URL: http://localhost:9999" -ForegroundColor Cyan
Write-Host "Chain ID: 31337" -ForegroundColor Cyan
Write-Host ""
Write-Host "Exchange Contract: 0x5FbDB2315678afecb367f032d93F642f64180aa3" -ForegroundColor Cyan
Write-Host "Token Contract: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512" -ForegroundColor Cyan
Write-Host ""
Write-Host "You can now use the exchange application." -ForegroundColor Green
