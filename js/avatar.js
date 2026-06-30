/**
 * HeartBeat Companion Website - Avatar Controller
 * Hardcoded to load local photo.jpeg. Coordinates expressions, blinking, waving, and hugs.
 */

const MOUTH_SHAPES = {
  happy: "M 85,115 Q 100,135 115,115 Q 100,120 85,115 Z", // filled grin
  sweet: "M 88,118 Q 100,128 112,118",                     // simple smile curve
  sad: "M 88,124 Q 100,114 112,124",                       // frown/pout curve
  stressed: "M 90,120 Q 100,115 110,121",                  // worried wavy curve
  tired: "M 92,120 L 108,120",                             // flat tired line
  frustrated: "M 88,125 Q 100,115 112,125",                // straight-ish pout
  surprised: "M 93,120 A 7,7 0 1,1 107,120 A 7,7 0 1,1 93,120 Z" // circle
};

class AvatarController {
  constructor(containerId) {
    this.container = document.getElementById(containerId);
    if (!this.container) return;

    this.defaultBody = document.getElementById("avatar-default-body");
    this.photoContainer = document.getElementById("avatar-photo-container");
    this.photoImg = document.getElementById("avatar-photo-img");
    
    // SVG Elements
    this.leftEye = document.getElementById("avatar-eye-left");
    this.rightEye = document.getElementById("avatar-eye-right");
    this.mouth = document.getElementById("avatar-mouth");
    this.cheekLeft = document.getElementById("avatar-cheek-left");
    this.cheekRight = document.getElementById("avatar-cheek-right");
    this.armLeft = document.getElementById("avatar-arm-left");
    this.armRight = document.getElementById("avatar-arm-right");

    this.currentExpression = "sweet";
    this.isBlinking = false;
    this.isWaving = false;
    this.isHugging = false;

    this.init();
  }

  init() {
    // Hardcode loading the local boyfriend/girlfriend photo
    this.loadPhoto("assets/avatar/image.png");

    // Start random blinking loop
    this.scheduleNextBlink();
    
    // Start subtle random head tilts
    this.scheduleRandomMicroActions();
  }

  loadPhoto(src) {
    if (this.photoImg) {
      this.photoImg.src = src;
    }
    if (this.defaultBody) this.defaultBody.style.display = "none";
    if (this.photoContainer) this.photoContainer.style.display = "block";
    
    // Add custom photo class to container for adjustments
    this.container.classList.add("has-photo");
  }

  // Expression controller
  setExpression(expression) {
    this.currentExpression = expression;
    const shape = MOUTH_SHAPES[expression] || MOUTH_SHAPES.sweet;
    
    if (this.mouth) {
      this.mouth.setAttribute("d", shape);
      if (expression === "happy" || expression === "surprised") {
        this.mouth.setAttribute("fill", "#ff7a93");
        this.mouth.setAttribute("stroke", "none");
      } else {
        this.mouth.setAttribute("fill", "none");
        this.mouth.setAttribute("stroke", "#5e5061");
      }
    }

    // Adjust eyes based on expression
    if (this.leftEye && this.rightEye) {
      if (expression === "happy") {
        this.leftEye.classList.add("bright");
        this.rightEye.classList.add("bright");
        this.leftEye.classList.remove("tired", "worried");
        this.rightEye.classList.remove("tired", "worried");
      } else if (expression === "tired") {
        this.leftEye.classList.add("tired");
        this.rightEye.classList.add("tired");
        this.leftEye.classList.remove("bright", "worried");
        this.rightEye.classList.remove("bright", "worried");
      } else if (expression === "sad" || expression === "stressed") {
        this.leftEye.classList.add("worried");
        this.rightEye.classList.add("worried");
        this.leftEye.classList.remove("bright", "tired");
        this.rightEye.classList.remove("bright", "tired");
      } else {
        this.leftEye.classList.remove("bright", "tired", "worried");
        this.rightEye.classList.remove("bright", "tired", "worried");
      }
    }

    // Blushing cheeks
    if (this.cheekLeft && this.cheekRight) {
      if (expression === "happy" || expression === "sweet") {
        this.cheekLeft.style.opacity = "0.7";
        this.cheekRight.style.opacity = "0.7";
        this.cheekLeft.style.transform = "scale(1.2)";
        this.cheekRight.style.transform = "scale(1.2)";
      } else {
        this.cheekLeft.style.opacity = "0.4";
        this.cheekRight.style.opacity = "0.4";
        this.cheekLeft.style.transform = "scale(1)";
        this.cheekRight.style.transform = "scale(1)";
      }
    }
  }

  // Waving action
  wave() {
    if (this.isWaving) return;
    this.isWaving = true;
    
    const prevExpression = this.currentExpression;
    this.setExpression("happy");
    
    if (this.armRight) {
      this.armRight.classList.add("waving-arm");
    }
    
    setTimeout(() => {
      if (this.armRight) {
        this.armRight.classList.remove("waving-arm");
      }
      this.isWaving = false;
      this.setExpression(prevExpression);
    }, 2000);
  }

  // Virtual Hug action
  hug() {
    if (this.isHugging) return;
    this.isHugging = true;

    const prevExpression = this.currentExpression;
    this.setExpression("happy");

    this.container.classList.add("hugging-body");
    if (this.armLeft) this.armLeft.classList.add("hugging-arm-left");
    if (this.armRight) this.armRight.classList.add("hugging-arm-right");

    setTimeout(() => {
      this.container.classList.remove("hugging-body");
      if (this.armLeft) this.armLeft.classList.remove("hugging-arm-left");
      if (this.armRight) this.armRight.classList.remove("hugging-arm-right");
      this.isHugging = false;
      this.setExpression(prevExpression);
    }, 2500);
  }

  // Smile / bounce animation
  bounce() {
    this.container.classList.add("bounce-bump");
    setTimeout(() => {
      this.container.classList.remove("bounce-bump");
    }, 800);
  }

  // Blink logic
  scheduleNextBlink() {
    const nextBlinkMs = Math.random() * 4000 + 2000;
    setTimeout(() => {
      this.blink();
      this.scheduleNextBlink();
    }, nextBlinkMs);
  }

  blink() {
    if (this.isBlinking || this.currentExpression === "tired") return;
    this.isBlinking = true;
    
    if (this.leftEye && this.rightEye) {
      this.leftEye.classList.add("blinking-eye");
      this.rightEye.classList.add("blinking-eye");
    }

    setTimeout(() => {
      if (this.leftEye && this.rightEye) {
        this.leftEye.classList.remove("blinking-eye");
        this.rightEye.classList.remove("blinking-eye");
      }
      this.isBlinking = false;
    }, 150);
  }

  // Micro animations
  scheduleRandomMicroActions() {
    const nextMs = Math.random() * 8000 + 6000;
    setTimeout(() => {
      if (!this.isWaving && !this.isHugging && Math.random() > 0.4) {
        this.container.classList.add("head-tilt");
        setTimeout(() => {
          this.container.classList.remove("head-tilt");
        }, 1200);
      }
      this.scheduleRandomMicroActions();
    }, nextMs);
  }
}

// Export to window
window.AvatarController = AvatarController;
