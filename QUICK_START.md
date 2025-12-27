# Quick Start Guide

## 🚀 Get Started in 3 Steps

### 1. Start the Development Server

```bash
cd /Users/amandeepgill/Desktop/health-tracker-pwa
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 2. Explore the App

The app will redirect to `/today` where you'll see:

- **"Show me my exercises for today" button** - Click this to see the Coach View with detailed exercise cards
- **View Toggle** - Switch between Checklist and Coach views
- **Exercise Blocks** - 6 blocks with 20+ Phase 0 exercises

### 3. Try Key Features

#### Checklist View
- ✅ Check off exercises as you complete them
- 📊 Watch your progress percentage increase
- ⏭️ Click "Push to Tomorrow" to move incomplete exercises

#### Coach View
- 🖼️ See SVG illustrations for each exercise
- 📝 Read step-by-step instructions
- ⚠️ Check common mistakes and stop conditions
- ⏱️ Use block timers to track your workout
- 📋 Add notes for each exercise

## 📱 Test Offline Functionality

1. Open the app in your browser
2. Open DevTools (F12)
3. Go to Network tab
4. Select "Offline" from the throttling dropdown
5. Refresh the page
6. ✅ App should work perfectly offline!

## 🔨 Build for Production

```bash
npm run build
npm start
```

The production build is optimized and ready to deploy.

## 📦 Project Structure at a Glance

```
/app
  /today/page.tsx       ← Main workout page
/components
  CoachView.tsx         ← Detailed view with cards
  ChecklistView.tsx     ← Quick checklist
  ExerciseCard.tsx      ← Individual exercise card
  BlockTimer.tsx        ← Workout timer
  ViewToggle.tsx        ← View switcher
/lib
  types.ts              ← TypeScript definitions
  db.ts                 ← IndexedDB operations
  seedData.ts           ← 20+ Phase 0 exercises
  exerciseMedia.ts      ← Inline SVG illustrations
/public
  manifest.json         ← PWA configuration
  /icons/               ← App icons
```

## 🎯 What You Can Do Right Now

### View Exercises
- Browse all 20+ Phase 0 exercises with illustrations
- Read detailed instructions for each movement
- Learn common mistakes to avoid

### Track Workouts
- Mark exercises as complete
- Add personal notes
- Track time with block timers

### Test Offline
- Use the app without internet
- All data saves locally in IndexedDB
- Service worker caches everything

### Install as App
- iOS: Safari → Share → Add to Home Screen
- Android: Chrome → Menu → Install app

## 📚 More Information

- `README.md` - Full documentation
- `TESTING.md` - Testing checklist
- `PROJECT_SUMMARY.md` - What was built

## 💡 Tips

1. **First Time?** The database auto-seeds with Phase 0 exercises on first load
2. **Dark Mode** Your system's dark mode preference is automatically applied
3. **View Preference** Your last used view (Checklist/Coach) is remembered
4. **Offline Ready** After first visit, the app works 100% offline

## 🐛 Troubleshooting

### App won't load?
```bash
# Clear cache and rebuild
rm -rf .next
npm run dev
```

### Database issues?
```javascript
// In browser console
indexedDB.deleteDatabase('health-tracker')
// Then refresh page
```

### Service worker issues?
```
DevTools > Application > Service Workers > Unregister
Then hard refresh (Cmd+Shift+R / Ctrl+Shift+R)
```

## ✨ Enjoy Your Health Tracker PWA!

The app is fully functional and ready to use. All 20+ Phase 0 exercises are complete with:
- ✅ Inline SVG illustrations
- ✅ Step-by-step instructions
- ✅ Common mistakes
- ✅ Stop conditions
- ✅ Timers & progress tracking
- ✅ Offline support

Happy exercising! 💪

