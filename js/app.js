/**
 * HeartBeat Companion Website - App Orchestrator & Native Mail Redirection
 * Locked with passcode access protection. Boyfriend email is hardcoded.
 */

class AppController {
  constructor() {
    this.speechBubble = document.getElementById("speech-bubble");
    this.speechText = document.getElementById("speech-text");
    this.greetingText = document.getElementById("greeting-text");

    // Passcode lock elements
    this.lockScreen = document.getElementById("lock-screen");
    this.passcodeInput = document.getElementById("passcode-input");
    this.unlockBtn = document.getElementById("btn-unlock");
    this.lockFeedback = document.getElementById("lock-feedback");

    this.engines = {};

    this.messageTimer = null;
    this.bfEmail = "da.madskull@gmail.com"; // Hardcoded boyfriend email address

    this.init();
  }

  init() {
    // 1. Initialize core animation/messages engines
    this.engines.messages = new window.MessageEngine();
    this.engines.particles = new window.ParticleEngine("particles-canvas");
    this.engines.avatar = new window.AvatarController("avatar-container");

    // 2. Setup Daily Greeting
    this.updateGreeting();

    // 3. Hook passcode listeners
    this.setupLockScreen();

    // 4. Hook main controls
    this.setupControlListeners();
  }

  setupLockScreen() {
    // Check if girlfriend has already unlocked in the past
    const isUnlocked = localStorage.getItem("heartbeat_unlocked") === "true";
    if (isUnlocked && this.lockScreen) {
      this.lockScreen.classList.add("unlocked");
      this.startRotations();
    } else {
      // Focus passcode input
      if (this.passcodeInput) {
        setTimeout(() => this.passcodeInput.focus(), 500);

        // Listen to Enter key
        this.passcodeInput.addEventListener("keydown", (e) => {
          if (e.key === "Enter") {
            this.tryUnlock();
          }
        });
      }

      if (this.unlockBtn) {
        this.unlockBtn.addEventListener("click", () => this.tryUnlock());
      }
    }
  }

  async hashString(str) {
    const msgBuffer = new TextEncoder().encode(str);
    const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, "0")).join("");
    return hashHex;
  }

  async tryUnlock() {
    if (!this.passcodeInput) return;

    const inputCode = this.passcodeInput.value.trim().toLowerCase();
    const hashedInput = await this.hashString(inputCode);

    // SHA-256 hash of password
    const correctHash = "5502f1ae57e2b579f39b223d57259a15b40cd6987c8b2f1718f871220d5ea78e";

    if (hashedInput === correctHash) {
      // Success! Lock it in
      localStorage.setItem("heartbeat_unlocked", "true");

      if (this.lockScreen) {
        this.lockScreen.classList.add("unlocked");
      }

      // Start quotes cycling (first quote shows immediately)
      this.startRotations();

    } else {
      // Shake input field and show warning
      if (this.passcodeInput) {
        this.passcodeInput.classList.add("shake-input");
        this.passcodeInput.value = "";
        this.passcodeInput.focus();

        setTimeout(() => {
          this.passcodeInput.classList.remove("shake-input");
        }, 400);
      }

      if (this.lockFeedback) {
        this.lockFeedback.textContent = "That's not our secret word, my princess! Try again. 🌸";
      }
    }
  }

  startRotations() {
    // Show a random quote immediately, then keep cycling
    this.showRandomQuoteNow();
    this.startGeneralMessageRotation();
  }

  showRandomQuoteNow() {
    if (!this.engines.messages) return;
    const msg = this.engines.messages.getNextGeneral();
    this.displaySpeechBubble(msg, false);
  }

  updateGreeting() {
    if (this.greetingText && this.engines.messages) {
      this.greetingText.textContent = this.engines.messages.getGreeting();
    }
  }

  // Display text in the speech bubble with fade transitions
  displaySpeechBubble(message, triggerHug = true) {
    if (!this.speechBubble || !this.speechText) return;

    // Apply fade out
    this.speechBubble.classList.add("fade-out");

    setTimeout(() => {
      this.speechText.textContent = message;
      this.speechBubble.classList.remove("fade-out");
      this.speechBubble.classList.add("fade-in");

      // Everytime a quote is given, show hug action and trigger hearts/sparkles
      if (triggerHug && this.engines.avatar) {
        this.engines.avatar.hug();

        if (this.engines.particles) {
          const rect = this.engines.avatar.container.getBoundingClientRect();
          const x = rect.left + rect.width / 2;
          const y = rect.top + rect.height / 2;
          this.engines.particles.triggerBurst(x, y, "heart", 20);
          this.engines.particles.triggerBurst(x, y, "sparkle", 10);
        }
      }

      setTimeout(() => {
        this.speechBubble.classList.remove("fade-in");
      }, 500);
    }, 300);
  }

  // Motivation Engine cycle: new random message every 5-8 seconds, never stops
  startGeneralMessageRotation() {
    if (this.messageTimer) clearTimeout(this.messageTimer);

    const scheduleNext = () => {
      // Random delay between 5 and 8 seconds
      const delay = Math.random() * 3000 + 5000;
      this.messageTimer = setTimeout(() => {
        const nextMsg = this.engines.messages.getNextGeneral();
        this.displaySpeechBubble(nextMsg, true);
        scheduleNext(); // Always reschedule — never stops
      }, delay);
    };

    scheduleNext();
  }


  setupControlListeners() {
    // Single "Ask for a Hug" Action Button
    const btnHugRequest = document.getElementById("btn-hug-request");
    if (btnHugRequest) {
      btnHugRequest.addEventListener("click", () => this.triggerHugRequest());
    }

    // Throttled mousemove heart trail
    let lastX = 0;
    let lastY = 0;
    const distanceThreshold = 10; // Only spawn if mouse travels > 10px

    window.addEventListener("mousemove", (e) => {
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > distanceThreshold) {
        if (this.engines.particles) {
          this.engines.particles.spawnTrailHeart(e.clientX, e.clientY);
        }
        lastX = e.clientX;
        lastY = e.clientY;
      }
    });

    // Emoji rain buttons in the footer
    const emojiBtns = document.querySelectorAll(".emoji-btn");
    emojiBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        if (btn.classList.contains("cooldown")) return;

        const type = btn.getAttribute("data-emoji");
        if (this.engines.particles) {
          this.engines.particles.triggerScreenFill(type);
        }

        // Trigger 800ms click lock
        btn.classList.add("cooldown");
        setTimeout(() => {
          btn.classList.remove("cooldown");
        }, 800);
      });
    });
  }

  // Trigger mail redirection + local animations
  triggerHugRequest() {
    const avatar = this.engines.avatar;
    const particles = this.engines.particles;

    // 1. Play local animations instantly
    if (avatar) avatar.hug();

    if (particles) {
      const rect = avatar.container.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      particles.triggerBurst(x, y, "heart", 30);
      particles.triggerBurst(x, y, "sparkle", 15);
    }

    // 2. Launch Native Mailto redirection
    const subject = encodeURIComponent("Heartbeat Companion - Hug Request ❤️");
    const body = encodeURIComponent("Gf wants hug ❤️");

    this.displaySpeechBubble("Sending you the biggest hug... Opening mail client! ❤️", false);

    // Open default mail app with boyfriend email
    window.location.href = `mailto:${this.bfEmail}?subject=${subject}&body=${body}`;
  }
}

// Window load init
window.addEventListener("DOMContentLoaded", () => {
  window.app = new AppController();
});
