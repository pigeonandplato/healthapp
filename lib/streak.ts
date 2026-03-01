// Streak tracking utility
import { getCompletionsByDate } from "./db";

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function calculateStreak(): Promise<number> {
  let streak = 0;
  const today = new Date();
  
  // Check backwards from today
  for (let i = 0; i < 365; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateString = toLocalDateString(checkDate);
    
    const completions = await getCompletionsByDate(dateString);
    const hasCompletions = completions.some((c) => c.completed);
    
    if (hasCompletions) {
      streak++;
    } else {
      // If today hasn't been done yet, don't break the streak
      if (i === 0) continue;
      break;
    }
  }
  
  return streak;
}

export function getStreakMessage(streak: number): string {
  if (streak === 0) return "Start your journey! 🌟";
  if (streak === 1) return "Great start! Keep going! 💪";
  if (streak < 7) return `${streak} days strong! 🔥`;
  if (streak < 30) return `Amazing ${streak}-day streak! 🚀`;
  if (streak < 100) return `Incredible ${streak} days! 👑`;
  return `Legendary ${streak}-day streak! 🏆`;
}

export function getMotivationalMessage(): string {
  const messages = [
    "You've got this! 💪",
    "Every rep counts! 🎯",
    "Progress, not perfection! ✨",
    "Stronger every day! 💥",
    "One step at a time! 🚶",
    "Your body will thank you! 🙏",
    "Consistency is key! 🔑",
    "You're unstoppable! 🔥",
  ];
  
  return messages[Math.floor(Math.random() * messages.length)];
}



