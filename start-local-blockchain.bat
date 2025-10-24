@echo off
echo Starting local blockchain and deploying contracts...
echo.

echo Step 1: Starting Hardhat node on port 9999...
start "Hardhat Node" cmd /k "pnpm ht-local:hnp"

echo Waiting for node to start...
timeout /t 5 /nobreak > nul

echo Step 2: Deploying contracts...
pnpm ht-deploy

echo.
echo Local blockchain setup complete!
echo.
echo Network: localhost
echo RPC URL: http://localhost:9999
echo Chain ID: 31337
echo.
echo Exchange Contract: 0x5FbDB2315678afecb367f032d93F642f64180aa3
echo Token Contract: 0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512
echo.
echo You can now use the exchange application.
pause
