# Testing Checklist for Health Tracker PWA

## Manual Testing Guide

### 1. Initial Load & Setup
- [ ] Run `npm run dev` and navigate to `http://localhost:3000`
- [ ] App should redirect to `/today`
- [ ] Today's date should display correctly
- [ ] All Phase 0 exercise blocks should load

### 2. Checklist View
- [ ] Toggle should be on "Checklist" by default (or last saved preference)
- [ ] All exercise blocks are displayed with headers
- [ ] Progress percentage shows 0% initially
- [ ] Check an exercise - checkbox should toggle
- [ ] Refresh page - checked state should persist
- [ ] Progress percentage updates correctly
- [ ] Complete all exercises - should show completion message
- [ ] "Push to Tomorrow" button appears when incomplete exercises exist
- [ ] Click "Push to Tomorrow" - should confirm and move exercises

### 3. Coach View
#### Quick Access
- [ ] Click "Show me my exercises for today" button
- [ ] View should switch to Coach View
- [ ] Page should scroll to top

#### Layout & Content
- [ ] Exercise cards display with SVG images
- [ ] Images are visible and properly sized
- [ ] Exercise name and prescription show correctly
- [ ] Step-by-step instructions are numbered and clear
- [ ] "Common Mistakes" accordion is collapsed by default
- [ ] Click "Common Mistakes" - section expands/collapses
- [ ] "Stop Conditions" accordion is collapsed by default
- [ ] Click "Stop Conditions" - section expands/collapses

#### Interaction
- [ ] Click green checkmark button - exercise marks as complete
- [ ] Checkmark appears in button
- [ ] Card opacity changes when completed
- [ ] Type in notes field - text saves automatically
- [ ] Refresh page - notes persist
- [ ] Completion state syncs between Checklist and Coach views

### 4. Block Timers
- [ ] Each block has a timer showing 00:00 initially
- [ ] Click "Start" - timer begins counting
- [ ] Button changes to "Pause"
- [ ] Red pulsing indicator appears while running
- [ ] Click "Pause" - timer stops
- [ ] Click "Reset" - timer returns to 00:00
- [ ] Refresh page - timer state persists (elapsed time saved)

### 5. View Toggle
- [ ] Click view toggle to switch between Checklist/Coach
- [ ] Completion state preserved across views
- [ ] View preference saves to localStorage
- [ ] Refresh page - last used view loads

### 6. Progress Tracking
- [ ] Block progress shows X/Y completed
- [ ] Block progress percentage calculates correctly
- [ ] Overall workout summary shows correct totals
- [ ] Progress bar animates when exercises completed
- [ ] Progress indicator changes color when 100% complete

### 7. Responsive Design
- [ ] Resize browser - UI adapts to mobile/tablet/desktop
- [ ] Touch targets are large enough on mobile (buttons, checkboxes)
- [ ] Text is readable at all sizes
- [ ] Images scale appropriately
- [ ] No horizontal scrolling on mobile

### 8. Dark Mode
- [ ] Enable system dark mode
- [ ] App switches to dark theme
- [ ] All colors are readable in dark mode
- [ ] SVG illustrations adapt to dark mode (use currentColor)
- [ ] Toggle back to light mode - theme updates

### 9. Offline Functionality
**First Visit (Online)**
- [ ] Open app with network enabled
- [ ] Service worker registers (check DevTools > Application > Service Workers)
- [ ] Assets are cached

**Subsequent Visit (Offline)**
- [ ] Enable offline mode in DevTools (Network tab)
- [ ] Refresh page
- [ ] App loads completely offline
- [ ] All images/SVGs display
- [ ] IndexedDB operations work (check/uncheck exercises)
- [ ] Timer works offline
- [ ] Notes save offline

### 10. PWA Installation

#### Desktop (Chrome/Edge)
- [ ] Install icon appears in address bar
- [ ] Click install - PWA installs
- [ ] Launch from desktop - opens in standalone window
- [ ] No browser UI visible in app window

#### iOS (Safari)
- [ ] Open in Safari on iPhone/iPad
- [ ] Share > Add to Home Screen
- [ ] Icon appears on home screen
- [ ] Launch from home screen - opens in standalone mode
- [ ] Status bar color matches theme

#### Android (Chrome)
- [ ] Install banner appears (or menu > Install app)
- [ ] Install app
- [ ] Icon appears in app drawer
- [ ] Launch - opens in standalone mode
- [ ] Splash screen shows briefly

### 11. Data Persistence
- [ ] Complete some exercises
- [ ] Close browser completely
- [ ] Reopen app
- [ ] Completion state restored
- [ ] Notes restored
- [ ] Timer values restored
- [ ] View preference restored

### 12. Edge Cases
- [ ] Navigate directly to `/` - redirects to `/today`
- [ ] No exercises in database - shows appropriate message (should auto-seed on first run)
- [ ] Long exercise notes - textarea expands appropriately
- [ ] Many exercises in block - scrollable, no layout breaks
- [ ] Rapid toggling of checkboxes - no race conditions
- [ ] Switch views rapidly - no flickering or state loss

### 13. Performance
- [ ] Initial page load < 3 seconds
- [ ] Subsequent loads < 1 second (cached)
- [ ] Smooth scrolling (60fps)
- [ ] No lag when checking exercises
- [ ] Timer updates smoothly every second
- [ ] Image lazy loading works (images load as scrolled into view)

### 14. Accessibility
- [ ] Keyboard navigation works (Tab through interactive elements)
- [ ] Enter/Space activates buttons
- [ ] Focus indicators visible
- [ ] ARIA labels present on buttons
- [ ] Color contrast sufficient (use DevTools Lighthouse)
- [ ] Screen reader compatible (test with VoiceOver/NVDA)

## Automated Testing (Future)

To add automated tests, consider:
- Jest + React Testing Library for components
- Playwright for E2E testing
- Lighthouse CI for performance/PWA audits

## Known Limitations

1. **Icon Files**: PNG icons need to be generated from SVG (see `/public/icons/README.md`)
2. **Database Reset**: To reset data, clear IndexedDB via DevTools > Application > Storage
3. **Phase 1-5**: Only Phase 0 exercises are fully implemented; others are placeholders

## Debugging Tips

### IndexedDB Issues
```javascript
// In browser console
const db = await indexedDB.databases()
console.log(db)

// Delete database to reset
indexedDB.deleteDatabase('health-tracker')
```

### Service Worker Issues
```
DevTools > Application > Service Workers
- Unregister service worker
- Clear storage
- Hard refresh (Cmd/Ctrl + Shift + R)
```

### Build Issues
```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run build
```

## Success Criteria

✅ App loads and functions completely offline after first visit  
✅ All 20+ Phase 0 exercises display with images and instructions  
✅ Both Checklist and Coach views work correctly  
✅ Exercise completion persists across sessions  
✅ Block timers track elapsed time accurately  
✅ Push to tomorrow moves incomplete exercises  
✅ PWA installs on iOS and Android  
✅ Mobile-first design is responsive and fast  
✅ Dark mode supported  
✅ No external API calls or image hosting required

