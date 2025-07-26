# Render Deployment Configuration

## Build Settings
- **Build Command**: `npm install`
- **Start Command**: `npm start`
- **Node Version**: 18 or higher

## Environment Variables (Set in Render Dashboard)
```
NODE_ENV=production
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_jwt_key
STRIPE_SECRET_KEY=sk_live_your_stripe_secret
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret
OPENAI_API_KEY=sk-your_openai_key
GEMINI_API_KEY=your_gemini_key
FRONTEND_URL=https://your-frontend-domain.vercel.app
```

## Health Check
- **Path**: `/health`
- **Expected Response**: 200 OK

## Scaling Settings
- **Instance Type**: Free (512MB RAM)
- **Auto Deploy**: Yes
- **Branch**: main

## Custom Domain (Optional)
- Add your custom domain in Render dashboard
- SSL certificate is automatically provided

## Monitoring
- Use Render's built-in monitoring
- Check logs in Render dashboard
- Set up uptime monitoring if needed
