# Deployment Guide

## Table of Contents
1. [Frontend Deployment (Vercel)](#frontend-deployment-vercel)
2. [Backend Deployment (Render)](#backend-deployment-render)
3. [Environment Configuration](#environment-configuration)
4. [Post-Deployment Testing](#post-deployment-testing)

---

## Frontend Deployment (Vercel)

### Prerequisites
- Vercel account
- GitHub repository with your code

### Steps

1. **Connect Repository**
   - Go to [vercel.com](https://vercel.com)
   - Click "New Project"
   - Import your GitHub repository

2. **Configure Build Settings**
   - Framework Preset: `Vite`
   - Build Command: `npm run build`
   - Output Directory: `dist`
   - Install Command: `npm install`

3. **Environment Variables**
   Add the following environment variable:
   ```
   VITE_API_BASE_URL=https://your-backend-url.onrender.com
   ```

4. **Deploy**
   - Click "Deploy"
   - Wait for build to complete
   - Your site will be live at `https://your-project.vercel.app`

### Alternative: Netlify

1. **Deploy to Netlify**
   ```bash
   npm install -g netlify-cli
   npm run build
   netlify deploy --prod
   ```

2. **Configure**
   - Build command: `npm run build`
   - Publish directory: `dist`
   - Add environment variable: `VITE_API_BASE_URL`

---

## Backend Deployment (Render)

### Prerequisites
- Render account
- GitHub repository

### Steps

1. **Create New Web Service**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository

2. **Configure Service**
   - Name: `seekkrr-api`
   - Environment: `Python 3`
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `python app.py`

3. **Environment Variables**
   Add the following:
   ```
   ADMIN_TOKEN=<generate-strong-random-token>
   DATABASE_PATH=/opt/render/project/db/seekkrr.db
   FLASK_ENV=production
   PORT=5000
   ```

4. **Disk Storage (for SQLite)**
   - In the Render dashboard, add a disk
   - Mount path: `/opt/render/project/db`
   - Size: 1GB (minimum)

5. **Deploy**
   - Click "Create Web Service"
   - Wait for deployment
   - Your API will be live at `https://your-service.onrender.com`

### Alternative: Railway

1. **Deploy with Railway**
   ```bash
   npm install -g @railway/cli
   railway login
   railway init
   railway up
   ```

2. **Add Variables**
   ```bash
   railway variables set ADMIN_TOKEN=your-token
   railway variables set FLASK_ENV=production
   ```

---

## Environment Configuration

### Production Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```

### Production Backend
```env
# Security
ADMIN_TOKEN=<strong-random-token>

# Database
DATABASE_PATH=/opt/render/project/db/seekkrr.db

# Flask
FLASK_ENV=production
PORT=5000

# CORS (Optional - restrict in production)
ALLOWED_ORIGINS=https://your-frontend.vercel.app
```

### Generating Admin Token
```bash
python -c "import secrets; print(secrets.token_urlsafe(32))"
```

---

## Post-Deployment Testing

### 1. Health Check
```bash
curl https://your-backend.onrender.com/api/health
```

Expected response:
```json
{"ok": true, "status": "healthy"}
```

### 2. Submit Test Interest
```bash
curl -X POST https://your-backend.onrender.com/api/interest \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test User",
    "email": "test@example.com",
    "phone": "+1234567890"
  }'
```

### 3. Export Data (Admin)
```bash
curl "https://your-backend.onrender.com/api/admin/export?token=YOUR_ADMIN_TOKEN"
```

### 4. Get Statistics
```bash
curl "https://your-backend.onrender.com/api/stats?token=YOUR_ADMIN_TOKEN"
```

### 5. Frontend Testing
- Visit your Vercel URL
- Test form submission
- Verify modal functionality
- Check responsive design on mobile
- Test on different browsers

---

## Custom Domain Setup

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `seekkrr.com`)
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

### Backend (Render)
1. Go to Service Settings → Custom Domains
2. Add your API subdomain (e.g., `api.seekkrr.com`)
3. Update DNS CNAME record
4. SSL is automatically provisioned

---

## Monitoring and Maintenance

### Logs
- **Vercel**: Dashboard → Deployments → Click deployment → Runtime Logs
- **Render**: Dashboard → Your Service → Logs

### Database Backup
```bash
# Download database backup
curl "https://your-backend.onrender.com/api/admin/export?token=YOUR_TOKEN" > backup.csv
```

### Performance Monitoring
- Set up Vercel Analytics
- Monitor Render metrics
- Use Lighthouse for frontend performance

---

## Troubleshooting

### CORS Errors
- Verify `VITE_API_BASE_URL` is correct
- Check CORS configuration in `app.py`
- Ensure backend is deployed and running

### Database Issues
- Verify disk is mounted correctly
- Check `DATABASE_PATH` environment variable
- Review Render logs for errors

### Build Failures
- Check Node.js version compatibility
- Verify all dependencies are in package.json
- Review build logs for specific errors

### 404 Errors
- Ensure routes are correct
- Check that backend is deployed
- Verify environment variables

---

## Security Checklist

- [ ] Strong ADMIN_TOKEN set
- [ ] CORS restricted to frontend domain
- [ ] HTTPS enabled (automatic on Vercel/Render)
- [ ] Environment variables secured
- [ ] Database backup strategy in place
- [ ] Rate limiting considered (for production)
- [ ] Input validation on both client and server

---

## Support

For deployment issues:
- Vercel: [vercel.com/docs](https://vercel.com/docs)
- Render: [render.com/docs](https://render.com/docs)
- Railway: [docs.railway.app](https://docs.railway.app)

For application issues:
- Check logs first
- Review this deployment guide
- Open an issue in the repository
