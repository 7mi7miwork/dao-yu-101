# 🤖 AI Assistant Instructions

**Purpose:** Instructions for AI assistants (like Claude, ChatGPT, etc.) helping to build this project

-----

## 📖 Before You Start

When a human asks you to help with this Minecraft Learning Platform:

1. **FIRST**: Ask them to share `docs/PROJECT-STRUCTURE.md`
1. **READ**: The entire structure document carefully
1. **UNDERSTAND**: The data flow and folder hierarchy
1. **VERIFY**: Which parts already exist before creating new files

-----

## 🎯 Your Role

You are helping build an educational platform with these components:

- **React Frontend** (`web/`) - Interactive website
- **Content Repository** (`archipels/`) - Markdown lessons
- **Multi-language Support** (`translations/`) - EN/DE/more
- **Password System** - Two-way validation (platform + Minecraft)
- **Minecraft Themes** - Overworld/Nether/End styling

-----

## 📋 Standard Workflow

### When Asked: “Create a new lesson”

```markdown
1. Ask: "Which archipelago?" (programming, mathematics, etc.)
2. Ask: "What island number?" (island-01, island-02, etc.)
3. Ask: "What language?" (start with EN default)
4. Create folder: `archipels/[archipelago]/island-XX-[name]/`
5. Create files:
   - lesson.md
   - minecraft-challenge.md
   - quiz.json
   - test.json
   - resources.json
6. Generate passwords (random, memorable)
7. Update metadata.json
8. Create German translation in `translations/de/`
```

### When Asked: “Update the frontend”

```markdown
1. Check: Is it the main App.jsx or a component?
2. Location: `web/src/App.jsx` or `web/src/components/[name].jsx`
3. Maintain: Existing theme system (overworld/nether/end)
4. Preserve: Password validation logic
5. Test: Describe how to test the change
```

### When Asked: “Add a new language”

```markdown
1. Create: `translations/[lang-code]/archipels/`
2. Copy structure from: `translations/en/`
3. Translate: All lesson.md files
4. Update: `web/src/data/translations.json`
5. Add language code to: dropdown in App.jsx
```

-----

## 🔧 File Creation Templates

### New Lesson (lesson.md)

```markdown
# Island XX: [Lesson Title]

**Duration:** 60 minutes  
**Theme:** [overworld_day/overworld_night/nether/end]  
**Level:** [beginner/advanced/expert]

## 🎯 Learning Objectives

By the end of this lesson, you will be able to:
- Objective 1
- Objective 2
- Objective 3

## 📚 Prerequisites

- Completed: Island XX
- Knowledge: [Required concepts]

## 🎓 Lesson Content

### Part 1: [Section Title]

[Content here with code examples]

```javascript
// Example code
function example() {
  console.log("Hello Minecraft!");
}
```

### Part 2: [Section Title]

[More content…]

## 💪 Practice Exercises

1. **Exercise 1**: [Description]
- Hint: [Helpful tip]
- Expected outcome: [What should happen]
1. **Exercise 2**: [Description]

## 🧪 Mini Quiz

Try these questions before the main quiz:

- Question 1?
- Question 2?

## 📝 Summary

Key takeaways:

- Point 1
- Point 2
- Point 3

## 🔗 Additional Resources

- [Resource name](URL)
- [Resource name](URL)

```
### Minecraft Challenge (minecraft-challenge.md)

```markdown
# 🎮 Minecraft Challenge: Island XX

**Objective:** Complete this challenge in Minecraft to get your second password

## 📍 Location

1. Open the main learning world
2. Enter password: `[PLATFORM_PASSWORD]` at the lesson gate
3. Find the portal to Island XX area

## 🎯 Your Mission

[Description of what they need to build/solve in Minecraft]

### Steps:

1. **Step 1**: [Detailed instruction]
   - Tip: [Helpful tip]
   
2. **Step 2**: [Detailed instruction]

3. **Step 3**: [Detailed instruction]

## 🔍 Finding the Password

Once you complete the challenge:
1. Look for the Command Block in the center
2. Right-click it to reveal the password
3. Write down: `[MINECRAFT_PASSWORD]`

## ✅ Verification

To verify you completed it correctly:
- [ ] Checklist item 1
- [ ] Checklist item 2
- [ ] Password revealed

## 💡 Stuck? Hints Available!

Use the AI Tutor on the platform if you need help!

**Next Step:** Return to the platform and enter both passwords to unlock Island [XX+1]
```

