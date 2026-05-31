// Streak tracking utility
import { getCompletionsByDateRange } from "./db";

function toLocalDateString(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export async function calculateStreak(): Promise<number> {
  const today = new Date();
  const start = new Date(today);
  start.setDate(start.getDate() - 365);

  // Single query for the whole window instead of 365 sequential round-trips.
  const completions = await getCompletionsByDateRange(
    toLocalDateString(start),
    toLocalDateString(today)
  );

  // Set of dates that have at least one completed exercise.
  const completedDates = new Set(
    completions.filter((c) => c.completed).map((c) => c.date)
  );

  let streak = 0;
  for (let i = 0; i < 366; i++) {
    const checkDate = new Date(today);
    checkDate.setDate(checkDate.getDate() - i);
    const dateString = toLocalDateString(checkDate);

    if (completedDates.has(dateString)) {
      streak++;
    } else {
      // If today hasn't been done yet, don't break the streak.
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



