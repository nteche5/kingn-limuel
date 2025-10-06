# 🚀 Deployment Guide - King Limuel Properties

This guide will help you deploy your King Limuel Properties website to GitHub Pages for free.

## ✅ What's Already Set Up

- ✅ Next.js configured for static export
- ✅ GitHub Actions workflow for automatic deployment
- ✅ Package.json scripts for building
- ✅ All TypeScript errors fixed
- ✅ Google Maps removed (no API key needed)

## 📋 Step-by-Step Deployment

### 1. Create GitHub Repository

1. Go to [GitHub.com](https://github.com) and sign in
2. Click the "+" icon → "New repository"
3. Name it: `king-limuel-properties2` (or any name you prefer)
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have files)
6. Click "Create repository"

### 2. Upload Your Code

**Option A: Using Git (Recommended)**
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: King Limuel Properties website"

# Add your GitHub repository as remote
git remote add origin https://github.com/YOUR_USERNAME/king-limuel-properties2.git

# Push to GitHub
git push -u origin main
```

**Option B: Using GitHub Web Interface**
1. Go to your new repository on GitHub
2. Click "uploading an existing file"
3. Drag and drop all your project files
4. Commit the changes

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click **Settings** tab
3. Scroll down to **Pages** section
4. Under **Source**, select **"GitHub Actions"**
5. Save the settings

### 4. Automatic Deployment

- The GitHub Actions workflow will automatically run when you push to the `main` branch
- Go to the **Actions** tab in your repository to see the deployment progress
- The first deployment may take 5-10 minutes

### 5. Access Your Live Website

Once deployed, your website will be available at:
```
https://YOUR_USERNAME.github.io/king-limuel-properties2/
```

Replace `YOUR_USERNAME` with your actual GitHub username.

## 🔄 Making Updates

To update your website:

1. Make changes to your code locally
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Update website"
   git push origin main
   ```
3. GitHub Actions will automatically rebuild and deploy
4. Your changes will be live in 2-5 minutes

## 🛠️ Manual Build (Optional)

If you want to build locally and test:

```bash
# Build the static site
npm run build

# The static files will be in the 'out' directory
# You can serve them locally with any static server
```

## 📁 What Gets Deployed

The deployment includes:
- ✅ Homepage with property listings
- ✅ Property search and filtering
- ✅ Upload property form (with coordinate input)
- ✅ Contact page
- ✅ Admin dashboard
- ✅ All images and documents
- ✅ Responsive design for all devices

## 🚨 Important Notes

1. **Repository Name**: If you use a different repository name, update the `basePath` in `next.config.js`
2. **Custom Domain**: You can add a custom domain in GitHub Pages settings
3. **File Size**: GitHub Pages has a 1GB limit (your site is much smaller)
4. **Build Time**: Free accounts get 2000 build minutes per month

## 🆘 Troubleshooting

**Build Fails?**
- Check the Actions tab for error messages
- Make sure all files are committed
- Verify the repository is public

**Website Not Loading?**
- Wait 5-10 minutes after first deployment
- Check the Actions tab to ensure deployment completed
- Verify the URL format is correct

**Need Help?**
- Check GitHub Pages documentation
- Review the Actions logs for specific errors
- Make sure your repository is public

## 🎉 Success!

Once deployed, you'll have a professional real estate website that:
- ✅ Works on all devices
- ✅ Loads fast
- ✅ Has no external dependencies
- ✅ Updates automatically when you push changes
- ✅ Is completely free to host

Your King Limuel Properties website is now live and ready for the world to see! 🏠✨
