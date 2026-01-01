# 🚀 Quick Setup Guide

**Get the Minecraft Learning Platform running in 15 minutes**

-----

## 📋 Prerequisites

Before starting, make sure you have:

- [ ] **Git** installed ([Download](https://git-scm.com/))
- [ ] **Node.js** v18+ installed ([Download](https://nodejs.org/))
- [ ] **GitHub Account** ([Sign up](https://github.com/))
- [ ] **Code Editor** (VS Code recommended)
- [ ] **Terminal/Command Line** access

Check versions:

```bash
git --version
node --version
npm --version
```

-----

## 🏗️ Step-by-Step Setup

### Step 1: Create GitHub Repository

1. Go to [GitHub.com](https://github.com/)
1. Click **“New Repository”**
1. Name: `minecraft-learning-platform`
1. Description: `Educational platform with Minecraft-style learning islands`
1. Select: **Public** (or Private if preferred)
1. ✅ Check: “Add a README file”
1. Click **“Create repository”**

### Step 2: Clone Repository Locally

```bash
# Clone your new repository
git clone https://github.com/YOUR_USERNAME/minecraft-learning-platform.git

# Navigate into the folder
cd minecraft-learning-platform
```

### Step 3: Create Folder Structure

Copy and paste this entire command:

```bash
# Create all directories at once
mkdir -p docs \
  web/src/components \
  web/src/data \
  web/src/utils \
  web/src/styles \
  web/public \
  archipels/programming/island-01-intro-makecode \
  archipels/mathematics \
  translations/en/archipels/programming \
  translations/de/archipels/programming \
  assets/videos \
  assets/minecraft-worlds \
  assets/images/thumbnails \
  assets/code-examples/makecode \
  assets/code-examples/python \
  ai-tutor \
  scripts \
  .github/workflows
```

### Step 4: Create Documentation Files

```bash
# Create all essential docs
touch docs/PROJECT-STRUCTURE.md
touch docs/SETUP-GUIDE.md
touch docs/AI-ASSISTANT-INSTRUCTIONS.md
touch docs/CHANGELOG.md
touch CONTRIBUTING.md
```

**Now copy the content from the artifacts I created into these files!**

### Step 5: Initialize React App

```bash
# Navigate to web folder
cd web

# Initialize Vite React project
npm create vite@latest . -- --template react

# Say YES when asked to proceed
# Say YES to use current directory

# Install dependencies
npm install

# Install Lucide React for icons
npm install lucide-react
```

### Step 6: Copy Main Application

```bash
# You're in web/ folder
# Open web/src/App.jsx in your editor
# Delete everything and paste the React code from the artifact
```

**Copy the complete React app artifact into `web/src/App.jsx`**

### Step 7: Update package.json

Open `web/package.json` and add these scripts:

```json
{
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview",
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

Install gh-pages:

```bash
npm install --save-dev gh-pages
```

### Step 8: Create First Lesson Content

```bash
# Go back to root
cd ..

# Create lesson files
cd archipels/programming/island-01-intro-makecode

# Create files
touch lesson.md
touch minecraft-challenge.md
touch quiz.json
touch test.json
touch resources.json
```

Now fill these files with content (I’ll create templates next!).

### Step 9: Test Locally

```bash
# Go back to web folder
cd ../../../web

# Start development server
npm run dev
```

Open browser to `http://localhost:5173` - you should see the app! 🎉

### Step 10: First Git Commit

```bash
# Go back to root
cd ..

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
web/node_modules/

# Build files
web/dist/
web/build/

# Environment files
.env
.env.local

# OS files
.DS_Store
Thumbs.db

# IDE files
.vscode/
.idea/
*.swp
*.swo

# Logs
*.log
npm-debug.log*
EOF

# Add all files
git add .

# Commit
git commit -m "Initial setup: folder structure and React app"

# Push to GitHub
git push origin main
```

-----

## 🌐 Deploy to GitHub Pages

### Option A: Automatic Deployment (Recommended)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  workflow_dispatch:

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout
        uses: actions/checkout@v3
      
      - name: Setup Node
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        working-directory: ./web
        run: npm install
      
      - name: Build
        working-directory: ./web
        run: npm run build
      
      - name: Deploy
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./web/dist
```

Commit and push:

```bash
git add .github/workflows/deploy.yml
git commit -m "Add GitHub Pages deployment"
git push origin main
```

### Option B: Manual Deployment

```bash
cd web
npm run build
npm run deploy
```

### Enable GitHub Pages

1. Go to repository on GitHub
1. **Settings** → **Pages**
1. Source: **gh-pages branch**
1. Click **Save**
1. Wait 2-3 minutes
1. Visit: `https://YOUR_USERNAME.github.io/minecraft-learning-platform`

-----

## ✅ Verification Checklist

After setup, verify everything works:

- [ ] Repository created on GitHub
- [ ] Cloned locally
- [ ] Folder structure matches docs/PROJECT-STRUCTURE.md
- [ ] `npm run dev` starts without errors
- [ ] App displays in browser (localhost:5173)
- [ ] Can switch between EN/DE languages
- [ ] Can toggle day/night mode (Overworld)
- [ ] First commit pushed to GitHub
- [ ] GitHub Pages deployed successfully

-----

## 🔧 Common Issues & Solutions

### Issue: “npm: command not found”

**Solution:** Install Node.js from https://nodejs.org/

### Issue: “Permission denied” on folder creation

**Solution:**

```bash
# macOS/Linux
sudo mkdir -p [folder-name]

# Or change ownership
sudo chown -R $USER:$USER .
```

### Issue: React app shows blank page

**Solution:**

1. Check browser console for errors (F12)
1. Verify App.jsx has no syntax errors
1. Check if all imports are correct
1. Try: `npm install` and `npm run dev` again

### Issue: GitHub Pages shows 404

**Solution:**

1. Check Pages settings (Settings → Pages)
1. Verify `gh-pages` branch exists
1. Wait 5-10 minutes for first deployment
1. Check GitHub Actions for errors

### Issue: “Module not found: lucide-react”

**Solution:**

```bash
cd web
npm install lucide-react
```

-----

## 📁 Quick File Reference

After setup, your structure should look like:

```
minecraft-learning-platform/
├── docs/
│   ├── PROJECT-STRUCTURE.md ✅
│   ├── SETUP-GUIDE.md ✅
│   ├── AI-ASSISTANT-INSTRUCTIONS.md ✅
│   └── CHANGELOG.md
├── web/
│   ├── src/
│   │   └── App.jsx ✅
│   ├── package.json ✅
│   └── node_modules/ ✅
├── archipels/
│   └── programming/
│       └── island-01-intro-makecode/
│           ├── lesson.md (create content)
│           ├── quiz.json (create content)
│           └── test.json (create content)
├── .gitignore ✅
├── README.md ✅
└── .github/
    └── workflows/
        └── deploy.yml ✅
```

-----

## 🎯 Next Steps

Now that setup is complete:

1. **Create Content**: Fill in lesson.md, quiz.json, test.json
1. **Add Translations**: Create German versions
1. **Add Media**: Upload videos, Minecraft worlds
1. **Customize Themes**: Adjust colors if needed
1. **Test Thoroughly**: Try all features
1. **Share with Team**: Send GitHub repo link

-----

## 🆘 Need Help?

### Resources:

- **This Project Docs**: `docs/PROJECT-STRUCTURE.md`
- **React Docs**: https://react.dev/learn
- **Vite Docs**: https://vitejs.dev/guide/
- **GitHub Pages**: https://pages.github.com/

### Support:

- Create an issue on GitHub
- Ask in team chat
- Consult AI assistant with `docs/AI-ASSISTANT-INSTRUCTIONS.md`

-----

## 🎉 Success!

If you can see the app running locally and on GitHub Pages, **you’re all set!**

Time to start building amazing lessons! 🚀

**Next document to read:** `docs/CONTENT-CREATION-GUIDE.md` (I’ll create this next if you want!)