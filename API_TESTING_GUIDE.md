# CycleOptima API - Public Testing Guide

# Your API is live at: https://cycleoptima-production.up.railway.app

## Simple curl Commands for Testing

### 1. Health Check (Basic GET request)

```bash
curl https://cycleoptima-production.up.railway.app/health
```

### 2. Get OpenAI API Configuration

```bash
curl https://cycleoptima-production.up.railway.app/api/config/openai-key
```

### 3. Test CORS Preflight Request

```bash
curl -X OPTIONS \
  -H "Origin: https://example.com" \
  -H "Access-Control-Request-Method: GET" \
  https://cycleoptima-production.up.railway.app/api/config/openai-key
```

### 4. Test POST Request (will fail without database)

```bash
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"name":"Test Cycle","temperature":40,"duration":30}' \
  https://cycleoptima-production.up.railway.app/api/washer-cycles
```

### 5. Test with different origins (CORS verification)

```bash
# From localhost:3000
curl -H "Origin: http://localhost:3000" https://cycleoptima-production.up.railway.app/health

# From localhost:5173 (Vite dev server)
curl -H "Origin: http://localhost:5173" https://cycleoptima-production.up.railway.app/health

# From any domain (should work due to CORS: *)
curl -H "Origin: https://mywebsite.com" https://cycleoptima-production.up.railway.app/health
```

## Expected Responses

### Health Check Response:

```json
{
  "status": "OK",
  "timestamp": "2025-07-23T19:19:01.913Z",
  "uptime": 123.45
}
```

### Config Response:

```json
{
  "success": true,
  "data": {
    "openai_api_key": "sk-proj-***REDACTED***"
  }
}
```

### CORS Headers (in response):

```
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Accept, Authorization
```

## Frontend Integration

Use this base URL in your frontend applications:

```javascript
const API_BASE_URL = "https://cycleoptima-production.up.railway.app";

// Example fetch request
fetch(`${API_BASE_URL}/health`)
  .then((response) => response.json())
  .then((data) => console.log(data));
```

## API Endpoints Available:

- `GET /health` - Server health check
- `GET /api/config/openai-key` - Get OpenAI configuration
- `GET /api/washer-cycles` - Get washer cycles (requires DB)
- `POST /api/washer-cycles` - Create washer cycle (requires DB)
- `GET /api/library` - Get component library (requires DB)
- `POST /api/library` - Add component template (requires DB)

## CORS Configuration:

✅ Origin: `*` (open to everyone)
✅ Methods: `GET, POST, PUT, DELETE, OPTIONS`
✅ Headers: `Content-Type, Authorization`
✅ Credentials: `true`

Your API is publicly accessible and ready for integration!
