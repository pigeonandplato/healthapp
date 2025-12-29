// Haptic feedback utilities
export function triggerHaptic(type: 'light' | 'medium' | 'heavy' = 'light') {
  if ('vibrate' in navigator) {
    const patterns = {
      light: 10,
      medium: 20,
      heavy: 30
    };
    navigator.vibrate(patterns[type]);
  }
}

export function triggerSuccess() {
  triggerHaptic('light');
}

export function triggerError() {
  triggerHaptic('medium');
}

export function triggerCompletion() {
  triggerHaptic('light');
  // Could add sound here too
}

