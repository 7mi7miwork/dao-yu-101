# Dao Yu Learning Platform

A modular, scalable learning platform built as a static website that can be deployed directly to GitHub Pages. Features Minecraft-themed and programming language themes with comprehensive gamification and internationalization support.

## 🚀 Features

### 🎮 **Minecraft Themes**
- **Overworld Theme**: Classic Minecraft world with day/night modes
- **Nether Theme**: Fiery underworld with lava effects
- **End Theme**: Mysterious dimension with starfield effects

### 💻 **Programming Language Themes**
- **Python Theme**: Clean, professional Python-inspired design
- **JavaScript Theme**: Modern web development aesthetic
- **Rust Theme**: Systems programming with safety-focused design

### 📚 **Course Structure (Archipel System)**
- **Archipelago (Subject)** → **Island (Topic)** → **15 Lessons**
- Progressive difficulty levels (Beginner → Intermediate → Advanced)
- Interactive exercises and quizzes
- Progress tracking and completion certificates

### 🎯 **Gamification System**
- Points, levels, and experience tracking
- Daily streaks and achievements
- Badge collection system
- Global leaderboard
- Course ownership and progress rewards

### 🛒 **Course Shop**
- Individual course purchases
- Bundle deals with savings
- Promotional discounts
- Free and premium content

### 🌍 **Internationalization**
- English and German translations (easily extensible)
- Dynamic language switching
- Localized content and UI elements

### 📱 **Responsive Design**
- Mobile-first approach
- Tablet and desktop optimizations
- Touch-friendly interfaces

## 📁 Project Structure

```
dao-yu-101/
├── docs/                    # Build output for GitHub Pages
├── src/                     # Source files
│   ├── css/                # Stylesheets
│   │   └── main.css        # Main styles
│   ├── js/                 # JavaScript modules
│   │   ├── app.js          # Main application controller
│   │   ├── i18n.js         # Internationalization system
│   │   ├── theme-manager.js # Theme management
│   │   ├── gamification.js # Gamification system
│   │   ├── courses.js      # Course management
│   │   ├── shop.js         # Shop system
│   │   ├── leaderboard.js  # Leaderboard system
│   │   └── profile.js      # User profile system
│   ├── themes/             # Theme stylesheets
│   │   ├── minecraft-overworld.css
│   │   ├── minecraft-nether.css
│   │   ├── minecraft-end.css
│   │   ├── programming-python.css
│   │   ├── programming-javascript.css
│   │   └── programming-rust.css
│   ├── courses/            # Course content (Archipel structure)
│   ├── shop/               # Shop-related content
│   ├── gamification/       # Gamification assets
│   ├── layouts/            # Layout templates
│   └── index.html          # Main HTML file
├── i18n/                   # Translation files
│   ├── en.json            # English translations
│   └── de.json            # German translations
├── public/                 # Static assets
├── .gitignore              # Git ignore file
├── 404.html               # Custom 404 page
├── build.js               # Build script
├── package.json           # Node.js dependencies
└── README.md              # This file
```

## 🛠️ Local Development

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd dao-yu-101
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```
   
   The application will be available at `http://localhost:3000`

4. **Build for production**
   ```bash
   npm run build
   ```
   
   This will copy all files from `src/` to `docs/` for GitHub Pages deployment.

## 🚀 GitHub Pages Deployment

### Automatic Deployment

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   ```

2. **Enable GitHub Pages**
   - Go to your repository settings
   - Scroll to "GitHub Pages" section
   - Under "Source", select "Deploy from a branch"
   - Choose "main" branch and "/docs" folder
   - Save settings

3. **Deploy using npm script** (optional)
   ```bash
   npm run deploy
   ```
   This will build and commit changes to deploy to GitHub Pages.

### Manual Deployment

1. **Build the project**
   ```bash
   npm run build
   ```

2. **Push to GitHub**
   ```bash
   git add docs/
   git commit -m "Deploy to GitHub Pages"
   git push origin main
   ```

Your site will be available at `https://<username>.github.io/<repository-name>/`