### Quiz JSON Template

```json
{
  "quizId": "[archipelago]-island-[XX]-quiz",
  "title": "Island XX Quiz",
  "description": "Test your understanding before the final test",
  "totalQuestions": 5,
  "passingScore": 60,
  "allowRetry": true,
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "[Question text]",
      "options": [
        "Option A",
        "Option B",
        "Option C",
        "Option D"
      ],
      "correctAnswer": 0,
      "explanation": "Why this is correct...",
      "hint": "Think about...",
      "points": 10
    }
  ]
}
```

### Test JSON Template

```json
{
  "testId": "[archipelago]-island-[XX]-test",
  "title": "Island XX Final Test",
  "description": "Pass this test to get your platform password",
  "totalQuestions": 10,
  "passingScore": 80,
  "timeLimit": 20,
  "allowRetry": false,
  "platformPassword": "[GENERATE_RANDOM]",
  "questions": [
    {
      "id": 1,
      "type": "multiple-choice",
      "question": "[Question text]",
      "options": [
        "Option A",
        "Option B", 
        "Option C",
        "Option D"
      ],
      "correctAnswer": 0,
      "points": 10
    }
  ]
}
```

-----

## 🔐 Password Generation Rules

### Platform Passwords

- Format: `[WORD]_[WORD]_[NUMBER]`
- Example: `CODE_CRAFT_42`
- Length: 8-16 characters
- Use: Uppercase letters, underscores, numbers
- Memorable: Should relate to lesson topic

### Minecraft Passwords

- Format: `[THEME]_[WORD]_[NUMBER]`
- Example: `NETHER_KEY_99`
- Length: 8-20 characters
- Use: Uppercase letters, underscores, numbers
- Thematic: Should match Minecraft world theme

### Generation Script

```javascript
function generatePassword(theme, islandNumber) {
  const themes = {
    overworld: ['GRASS', 'TREE', 'DIRT', 'STONE'],
    nether: ['FIRE', 'LAVA', 'BLAZE', 'PORTAL'],
    end: ['ENDER', 'VOID', 'DRAGON', 'CRYSTAL']
  };
  
  const actions = ['KEY', 'UNLOCK', 'MASTER', 'ACCESS'];
  const themeWord = themes[theme][Math.floor(Math.random() * themes[theme].length)];
  const action = actions[Math.floor(Math.random() * actions.length)];
  const number = Math.floor(Math.random() * 100);
  
  return `${themeWord}_${action}_${number}`;
}
```

-----

## ✅ Validation Checklist

Before submitting any code or content:

### Content Files

- [ ] Lesson.md follows template structure
- [ ] Minecraft-challenge.md has clear steps
- [ ] Quiz has 5+ questions with hints
- [ ] Test has 10+ questions, 80% passing score
- [ ] Resources.json links to video and downloads
- [ ] All passwords are unique and memorable

### Code Files

- [ ] Follows existing code style
- [ ] Theme system maintained (4 themes)
- [ ] Password validation logic works
- [ ] Language switching works
- [ ] Mobile responsive
- [ ] No console errors

### File Structure

- [ ] Files in correct folders
- [ ] Naming conventions followed
- [ ] metadata.json updated
- [ ] passwords.json updated
- [ ] Translations created for all languages

-----

## 🚫 Common Mistakes to Avoid

### ❌ DON’T:

1. **Break the folder structure**
   
   ```
   ❌ archipels/programming-island-01.md
   ✅ archipels/programming/island-01-intro/lesson.md
   ```
1. **Mix languages in one file**
   
   ```
   ❌ lesson.md with EN + DE content
   ✅ lesson.md (EN) + translations/de/.../lesson.md (DE)
   ```
1. **Hardcode passwords in React**
   
   ```
   ❌ const password = "hardcoded123";
   ✅ Load from passwords.json
   ```
