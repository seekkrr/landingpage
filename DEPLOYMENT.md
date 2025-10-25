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

## Environment Configuration

### Production Frontend (.env.production)
```env
VITE_API_BASE_URL=https://your-backend.onrender.com
```
---

## Custom Domain Setup

### Frontend (Vercel)
1. Go to Project Settings → Domains
2. Add your custom domain (e.g., `seekkrr.com`)
3. Update DNS records as instructed
4. Wait for SSL certificate provisioning

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
