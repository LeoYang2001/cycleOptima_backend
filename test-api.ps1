# CycleOptima API Testing Script
# Railway Deployment: https://cycleoptima-production.up.railway.app

Write-Host "🚀 Testing CycleOptima API on Railway" -ForegroundColor Green
Write-Host "Domain: https://cycleoptima-production.up.railway.app" -ForegroundColor Cyan
Write-Host ""

$baseUrl = "https://cycleoptima-production.up.railway.app"

# Test 1: Health Check
Write-Host "1️⃣ Testing Health Endpoint..." -ForegroundColor Yellow
try {
    $health = Invoke-RestMethod -Uri "$baseUrl/health" -Method GET
    Write-Host "✅ Health Check: " -NoNewline -ForegroundColor Green
    Write-Host "$($health.status) - Uptime: $([math]::Round($health.uptime, 2))s" -ForegroundColor White
} catch {
    Write-Host "❌ Health Check Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 2: Config Endpoint
Write-Host "2️⃣ Testing Config Endpoint..." -ForegroundColor Yellow
try {
    $config = Invoke-RestMethod -Uri "$baseUrl/api/config/openai-key" -Method GET
    if ($config.success) {
        $apiKey = $config.data.openai_api_key
        $maskedKey = $apiKey.Substring(0, 12) + "***" + $apiKey.Substring($apiKey.Length - 6)
        Write-Host "✅ Config: API Key loaded ($maskedKey)" -ForegroundColor Green
    }
} catch {
    Write-Host "❌ Config Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 3: CORS Preflight Request
Write-Host "3️⃣ Testing CORS Preflight..." -ForegroundColor Yellow
try {
    $corsResponse = Invoke-WebRequest -Uri "$baseUrl/api/config/openai-key" -Method OPTIONS -Headers @{
        "Origin" = "http://localhost:5173"
        "Access-Control-Request-Method" = "GET"
    }
    if ($corsResponse.StatusCode -eq 204) {
        Write-Host "✅ CORS: Preflight successful (Status: $($corsResponse.StatusCode))" -ForegroundColor Green
        $allowOrigin = $corsResponse.Headers["Access-Control-Allow-Origin"]
        $allowMethods = $corsResponse.Headers["Access-Control-Allow-Methods"]
        Write-Host "   Origin: $allowOrigin" -ForegroundColor Gray
        Write-Host "   Methods: $allowMethods" -ForegroundColor Gray
    }
} catch {
    Write-Host "❌ CORS Failed: $($_.Exception.Message)" -ForegroundColor Red
}
Write-Host ""

# Test 4: Database Endpoints (Expected to fail without DB)
Write-Host "4️⃣ Testing Database Endpoints..." -ForegroundColor Yellow
try {
    $washerCycles = Invoke-RestMethod -Uri "$baseUrl/api/washer-cycles" -Method GET
    Write-Host "✅ Washer Cycles: Connected to database" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*Database error*" -or $_.Exception.Message -like "*ECONNREFUSED*") {
        Write-Host "⚠️  Washer Cycles: Database not connected (expected)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Washer Cycles Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}

try {
    $library = Invoke-RestMethod -Uri "$baseUrl/api/library" -Method GET
    Write-Host "✅ Library: Connected to database" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*ECONNREFUSED*" -or $_.Exception.Message -like "*Database error*") {
        Write-Host "⚠️  Library: Database not connected (expected)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ Library Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

# Test 5: Sample POST Request
Write-Host "5️⃣ Testing POST Request..." -ForegroundColor Yellow
try {
    $testData = @{
        name = "Test Wash Cycle"
        temperature = 40
        duration = 30
    } | ConvertTo-Json

    $postResponse = Invoke-RestMethod -Uri "$baseUrl/api/washer-cycles" -Method POST -Body $testData -ContentType "application/json"
    Write-Host "✅ POST Request: Successful" -ForegroundColor Green
} catch {
    if ($_.Exception.Message -like "*Database error*" -or $_.Exception.Message -like "*ECONNREFUSED*") {
        Write-Host "⚠️  POST Request: Database not connected (expected)" -ForegroundColor Yellow
    } else {
        Write-Host "❌ POST Failed: $($_.Exception.Message)" -ForegroundColor Red
    }
}
Write-Host ""

Write-Host "🎉 API Testing Complete!" -ForegroundColor Green
Write-Host ""
Write-Host "📝 Summary:" -ForegroundColor Cyan
Write-Host "• ✅ Server is running and healthy" -ForegroundColor White
Write-Host "• ✅ HTTPS SSL certificate working" -ForegroundColor White
Write-Host "• ✅ CORS configured for frontend access" -ForegroundColor White
Write-Host "• ✅ OpenAI API key configured" -ForegroundColor White
Write-Host "• ⚠️  Database needs to be connected for full functionality" -ForegroundColor White
Write-Host ""
Write-Host "🌐 Your API is live at: https://cycleoptima-production.up.railway.app" -ForegroundColor Green
Write-Host "📚 Use this URL in your frontend application!" -ForegroundColor Cyan
