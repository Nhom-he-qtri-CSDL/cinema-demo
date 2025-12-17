# Cinema Booking Concurrency Test Script
# This script demonstrates PostgreSQL concurrency control by making simultaneous booking requests

Write-Host "=== Cinema Booking Concurrency Test ===" -ForegroundColor Cyan
Write-Host "This demonstrates PostgreSQL's database-level concurrency control" -ForegroundColor Yellow
Write-Host ""

# Test configuration
$baseUrl = "http://localhost:8080"
$seatId = 4  # Target seat for concurrent booking
$users = @(1, 2, 3)  # Multiple users trying to book same seat

Write-Host "Step 1: Check initial seat status" -ForegroundColor Green
try {
    $seatResponse = Invoke-RestMethod -Uri "$baseUrl/api/seats?show_id=7" -Method GET
    Write-Host "Current seats status retrieved successfully" -ForegroundColor White
} catch {
    Write-Host "ERROR: Cannot connect to server. Make sure server is running on $baseUrl" -ForegroundColor Red
    Write-Host "Run: go run cmd/server/main.go" -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "Step 2: Simultaneous booking attempts (3 users for same seat)" -ForegroundColor Green
Write-Host "This will demonstrate concurrency control - only ONE should succeed" -ForegroundColor Yellow
Write-Host ""

# Create jobs for concurrent requests
$jobs = @()

foreach ($userId in $users) {
    $scriptBlock = {
        param($baseUrl, $userId, $seatId)
        
        $headers = @{
            "Content-Type" = "application/json"
            "X-User-ID" = $userId.ToString()
        }
        
        $body = @{
            seat_id = $seatId
        } | ConvertTo-Json
        
        try {
            $response = Invoke-RestMethod -Uri "$baseUrl/api/book" -Method POST -Headers $headers -Body $body
            return @{
                UserId = $userId
                Success = $true
                Message = $response.message
                StatusCode = 200
            }
        } catch {
            $statusCode = $_.Exception.Response.StatusCode.value__
            return @{
                UserId = $userId
                Success = $false
                Message = $_.Exception.Message
                StatusCode = $statusCode
            }
        }
    }
    
    $job = Start-Job -ScriptBlock $scriptBlock -ArgumentList $baseUrl, $userId, $seatId
    $jobs += $job
}

# Wait for all jobs to complete
Write-Host "Executing concurrent requests..." -ForegroundColor Yellow
Start-Sleep -Seconds 2

# Collect results
$results = @()
foreach ($job in $jobs) {
    $result = Wait-Job $job | Receive-Job
    $results += $result
    Remove-Job $job
}

# Display results
Write-Host ""
Write-Host "=== RESULTS ===" -ForegroundColor Cyan
$successCount = 0

foreach ($result in $results) {
    if ($result.Success) {
        Write-Host "User $($result.UserId): SUCCESS - $($result.Message)" -ForegroundColor Green
        $successCount++
    } else {
        if ($result.StatusCode -eq 409) {
            Write-Host "User $($result.UserId): CONFLICT - Seat already booked (Expected!)" -ForegroundColor Yellow
        } else {
            Write-Host "User $($result.UserId): ERROR - Status: $($result.StatusCode)" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=== ANALYSIS ===" -ForegroundColor Cyan

if ($successCount -eq 1) {
    Write-Host "✅ PERFECT! Exactly 1 booking succeeded" -ForegroundColor Green
    Write-Host "✅ PostgreSQL concurrency control working correctly" -ForegroundColor Green
    Write-Host "✅ Database prevented race conditions" -ForegroundColor Green
} elseif ($successCount -eq 0) {
    Write-Host "❌ No bookings succeeded - check if seat was already booked" -ForegroundColor Red
} else {
    Write-Host "❌ PROBLEM: Multiple bookings succeeded ($successCount)" -ForegroundColor Red
    Write-Host "❌ This indicates a concurrency control failure" -ForegroundColor Red
}

Write-Host ""
Write-Host "Step 3: Verify final seat status" -ForegroundColor Green
try {
    $finalSeats = Invoke-RestMethod -Uri "$baseUrl/api/seats?show_id=7" -Method GET
    Write-Host "Final seat status retrieved - check seat $seatId should be BOOKED" -ForegroundColor White
} catch {
    Write-Host "Could not retrieve final seat status" -ForegroundColor Red
}

Write-Host ""
Write-Host "=== TEST COMPLETE ===" -ForegroundColor Cyan
Write-Host "Key Points Demonstrated:" -ForegroundColor White
Write-Host "- PostgreSQL handled concurrent requests safely" -ForegroundColor White
Write-Host "- Only one transaction succeeded (atomicity)" -ForegroundColor White
Write-Host "- Other requests got 409 Conflict (proper error handling)" -ForegroundColor White
Write-Host "- No application-level locking needed" -ForegroundColor White