## 🎨 Theme System

The platform supports dynamic theme switching between Minecraft and programming language themes:

### Minecraft Themes
- **Overworld**: Green and brown palette with grass and wood textures
- **Nether**: Red and orange with lava effects and fire animations
- **End**: Purple and black with starfield and portal effects

### Programming Themes
- **Python**: Blue and yellow with code syntax highlighting
- **JavaScript**: Yellow and black with modern web dev aesthetics
- **Rust**: Orange and black with systems programming focus

### Day/Night Mode
All themes support day/night mode switching for better user experience.

## 🎮 Gamification Features

### Points System
- **Lesson Completion**: 20 points
- **Course Purchase**: 30 points
- **Daily Login**: 5 points
- **Achievements**: Variable points (10-200)

### Achievements
- First Steps (Complete first lesson)
- Week Warrior (7-day streak)
- Rising Star (Reach level 5)
- Course Collector (Own 5 courses)
- Point Master (Earn 1000 points)

### Badges
- Beginner (Level 1)
- Learner (Level 3)
- Expert (Level 5)
- Master (Level 10)
- Legend (Level 20)

## 🌍 Adding New Languages

1. **Create translation file**
   ```bash
   cp i18n/en.json i18n/fr.json
   ```

2. **Edit the new translation file**
   ```json
   {
     "common": {
       "loading": "Chargement...",
       "error": "Erreur",
       // ... translate all strings
     }
   }
   ```

3. **Update language selector**
   Add the new language option in `src/index.html`:
   ```html
   <option value="fr">Français</option>
   ```

4. **Update i18n.js** to load the new language

## 🎯 Course Structure

Courses follow the Archipel system:
- **Archipelago (Subject)**: Main subject area (e.g., Programming Basics)
- **Island (Topic)**: Specific topics within the subject (e.g., Variables)
- **Lessons**: 15 lessons per topic with progressive difficulty

Each lesson includes:
- Learning objectives
- Key concepts
- Practical examples
- Exercises (quiz, coding, challenge)
- Completion rewards

## 🔧 Customization

### Adding New Themes

1. **Create theme CSS file**
   ```bash
   cp src/themes/minecraft-overworld.css src/themes/custom-theme.css
   ```

2. **Edit theme variables**
   ```css
   :root {
     --primary-color: #your-color;
     --secondary-color: #your-color;
     // ... other variables
   }
   ```

3. **Add theme selector option**
   Add to `src/index.html`:
   ```html
   <option value="custom-theme">Custom Theme</option>
   ```

### Adding New Courses

1. **Edit courses.js**
   Add new course to the `loadCourses()` method following the existing structure.

2. **Create course content**
   Add lesson content, exercises, and media files to appropriate directories.

## 🐛 Troubleshooting

### Common Issues

1. **Build fails**
   - Ensure Node.js is installed and up to date
   - Check that all dependencies are installed
   - Verify file permissions

2. **Theme not loading**
   - Check CSS file paths in `src/index.html`
   - Verify theme file exists in `src/themes/`
   - Check browser console for errors

3. **i18n not working**
   - Verify translation files exist in `i18n/`
   - Check JSON syntax in translation files
   - Ensure browser supports fetch API

4. **GitHub Pages not updating**
   - Verify `.nojekyll` file exists in `docs/`
   - Check that GitHub Pages is configured for `/docs` folder
   - Ensure build was successful

### Debug Mode

Enable debug mode by adding `?debug=true` to the URL to see additional console logs and error information.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Minecraft theme inspired by Mojang's Minecraft
- Programming themes inspired by respective language communities
- Gamification concepts from modern learning platforms
- Icons and emojis from Unicode and open sources

## 📞 Support

For support and questions:
- Create an issue in the GitHub repository
- Check the troubleshooting section above
- Review the code comments for additional documentation

---

**Happy Learning! 🎓🚀**