1. **Forget to update metadata.json**
   
   ```
   ❌ Create island files but don't update metadata
   ✅ Always update metadata.json when adding islands
   ```
1. **Use wrong file extensions**
   
   ```
   ❌ lesson.txt, quiz.yaml
   ✅ lesson.md, quiz.json
   ```

-----

## 🎨 Theme System Reference

### Available Themes

```javascript
{
  overworld_day: {
    bg: 'from-sky-400 via-green-300 to-green-500',
    card: 'from-green-100 to-emerald-50 border-green-600',
    primary: 'from-green-600 to-emerald-700',
    icon: '☀️'
  },
  overworld_night: {
    bg: 'from-indigo-900 via-blue-900 to-gray-900',
    card: 'from-gray-800 to-slate-900 border-blue-500',
    primary: 'from-blue-600 to-indigo-700',
    icon: '🌙'
  },
  nether: {
    bg: 'from-red-900 via-orange-800 to-red-950',
    card: 'from-red-950 to-orange-950 border-red-600',
    primary: 'from-red-600 to-orange-700',
    icon: '🔥'
  },
  end: {
    bg: 'from-purple-950 via-violet-900 to-black',
    card: 'from-purple-950 to-violet-950 border-purple-500',
    primary: 'from-purple-600 to-violet-700',
    icon: '🐉'
  }
}
```

### When to Use Each Theme

- **Overworld Day** (☀️): Beginner lessons, introductions
- **Overworld Night** (🌙): Intermediate lessons, dark mode
- **Nether** (🔥): Advanced lessons, challenging topics
- **End** (🐉): Expert lessons, final challenges

-----

## 📞 Quick Commands for AI

### “Show me the structure”

```bash
tree -L 3 -I 'node_modules|.git'
```

### “Where does X go?”

```
Content files → archipels/[name]/island-XX/
React components → web/src/components/
Translations → translations/[lang]/archipels/
Documentation → docs/
```

### “How do I test this?”

```bash
cd web
npm install
npm run dev
# Open http://localhost:5173
```

-----

## 🤝 Collaboration Tips

### When Multiple AIs are Working

1. **Always pull latest** before starting
1. **Check what exists** - don’t duplicate
1. **Follow naming exactly** - consistency is key
1. **Document changes** in CHANGELOG.md
1. **Test before committing**

### Communication Format

When reporting what you built:

```markdown
## Changes Made

### Files Created:
- archipels/programming/island-04-advanced-python/lesson.md
- translations/de/archipels/programming/island-04-advanced-python/lesson.md

### Files Modified:
- archipels/programming/metadata.json (added island-04)
- archipels/programming/passwords.json (added new passwords)

### Passwords Generated:
- Platform: PYTHON_ADVANCED_87
- Minecraft: NETHER_CODE_45

### Testing:
- Verified lesson renders correctly
- Password validation works
- Theme displays as 'nether'
```

-----

## 🆘 Emergency Procedures

### “I made a mistake in the file structure”

1. Don’t panic
1. Check git log: `git log --oneline`
1. Revert if needed: `git revert [commit-hash]`
1. Review docs/PROJECT-STRUCTURE.md
1. Recreate correctly

### “The React app won’t start”

1. Check package.json exists in web/
1. Run: `npm install`
1. Check for errors in console
1. Verify all imports in App.jsx
1. Check node version: `node --version` (should be 18+)

### “Passwords aren’t validating”

1. Check passwords.json format
1. Verify both passwords exist
1. Check passwordValidator.js logic
1. Test with console.log()
1. Ensure exact string match (case-sensitive)

-----

## 📚 Learning Resources

### For AI Assistants to Reference

- **React Docs**: https://react.dev
- **Vite Docs**: https://vitejs.dev
- **Tailwind CSS**: https://tailwindcss.com
- **Minecraft Education**: https://education.minecraft.net
- **MakeCode**: https://minecraft.makecode.com

-----

**Remember: This project follows a strict structure. When in doubt, check PROJECT-STRUCTURE.md first!**

**Your goal: Make this platform amazing while maintaining consistency and quality.**