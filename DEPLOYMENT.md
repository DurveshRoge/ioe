# Deployment Guide

## 🚀 Deploy to Render (Recommended)

### Step 1: Push to GitHub
1. Create a new repository on GitHub
2. Push your code:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/yourusername/product-order-telegram.git
   git push -u origin main
   ```

### Step 2: Deploy on Render
1. Go to [render.com](https://render.com) and sign up
2. Click "New +" → "Web Service"
3. Connect your GitHub repository
4. Configure:
   - **Name**: `product-order-telegram`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Set Environment Variables
In Render dashboard, go to Environment tab and add:
```
TELEGRAM_BOT_TOKEN=your_bot_token_here
TELEGRAM_CHAT_ID=your_chat_id_here
PORT=10000
```

### Step 4: Deploy
- Click "Create Web Service"
- Wait for deployment (2-3 minutes)
- Your app will be live at: `https://your-app-name.onrender.com`

---

## 🔄 Alternative: Vercel (Frontend Only)

**Note**: Vercel is primarily for frontend/serverless. For this full-stack app, you'd need to:

1. **Convert to Serverless Functions**:
   - Move API routes to `api/` folder
   - Restructure as Vercel functions
   - More complex setup

2. **Deploy Steps**:
   ```bash
   npm install -g vercel
   vercel
   ```

---

## 🌐 Other Options

### Railway
1. Go to [railway.app](https://railway.app)
2. Connect GitHub repo
3. Add environment variables
4. Deploy automatically

### Heroku (Paid)
1. Install Heroku CLI
2. Create app: `heroku create your-app-name`
3. Set env vars: `heroku config:set TELEGRAM_BOT_TOKEN=xxx`
4. Deploy: `git push heroku main`

---

## 📋 Pre-Deployment Checklist

- [ ] Code pushed to GitHub
- [ ] Telegram bot created and tested
- [ ] Environment variables ready
- [ ] Package.json has correct start script
- [ ] Node.js version specified in engines

## 🔧 Post-Deployment

1. **Test the live app**
2. **Update Telegram webhook** (if needed)
3. **Monitor logs** for any issues
4. **Set up custom domain** (optional)

## 🆘 Troubleshooting

**Common Issues:**
- **Build fails**: Check Node.js version compatibility
- **App crashes**: Verify environment variables are set
- **Telegram not working**: Check bot token and chat ID
- **Port issues**: Render uses PORT environment variable automatically