# CycleOptima Backend - Docker Deployment Guide

## Deployment Options for Public HTTPS URLs

### Option 1: Cloud Platforms (Recommended)

#### 1.1 Railway (Easiest)

```bash
# Install Railway CLI
npm install -g @railway/cli

# Login and deploy
railway login
railway init
railway up
```

- Automatic HTTPS
- Free tier available
- Custom domains supported

#### 1.2 Render

```bash
# Connect your GitHub repo to Render
# Dockerfile will be auto-detected
# Free tier with automatic HTTPS
```

#### 1.3 DigitalOcean App Platform

```bash
# Upload your code or connect GitHub
# Automatic HTTPS with custom domains
# $5/month for basic tier
```

### Option 2: VPS with Docker + Caddy (Advanced)

#### 2.1 DigitalOcean Droplet + Caddy

```bash
# Create a $6/month droplet
# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sh get-docker.sh

# Clone your repo
git clone <your-repo>
cd cycleOptima-backend

# Create Caddyfile for automatic HTTPS
echo "your-domain.com {
    reverse_proxy api:4000
}" > Caddyfile

# Use docker-compose-caddy.yml instead
docker-compose -f docker-compose-caddy.yml up -d
```

#### 2.2 AWS EC2 + Application Load Balancer

- More complex but highly scalable
- Automatic SSL with AWS Certificate Manager

### Option 3: Serverless (Alternative)

#### 3.1 Vercel (Serverless Functions)

- Need to convert Express routes to Vercel functions
- Automatic HTTPS
- Free tier available

#### 3.2 AWS Lambda + API Gateway

- Serverless deployment
- Pay per request
- Automatic HTTPS

## Quick Start (Recommended: Railway)

1. **Prepare your code:**

```bash
# Add start script to package.json
npm run build  # if you have a build step
```

2. **Deploy to Railway:**

```bash
railway login
railway init
railway up
```

3. **Get your HTTPS URL:**
   Railway will provide you with a URL like: `https://your-app-name.railway.app`

4. **Update CORS settings:**
   Update your frontend URLs in the CORS configuration.

## Environment Variables

Create a `.env` file with:

```env
NODE_ENV=production
PORT=4000
DB_HOST=your-db-host
DB_USER=your-db-user
DB_PASSWORD=your-db-password
DB_NAME=your-db-name
OPENAI_API_KEY=your-openai-key
```

## Testing Your Deployment

1. **Health Check:**

```bash
curl https://your-domain.com/health
```

2. **API Test:**

```bash
curl https://your-domain.com/api/washer-cycles
```

## Custom Domain Setup

Most platforms support custom domains:

1. Add your domain in the platform dashboard
2. Update your DNS records (CNAME or A record)
3. SSL certificates are handled automatically

Choose the option that best fits your needs and budget!
