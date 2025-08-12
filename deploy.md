# Deployment Guide for Mega Tic Tac Toe

## Step-by-Step Deployment

### 1. Prepare Your Repository

1. **Create GitHub Repository**:
   ```bash
   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Initial commit: Mega Tic Tac Toe game"
   
   # Create repository on GitHub, then:
   git remote add origin https://github.com/yourusername/mega-tic-tac-toe.git
   git branch -M main
   git push -u origin main
   ```

2. **Update package.json homepage**:
   - Replace `yourusername` with your actual GitHub username
   - Replace `mega-tic-tac-toe` with your repository name

### 2. Deploy Frontend (GitHub Pages)

1. **Install deployment dependency**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Deploy**:
   ```bash
   npm run deploy
   ```

3. **Enable GitHub Pages**:
   - Go to your repository on GitHub
   - Settings → Pages
   - Source: Deploy from a branch
   - Branch: gh-pages
   - Your site will be available at: `https://yourusername.github.io/mega-tic-tac-toe`

### 3. Deploy Backend (WebSocket Server)

#### Option A: Railway (Recommended - Free)

1. **Sign up**: Go to [railway.app](https://railway.app)
2. **New Project**: Click "New Project" → "Deploy from GitHub repo"
3. **Select Repository**: Choose your mega-tic-tac-toe repository
4. **Configure**:
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Deploy**: Railway will provide a URL like `https://your-app.railway.app`
6. **Update WebSocket URL**: In `src/App.js`, replace the production URL

#### Option B: Render (Free Tier)

1. **Sign up**: Go to [render.com](https://render.com)
2. **New Web Service**: Connect your GitHub repository
3. **Configure**:
   - Name: mega-tic-tac-toe-server
   - Root Directory: `server`
   - Build Command: `npm install`
   - Start Command: `npm start`
4. **Deploy**: Render will provide a URL
5. **Update WebSocket URL**: Replace in `src/App.js`

#### Option C: Heroku (Free tier discontinued, but still popular)

1. **Install Heroku CLI**
2. **Create app**:
   ```bash
   cd server
   heroku create your-app-name
   git subtree push --prefix server heroku main
   ```

### 4. Update WebSocket URL

After deploying your server, update `src/App.js`:

```javascript
const { send } = useWebSocket(
  process.env.NODE_ENV === 'production' 
    ? 'wss://your-actual-server-url.railway.app' // Replace with your real URL
    : 'ws://localhost:4000', 
  handleMessage
);
```

### 5. Redeploy Frontend

After updating the WebSocket URL:
```bash
npm run deploy
```

## Environment Variables (Optional)

For better configuration management, you can use environment variables:

1. **Create `.env` file**:
   ```
   REACT_APP_WEBSOCKET_URL=wss://your-server.railway.app
   ```

2. **Update App.js**:
   ```javascript
   const { send } = useWebSocket(
     process.env.REACT_APP_WEBSOCKET_URL || 'ws://localhost:4000',
     handleMessage
   );
   ```

## Troubleshooting

### Common Issues:

1. **WebSocket Connection Failed**:
   - Check if server is running
   - Verify WebSocket URL is correct
   - Ensure server supports WSS (secure WebSocket) for HTTPS sites

2. **GitHub Pages Not Updating**:
   - Check GitHub Actions tab for build errors
   - Ensure gh-pages branch exists
   - Clear browser cache

3. **CORS Issues**:
   - WebSocket connections don't have CORS issues
   - If using HTTP API, add CORS headers to server

### Testing Your Deployment:

1. **Open your GitHub Pages URL**
2. **Create a room**
3. **Open in incognito/private window**
4. **Join the room**
5. **Play a game to test real-time sync**

## Custom Domain (Optional)

To use a custom domain with GitHub Pages:

1. **Add CNAME file** to `public/` folder:
   ```
   yourdomain.com
   ```

2. **Configure DNS** with your domain provider:
   - Add CNAME record pointing to `yourusername.github.io`

3. **Enable HTTPS** in GitHub Pages settings

## Monitoring and Analytics

Consider adding:
- Google Analytics for usage tracking
- Error tracking (Sentry)
- Performance monitoring

Your game will be live and accessible to anyone with the URL!