# Health Tracker PWA

An offline-first, mobile-ready Progressive Web App for tracking health and exercise routines. Built with Next.js 14+, TypeScript, Tailwind CSS, and IndexedDB.

## Features

### 🎯 Dual View Modes
- **Checklist View**: Quick overview with checkboxes for tracking completion
- **Coach View**: Detailed exercise cards with images, instructions, and guidance

### 💪 Comprehensive Exercise Library
- **Phase 0 (Current)**: Complete rehabilitation program with 20+ exercises
  - Warm-Up & Reset: Breathing and mobility
  - Knee + Hip Control: Lower body strength
  - Core & Back Protection: Spinal stability
  - Hips / Tightness Relief: Stretching and relaxation
  - Wrist / Hand: Upper extremity care
  - Cardio: Low-impact options
- **Phases 1-5**: Placeholder exercises for future progression

### 📱 PWA Features
- Fully offline-capable after first visit
- Installable on iOS and Android
- No external dependencies for images (all stored locally)
- Fast and responsive mobile-first design
- 24 high-quality exercise photos (~1.5MB total)

### 🎨 Exercise Cards Include
- Real exercise photos from Pexels (free for commercial use)
- YouTube video search integration (hover to reveal)
- Step-by-step instructions
- Common mistakes (collapsible)
- Stop conditions (collapsible)
- Notes field for tracking progress
- Prescription details (sets, reps, holds, duration)

### ⏱️ Built-in Tools
- Block timers with start/pause/reset
- Progress tracking with visual indicators
- "Push to tomorrow" for incomplete exercises
- Persistent completion state via IndexedDB

## Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

### Development

Open [http://localhost:3000](http://localhost:3000) - the app will redirect to `/today`.

The app uses:
- **Next.js 14+** with App Router
- **TypeScript** for type safety
- **Tailwind CSS** for styling
- **IndexedDB** (via `idb` library) for offline storage
- **@ducanh2912/next-pwa** for PWA capabilities

## Project Structure

```
/app
  /today              - Main workout page
  /layout.tsx         - Root layout with PWA metadata
  /page.tsx           - Redirects to /today
/components
  /BlockTimer.tsx     - Timer component for workout blocks
  /ChecklistView.tsx  - Compact checklist view
  /CoachView.tsx      - Detailed coach view with cards
  /ExerciseCard.tsx   - Individual exercise card component
  /ViewToggle.tsx     - Switch between views
/lib
  /db.ts             - IndexedDB wrapper functions
  /exerciseMedia.ts  - Inline SVG illustrations (20+)
  /seedData.ts       - Exercise library and block definitions
  /types.ts          - TypeScript type definitions
/public
  /manifest.json     - PWA manifest
  /icons/            - App icons (SVG + PNGs needed)
```

## Usage

### Today Screen
1. **Quick Start Button**: "Show me my exercises for today" - switches to Coach View
2. **View Toggle**: Switch between Checklist and Coach views
3. **Checklist View**: 
   - Check off exercises as you complete them
   - See progress percentage
   - Push incomplete exercises to tomorrow
4. **Coach View**:
   - View detailed exercise cards with images
   - Read step-by-step instructions
   - Check common mistakes and stop conditions
   - Use block timers to track workout duration
   - Add notes for each exercise

### Offline Usage
1. Visit the site once while online
2. The service worker will cache all assets
3. App works completely offline on subsequent visits
4. All data stored locally in IndexedDB

### Installing as PWA

#### iOS (Safari)
1. Open the app in Safari
2. Tap the Share button
3. Select "Add to Home Screen"

#### Android (Chrome)
1. Open the app in Chrome
2. Tap the menu (three dots)
3. Select "Install app" or "Add to Home Screen"

## Customization

### Adding New Exercises

Edit `/lib/seedData.ts`:

```typescript
const newExercise: Exercise = {
  id: "unique-id",
  name: "Exercise Name",
  description: "Brief description",
  phase: Phase.PHASE_0,
  media: exerciseMediaMap["exercise-id"],
  prescription: {
    sets: 3,
    reps: 10,
    description: "3 sets × 10 reps",
  },
  instructions: [
    "Step 1...",
    "Step 2...",
  ],
  commonMistakes: ["Mistake 1..."],
  stopConditions: ["Stop if..."],
  category: "Category Name",
};
```

### Adding New SVG Illustrations

Edit `/lib/exerciseMedia.ts`:

```typescript
const newExerciseSVG = createSVG(`
  <!-- Your SVG path elements here -->
`);

// Add to map
export const exerciseMediaMap: Record<string, ExerciseMedia> = {
  "new-exercise-id": {
    type: "svg",
    svg: newExerciseSVG,
    alt: "Description for accessibility",
  },
  // ... other exercises
};
```

## PWA Icons

For production, generate PNG icons from the SVG in `/public/icons/`:

```bash
# Using ImageMagick
convert -background none -resize 192x192 icons/icon.svg icons/icon-192x192.png
convert -background none -resize 512x512 icons/icon.svg icons/icon-512x512.png
```

Or use online converters:
- https://cloudconvert.com/svg-to-png
- https://convertio.co/svg-png/

## Testing Checklist

- [ ] App loads offline (after first visit)
- [ ] Toggle between Checklist ↔ Coach View preserves completion state
- [ ] "Show me my exercise for today" button switches to Coach View
- [ ] Block timers start/pause/reset correctly
- [ ] Exercise completion persists across page reloads
- [ ] Push to tomorrow moves uncompleted exercises
- [ ] All Phase 0 exercises have images and instructions
- [ ] SVG images render correctly on mobile
- [ ] Collapsible sections work (common mistakes, stop conditions)
- [ ] Notes input saves to IndexedDB
- [ ] PWA installs on iOS/Android
- [ ] Dark mode works

## Tech Stack

- **Framework**: Next.js 16.1.1 (App Router + Turbopack)
- **Language**: TypeScript 5
- **Styling**: Tailwind CSS 3
- **Database**: IndexedDB via `idb` 8.x
- **PWA**: @ducanh2912/next-pwa
- **Runtime**: React 19

## Future Enhancements

- [ ] Phase 1-5 exercise libraries with detailed instructions
- [ ] Exercise history and analytics
- [ ] Custom workout builder
- [ ] Progress photos
- [ ] Optional Supabase sync for multi-device
- [ ] Export workout data
- [ ] Voice commands for hands-free operation

## License

Private installable PWA - not for public distribution.

## Support

For issues or questions, refer to the inline documentation in the code or the comprehensive exercise descriptions in the Coach View.
