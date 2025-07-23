# Railway Deployment for CycleOptima Backend

## Quick Railway Deployment Guide

### Step 1: Install Railway CLI

```bash
npm install -g @railway/cli
```

### Step 2: Login to Railway

```bash
railway login
```

This will open your browser to authenticate with Railway.

### Step 3: Initialize and Deploy

```bash
# Initialize Railway project
railway init

# Deploy your application
railway up
```

### Step 4: Set Environment Variables

Railway will automatically detect your Dockerfile and deploy it. You'll need to set your environment variables:

```bash
# Set environment variables via CLI
railway variables set NODE_ENV=production
railway variables set PORT=4000
railway variables set OPENAI_API_KEY=your_openai_key_here

# Or set them in the Railway dashboard
```

### Step 5: Add Database (Optional)

If you need a database, you can add it through Railway:

```bash
# Add MySQL database
railway add mysql

# Or add PostgreSQL
railway add postgresql
```

### Step 6: Get Your Public URL

After deployment, Railway will provide you with a public HTTPS URL like:

```
https://your-app-name-production.up.railway.app
```

### Step 7: Update CORS Settings

Once you have your Railway URL, update your server.js CORS configuration:

```javascript
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://your-frontend-domain.com",
      "https://your-app-name-production.up.railway.app",
    ],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);
```

## Alternative: Deploy via GitHub

1. Push your code to GitHub
2. Go to [railway.app](https://railway.app)
3. Click "Deploy from GitHub repo"
4. Select your repository
5. Railway will automatically detect the Dockerfile and deploy

## Environment Variables You'll Need

Create these in Railway dashboard or via CLI:

```bash
NODE_ENV=production
PORT=4000
OPENAI_API_KEY=your_openai_api_key
DB_HOST=your_db_host (if using external DB)
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_NAME=your_db_name
```

## Monitoring and Logs

```bash
# View logs
railway logs

# Check service status
railway status

# Open in browser
railway open
```

## Custom Domain (Optional)

1. Go to Railway dashboard
2. Click on your service
3. Go to "Settings" > "Domains"
4. Add your custom domain
5. Update your DNS records as instructed

## Costs

- Railway offers a generous free tier
- $5/month for the Hobby plan with more resources
- Pay-as-you-scale pricing for production

Your Railway deployment will automatically include:
✅ HTTPS/SSL certificates
✅ Auto-scaling
✅ Zero-downtime deployments
✅ Built-in monitoring
✅ Global CDN
