$ErrorActionPreference = "Stop"

$INSTALL_CMD = "npm install"
$VERIFY_CMD = "npm run verify"
$START_CMD = "npm run dev"

$RepoRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $RepoRoot

Write-Host "Repository root: $RepoRoot"
Write-Host "Installing workspaces..."
Invoke-Expression $INSTALL_CMD

Write-Host "Running verification..."
Invoke-Expression $VERIFY_CMD

Write-Host ""
Write-Host "Verification passed."
Write-Host "Web: npm run dev  |  API: npm run dev:api"

if ($env:RUN_START_COMMAND -eq "1") {
    Invoke-Expression $START_CMD
}
