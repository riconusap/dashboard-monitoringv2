# GitHub Pages Deployment Setup

This project is configured for automatic deployment to GitHub Pages using GitHub Actions.

## 🚀 Automatic Deployment

### Setup Instructions:

1. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" section
   - Set source to "GitHub Actions"

2. **Push to main branch:**
   - Any push to the `main` branch will trigger automatic deployment
   - The site will be available at: `https://riconusap.github.io/dashboard-monitoringv2/`

### Deployment Process:

The GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- ✅ Checkout the repository
- ✅ Set up Node.js 18
- ✅ Install dependencies (`npm ci`)
- ✅ Build the project for production
- ✅ Deploy to GitHub Pages

## 🔧 Configuration Files

### 1. **Vite Configuration** (`vite.config.ts`)
```typescript
base: process.env.NODE_ENV === 'production' ? '/dashboard-monitoringv2/' : '/'
```
- Sets the correct base URL for GitHub Pages
- Uses repository name as subdirectory

### 2. **GitHub Actions Workflow** (`.github/workflows/deploy.yml`)
- Automated deployment on push to main
- Uses official GitHub Pages actions
- Includes proper permissions and concurrency settings

### 3. **404 Handling** (`public/404.html`)
- Handles client-side routing for Vue.js SPA
- Redirects 404s to proper routes

## 📝 Manual Deployment (Optional)

If you need to deploy manually:

```bash
# Build for GitHub Pages
npm run build:github-pages

# The dist/ folder contains the built files
# Upload the contents to GitHub Pages manually
```

## 🌐 Live Demo

Once deployed, your dashboard will be available at:
**https://riconusap.github.io/dashboard-monitoringv2/**

## 🛠️ Development vs Production

### Development (localhost):
- Base URL: `/`
- Command: `npm run dev`
- URL: `http://localhost:5173`

### Production (GitHub Pages):
- Base URL: `/dashboard-monitoringv2/`
- Command: `npm run build` (triggered by GitHub Actions)
- URL: `https://riconusap.github.io/dashboard-monitoringv2/`

## 📋 Deployment Checklist

- [x] Vite config updated with correct base URL
- [x] GitHub Actions workflow created
- [x] 404.html for SPA routing
- [x] Router configured with BASE_URL
- [x] Build scripts added to package.json
- [x] Repository permissions configured

## 🔍 Troubleshooting

### Common Issues:

1. **404 on refresh:** 
   - Ensure `404.html` is in the `public/` directory
   - Check that base URL is correctly set in `vite.config.ts`

2. **Assets not loading:**
   - Verify the base URL matches your repository name
   - Check that all asset paths are relative

3. **Routing issues:**
   - Ensure router is using `import.meta.env.BASE_URL`
   - Check that all internal links use Vue Router

### GitHub Pages Settings:

1. Go to repository **Settings** → **Pages**
2. Set **Source** to "GitHub Actions"
3. Save settings
4. Push to main branch to trigger deployment

The deployment typically takes 2-5 minutes to complete.