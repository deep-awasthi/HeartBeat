/**
 * HeartBeat Companion Website - High-Performance Canvas Particle Engine
 * Supports ambient floating shapes, mood-specific background elements (rain, confetti, bubbles),
 * and dynamic interactive bursts (heart explosions, sparkle rings).
 */

class ParticleEngine {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    if (!this.canvas) return;
    this.ctx = this.canvas.getContext("2d");
    
    this.particles = [];
    this.ambientParticles = [];
    this.bursts = [];
    
    this.currentMood = "happy"; // default
    this.reducedMotion = false;
    
    // Configs
    this.maxAmbient = 25;
    this.maxMoodParticles = 60;
    
    this.init();
  }

  init() {
    this.resize();
    window.addEventListener("resize", () => this.resize());
    
    // Pre-render emojis once at startup to prevent dynamic font layout/render lag
    this.emojiCache = {};
    this.preRenderEmojis();

    // Spawn initial ambient particles
    for (let i = 0; i < this.maxAmbient; i++) {
      this.ambientParticles.push(this.createAmbientParticle(true));
    }
    
    // Start animation loop
    this.active = true;
    this.loop();
  }

  preRenderEmojis() {
    const emojis = {
      heart: "❤️",
      sparkle: "✨",
      star: "⭐",
      bubble: "🫧",
      flower: "🌸"
    };
    
    for (const [key, emoji] of Object.entries(emojis)) {
      const offCanvas = document.createElement("canvas");
      // Use 96x96 to render ultra crisp on high DPI screens
      offCanvas.width = 96;
      offCanvas.height = 96;
      const offCtx = offCanvas.getContext("2d");
      
      offCtx.font = "68px sans-serif";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(emoji, 48, 48);
      
      this.emojiCache[key] = offCanvas;
    }

    // Pre-render a tiny vector heart for cursor trail to prevent path calculation lag
    const offCanvasHeart = document.createElement("canvas");
    offCanvasHeart.width = 32;
    offCanvasHeart.height = 32;
    const offCtxHeart = offCanvasHeart.getContext("2d");
    offCtxHeart.fillStyle = "#ff85a2"; // cute soft pink
    
    // Draw heart path centered in 32x32 canvas
    this.drawHeart(offCtxHeart, 16, 5, 20);
    this.emojiCache["heart_trail"] = offCanvasHeart;
  }

  resize() {
    this.width = this.canvas.width = window.innerWidth;
    this.height = this.canvas.height = window.innerHeight;
  }

  setReducedMotion(enabled) {
    this.reducedMotion = enabled;
    if (enabled) {
      this.particles = [];
      this.ambientParticles = [];
    } else {
      // Re-init ambient
      if (this.ambientParticles.length === 0) {
        for (let i = 0; i < this.maxAmbient; i++) {
          this.ambientParticles.push(this.createAmbientParticle(true));
        }
      }
    }
  }

  setMood(mood) {
    this.currentMood = mood;
    // Clear current mood particles to transition smoothly
    this.particles = [];
  }

  createAmbientParticle(randomY = false) {
    const types = ["circle", "star", "heart"];
    return {
      x: Math.random() * this.width,
      y: randomY ? Math.random() * this.height : this.height + 20,
      size: Math.random() * 20 + 8,
      speedX: (Math.random() - 0.5) * 0.4,
      speedY: -(Math.random() * 0.4 + 0.2),
      opacity: Math.random() * 0.25 + 0.05,
      type: types[Math.floor(Math.random() * types.length)],
      color: this.getAmbientColor(),
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.005
    };
  }

  getAmbientColor() {
    const colors = [
      "rgba(230, 220, 255, 1)", // Lavender
      "rgba(255, 220, 235, 1)", // Baby Pink
      "rgba(220, 240, 255, 1)", // Baby Blue
      "rgba(255, 245, 220, 1)"  // Cream
    ];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  createMoodParticle() {
    const mood = this.currentMood;
    const base = {
      x: Math.random() * this.width,
      y: -20,
      size: 0,
      speedX: 0,
      speedY: 0,
      opacity: 1,
      color: "#fff",
      rotation: 0,
      rotationSpeed: 0,
      gravity: 0,
      type: mood
    };

    switch (mood) {
      case "happy":
        // Confetti
        base.size = Math.random() * 8 + 4;
        base.speedX = (Math.random() - 0.5) * 3;
        base.speedY = Math.random() * 3 + 2;
        base.color = `hsl(${Math.random() * 360}, 85%, 75%)`;
        base.rotation = Math.random() * Math.PI * 2;
        base.rotationSpeed = (Math.random() - 0.5) * 0.1;
        base.gravity = 0.1;
        break;
      case "sad":
        // Gentle Rain
        base.size = Math.random() * 2 + 1; // line width or length
        base.x = Math.random() * this.width;
        base.y = Math.random() * -100;
        base.speedX = -1; // slanted slightly left
        base.speedY = Math.random() * 4 + 6;
        base.color = "rgba(174, 219, 247, 0.4)";
        base.opacity = Math.random() * 0.5 + 0.3;
        break;
      case "stressed":
        // Slow Rising Bubbles
        base.y = this.height + 20;
        base.size = Math.random() * 12 + 4;
        base.speedX = (Math.random() - 0.5) * 0.6;
        base.speedY = -(Math.random() * 1 + 0.5);
        base.color = "rgba(224, 243, 233, 0.35)";
        base.opacity = Math.random() * 0.4 + 0.1;
        break;
      case "tired":
        // Floating Zzz and Sleeping Stars
        base.size = Math.random() * 10 + 6;
        base.speedX = (Math.random() - 0.5) * 0.4;
        base.speedY = -(Math.random() * 0.6 + 0.4);
        base.color = Math.random() > 0.5 ? "rgba(255, 239, 186, 0.6)" : "rgba(202, 220, 252, 0.5)";
        base.opacity = Math.random() * 0.5 + 0.2;
        base.type = Math.random() > 0.6 ? "zzz" : "tiredStar";
        base.rotation = Math.random() * 0.2 - 0.1;
        break;
      case "frustrated":
        // Gentle Cooling Snowflakes
        base.size = Math.random() * 6 + 3;
        base.speedX = (Math.random() - 0.5) * 1;
        base.speedY = Math.random() * 1 + 1;
        base.color = "rgba(240, 248, 255, 0.6)";
        base.opacity = Math.random() * 0.6 + 0.2;
        break;
    }
    return base;
  }

  // Trigger heart or sparkle burst from avatar position
  triggerBurst(x, y, type = "heart", count = 20) {
    if (this.reducedMotion) return;
    
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 2;
      
      this.bursts.push({
        x: x,
        y: y,
        size: type === "heart" ? Math.random() * 12 + 6 : Math.random() * 8 + 4,
        speedX: Math.cos(angle) * speed,
        speedY: Math.sin(angle) * speed - 1, // push upward
        gravity: 0.12,
        opacity: 1,
        color: type === "heart" 
          ? `hsla(${Math.random() * 20 + 340}, 95%, 75%, 1)` // warm soft pinks/reds
          : `hsla(${Math.random() * 40 + 40}, 95%, 80%, 1)`, // gold/yellow sparkles
        type: type,
        life: 1.0,
        decay: Math.random() * 0.02 + 0.015,
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.1
      });
    }
  }

  // Spawn small trail hearts at cursor coordinates
  spawnTrailHeart(x, y) {
    if (this.reducedMotion) return;

    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 0.3 + 0.1;
    
    this.bursts.push({
      x: x,
      y: y,
      size: Math.random() * 5 + 6, // slightly larger cached draw size
      speedX: Math.cos(angle) * speed,
      speedY: -Math.random() * 0.8 - 0.2, // slowly float upwards
      gravity: 0.005, // very light gravity drift
      opacity: 0.85,
      color: null,
      type: "heart_trail", // Use cached heart trail canvas
      life: 1.0,
      decay: 0.017, // decays over exactly 1 second
      rotation: Math.random() * Math.PI * 2,
      rotationSpeed: (Math.random() - 0.5) * 0.03
    });
  }

  // Trigger massive screen-filling rain of emojis
  triggerScreenFill(type) {
    if (this.reducedMotion) return;

    // Count active emoji particles to prevent CPU/rendering overhead
    const activeEmojis = this.bursts.filter(b => b.type === "emoji").length;
    if (activeEmojis >= 75) return; // Strict active limit lowered from 100 for safety
    
    const emojiMap = {
      heart: "❤️",
      sparkle: "✨",
      star: "⭐",
      bubble: "🫧",
      flower: "🌸"
    };
    const emojiChar = emojiMap[type] || "❤️";
    
    // Fill up to the limit of 75 emojis on-screen (reduced density to 40 per click for 60 FPS safety)
    const count = Math.min(40, 75 - activeEmojis);
    if (count <= 0) return;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * this.width;
      // Start slightly staggered above the viewport
      const y = Math.random() * -this.height * 0.6 - 30;
      
      this.bursts.push({
        x: x,
        y: y,
        size: Math.random() * 24 + 18, // size 18px to 42px
        speedX: (Math.random() - 0.5) * 1.2, // slower direct drift
        speedY: Math.random() * 1.5 + 2.0, // slower float-down speed
        gravity: 0.02, // very light gravity for Ghibli floatiness
        opacity: 0.9,
        color: null,
        type: "emoji",
        emojiKey: type, // Cache reference key for drawing
        life: 1.0,
        decay: Math.random() * 0.005 + 0.004, // lasts longer (~4 to 5 seconds)
        rotation: Math.random() * Math.PI * 2,
        rotationSpeed: (Math.random() - 0.5) * 0.02, // slower, gentler spin
        swayTime: Math.random() * 100,
        swaySpeed: Math.random() * 0.03 + 0.015,
        swayAmplitude: Math.random() * 0.8 + 0.4
      });
    }
  }

  drawHeart(ctx, x, y, size) {
    ctx.beginPath();
    const d = size;
    ctx.moveTo(x, y + d / 4);
    ctx.bezierCurveTo(x - d / 2, y - d / 2, x - d, y + d / 3, x, y + d);
    ctx.bezierCurveTo(x + d, y + d / 3, x + d / 2, y - d / 2, x, y + d / 4);
    ctx.closePath();
    ctx.fill();
  }

  drawStar(ctx, cx, cy, spikes, outerRadius, innerRadius) {
    let rot = Math.PI / 2 * 3;
    let x = cx;
    let y = cy;
    let step = Math.PI / spikes;

    ctx.beginPath();
    ctx.moveTo(cx, cy - outerRadius);
    for (let i = 0; i < spikes; i++) {
      x = cx + Math.cos(rot) * outerRadius;
      y = cy + Math.sin(rot) * outerRadius;
      ctx.lineTo(x, y);
      rot += step;

      x = cx + Math.cos(rot) * innerRadius;
      y = cy + Math.sin(rot) * innerRadius;
      ctx.lineTo(x, y);
      rot += step;
    }
    ctx.lineTo(cx, cy - outerRadius);
    ctx.closePath();
    ctx.fill();
  }

  drawZzz(ctx, x, y, size, opacity) {
    ctx.font = `bold ${size}px 'Outfit', sans-serif`;
    ctx.fillStyle = `rgba(220, 230, 255, ${opacity})`;
    ctx.fillText("Z", x, y);
  }

  updateAndDrawAmbient() {
    for (let i = this.ambientParticles.length - 1; i >= 0; i--) {
      const p = this.ambientParticles[i];
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      
      // Wrap around or recreate
      if (p.y < -20 || p.x < -20 || p.x > this.width + 20) {
        this.ambientParticles[i] = this.createAmbientParticle(false);
        continue;
      }
      
      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;
      
      if (p.type === "circle") {
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === "star") {
        this.drawStar(this.ctx, p.x, p.y, 4, p.size / 2, p.size / 4);
      } else if (p.type === "heart") {
        this.drawHeart(this.ctx, p.x, p.y, p.size / 1.5);
      }
      this.ctx.restore();
    }
  }

  updateAndDrawMood() {
    // Spawn mood specific particles slowly
    if (this.particles.length < this.maxMoodParticles && Math.random() < 0.12) {
      this.particles.push(this.createMoodParticle());
    }
    
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      
      // Apply forces
      p.speedY += p.gravity;
      p.x += p.speedX;
      p.y += p.speedY;
      p.rotation += p.rotationSpeed;
      
      // boundary check
      const outOfBounds = 
        (p.y > this.height + 30 && p.speedY > 0) || 
        (p.y < -30 && p.speedY < 0) ||
        (p.x < -30 || p.x > this.width + 30);
        
      if (outOfBounds) {
        this.particles.splice(i, 1);
        continue;
      }
      
      this.ctx.save();
      this.ctx.globalAlpha = p.opacity;
      this.ctx.fillStyle = p.color;
      this.ctx.strokeStyle = p.color;
      
      if (p.type === "happy") {
        // Rotated Confetti rectangle
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size / 2);
      } else if (p.type === "sad") {
        // Raindrop line
        this.ctx.lineWidth = p.size;
        this.ctx.beginPath();
        this.ctx.moveTo(p.x, p.y);
        this.ctx.lineTo(p.x + p.speedX * 1.5, p.y + p.speedY * 1.5);
        this.ctx.stroke();
      } else if (p.type === "stressed") {
        // Slow Rising Bubbles with subtle outline
        this.ctx.beginPath();
        this.ctx.arc(p.x, p.y, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
        this.ctx.lineWidth = 1;
        this.ctx.strokeStyle = "rgba(255, 255, 255, 0.4)";
        this.ctx.stroke();
      } else if (p.type === "zzz") {
        this.drawZzz(this.ctx, p.x, p.y, p.size, p.opacity);
      } else if (p.type === "tiredStar") {
        this.drawStar(this.ctx, p.x, p.y, 4, p.size / 2, p.size / 4);
      } else if (p.type === "frustrated") {
        // Small floating Snowflake cross shapes
        this.ctx.translate(p.x, p.y);
        this.ctx.rotate(p.rotation);
        this.ctx.lineWidth = 1.5;
        this.ctx.beginPath();
        this.ctx.moveTo(-p.size, 0); this.ctx.lineTo(p.size, 0);
        this.ctx.moveTo(0, -p.size); this.ctx.lineTo(0, p.size);
        this.ctx.stroke();
      }
      this.ctx.restore();
    }
  }

  updateAndDrawBursts() {
    for (let i = this.bursts.length - 1; i >= 0; i--) {
      const b = this.bursts[i];
      b.speedY += b.gravity;
      b.x += b.speedX;
      if (b.type === "emoji") {
        b.swayTime += b.swaySpeed;
        b.x += Math.sin(b.swayTime) * b.swayAmplitude;
      }
      b.y += b.speedY;
      b.rotation += b.rotationSpeed;
      b.life -= b.decay;
      
      if (b.life <= 0) {
        this.bursts.splice(i, 1);
        continue;
      }
      
      this.ctx.save();
      this.ctx.globalAlpha = b.life * b.opacity;
      this.ctx.fillStyle = b.color;
      
      if (b.type === "heart") {
        this.drawHeart(this.ctx, b.x, b.y, b.size);
      } else if (b.type === "sparkle") {
        this.drawStar(this.ctx, b.x, b.y, 4, b.size, b.size / 3);
      } else if (b.type === "heart_trail") {
        this.ctx.translate(b.x, b.y);
        this.ctx.rotate(b.rotation);
        const size = b.size * b.life;
        const cacheHeart = this.emojiCache["heart_trail"];
        if (cacheHeart) {
          this.ctx.drawImage(cacheHeart, -size / 2, -size / 2, size, size);
        }
      } else if (b.type === "emoji") {
        this.ctx.translate(b.x, b.y);
        this.ctx.rotate(b.rotation);
        // Shrink gently as it fades out near end of life
        const size = b.size * Math.min(1, b.life * 1.5);
        const cacheCanvas = this.emojiCache[b.emojiKey];
        if (cacheCanvas) {
          this.ctx.drawImage(cacheCanvas, -size / 2, -size / 2, size, size);
        }
      }
      this.ctx.restore();
    }
  }

  loop() {
    if (!this.active) return;
    
    // Clear canvas
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    if (!this.reducedMotion) {
      this.updateAndDrawAmbient();
      this.updateAndDrawMood();
      this.updateAndDrawBursts();
    }
    
    requestAnimationFrame(() => this.loop());
  }

  destroy() {
    this.active = false;
    window.removeEventListener("resize", () => this.resize());
  }
}

// Export to window
window.ParticleEngine = ParticleEngine;
