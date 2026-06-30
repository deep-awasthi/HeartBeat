/**
 * HeartBeat Companion Website - Motivation & Message Engine
 * Sweet, warm, boyfriend-to-girlfriend messages.
 * Consolidated quotes database. No dead weight variables.
 */

const GENERAL_MESSAGES = [
  "I'm so proud of you, princess. Keep going. ❤️",
  "You are stronger than you think, and I believe in you.",
  "Every small step you take makes me even prouder.",
  "You are doing an amazing job, even if it doesn't feel like it today.",
  "I know how hard you're trying, and I'm proud of every bit of it.",
  "You inspire me with your determination every day.",
  "You are capable of achieving everything you dream about.",
  "Never underestimate how incredible you are.",
  "Your effort never goes unnoticed. I'm proud of you.",
  "I believe in your dreams because I believe in you.",
  "You have everything it takes to succeed.",
  "Keep moving forward. You're doing wonderfully.",
  "One step at a time, my princess. You're getting there.",
  "You make me proud simply by never giving up.",
  "Your strength amazes me every single day.",
  "You're growing into an even more incredible person every day.",
  "I know today may be hard, but I know you're stronger than it.",
  "You are capable of beautiful things.",
  "Your hard work will always pay off.",
  "I'm proud of how dedicated you are.",
  "You continue to impress me with your resilience.",
  "Every challenge you face is making you stronger.",
  "You are braver than you realize.",
  "You have an amazing heart and an unstoppable spirit.",
  "You don't have to be perfect to make me proud.",
  "You are enough exactly as you are.",
  "Keep believing in yourself the way I believe in you.",
  "You have already overcome so much. Keep going.",
  "I'm proud of your courage.",
  "You are becoming stronger every single day.",
  "Your consistency inspires me.",
  "You have the strength to handle whatever comes your way.",
  "Even on difficult days, you continue to shine.",
  "You deserve every success that's coming your way.",
  "Your determination is one of the things I admire most.",
  "Never stop believing in your potential.",
  "You are capable of achieving incredible things.",
  "I'm proud of every effort you make.",
  "Your dreams are worth chasing, and I know you'll reach them.",
  "You are making progress, even if it feels slow.",
  "Every day you grow into a better version of yourself.",
  "I admire your strength more than you know.",
  "Your perseverance is inspiring.",
  "You always find a way to keep going, and that makes me so proud.",
  "You are stronger than every obstacle in front of you.",
  "You are creating a beautiful future with your hard work.",
  "Trust yourself. You've got this.",
  "You have everything you need within you.",
  "You make me proud every single day.",
  "I believe in your abilities completely.",
  "Don't let one difficult day define your journey.",
  "Progress is still progress, no matter how small.",
  "Keep your head up. Better days are coming.",
  "You are capable of more than you imagine.",
  "I admire your patience and determination.",
  "You have a beautiful mindset. Keep nurturing it.",
  "Every challenge is another opportunity to grow.",
  "You inspire everyone around you, including me.",
  "You have a quiet strength that is truly remarkable.",
  "You continue to surprise me with how capable you are.",
  "You are doing much better than you think.",
  "Your future is incredibly bright.",
  "You have what it takes to accomplish your goals.",
  "Every effort you make brings you closer to your dreams.",
  "I'm incredibly proud of your journey.",
  "Never stop believing in yourself.",
  "Your resilience is one of your greatest strengths.",
  "I admire the way you keep moving forward.",
  "You deserve to be proud of yourself too.",
  "You have come so far already.",
  "Every day is another opportunity to grow.",
  "You are stronger because of everything you've overcome.",
  "You inspire me with your courage.",
  "You are building something amazing for your future.",
  "Your dedication will always be rewarded.",
  "Stay patient. Great things take time.",
  "You are becoming the person you're meant to be.",
  "I know you'll accomplish amazing things.",
  "Your hard work always makes me smile.",
  "Keep believing. Your breakthrough is coming.",
  "You are fearless in ways you don't even notice.",
  "Your confidence grows with every step you take.",
  "The effort you put in today will make tomorrow even better.",
  "I'm proud to watch you grow every day.",
  "You make difficult things look possible.",
  "You never stop learning, and I admire that.",
  "Your persistence is truly inspiring.",
  "You have an incredible future ahead of you.",
  "Believe in yourself because I always will.",
  "Every challenge you overcome makes you even stronger.",
  "Your determination is your superpower.",
  "Success looks good on you because you've earned it.",
  "You are capable of achieving greatness.",
  "You continue to amaze me with your growth.",
  "You are making yourself proud, even if you don't realize it yet.",
  "Never doubt your abilities.",
  "I know you're going to accomplish wonderful things.",
  "Keep shining. The world needs your light.",
  "You are one of the strongest people I know.",
  "Every day I'm even prouder of the person you're becoming.",
  "You are unstoppable when you believe in yourself.",
  "I'm always proud of you, no matter what.",
  "You are enough. You are capable. You are amazing.",
  "Keep going, princess. You're doing an incredible job, and I'm so proud of you. ❤️"
];

const TIME_GREETINGS = {
  morning: "Good morning, princess ☀️ I hope your day starts with soft sunlight and sweet moments.",
  afternoon: "Hope my girl's day is going well 🌸 Remember to check in on yourself and take a break.",
  evening: "You've worked hard today, my love ❤️ I hope your evening is cozy and peaceful.",
  night: "Rest well, sweet dreams, baby 🌙 Tomorrow is another beautiful day, and I'll be right here."
};

class MessageEngine {
  constructor() {
    this.generalHistory = [];
  }

  getGreeting() {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return TIME_GREETINGS.morning;
    } else if (hour >= 12 && hour < 17) {
      return TIME_GREETINGS.afternoon;
    } else if (hour >= 17 && hour < 22) {
      return TIME_GREETINGS.evening;
    } else {
      return TIME_GREETINGS.night;
    }
  }

  _pickUnique(pool, historyList, maxHistoryLength) {
    if (pool.length === 1) return pool[0];

    let validPool = pool.filter(msg => !historyList.includes(msg));

    if (validPool.length === 0) {
      historyList.length = 0;
      validPool = pool;
    }

    const idx = Math.floor(Math.random() * validPool.length);
    const chosen = validPool[idx];

    historyList.push(chosen);
    if (historyList.length > maxHistoryLength) {
      historyList.shift();
    }

    return chosen;
  }

  getNextGeneral() {
    const historyCap = Math.min(25, Math.floor(GENERAL_MESSAGES.length / 2));
    return this._pickUnique(GENERAL_MESSAGES, this.generalHistory, historyCap);
  }
}

window.MessageEngine = MessageEngine;
window.GENERAL_MESSAGES = GENERAL_MESSAGES;
window.TIME_GREETINGS = TIME_GREETINGS;
