// High-Precision Neon Football Physics Engine
import { soundEngine } from './audio.js';

export class PhysicsEngine {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');

    // Dynamic Arena dimensions
    this.width = canvas.width;
    this.height = canvas.height;
    this.cx = this.width / 2;
    this.cy = this.height / 2;
    this.radius = 180;

    // Goal Configuration (Left side of the ring at angle Math.PI)
    this.goalAngle = Math.PI; // 180 degrees (Left)
    this.goalArc = 0.55;      // Angular span (~31 degrees opening)
    this.goalDepth = 42;      // Visual goal depth outside the circle
    this.postRadius = 6;

    // Simulation entities
    this.pucks = [];
    this.particles = [];
    this.shockwaves = [];
    this.goalFlashes = [];

    // Screen Shake
    this.shakeDuration = 0;
    this.shakeIntensity = 0;

    // Wall Flash Segments
    this.wallImpacts = [];

    // Preloaded Logo Images Cache
    this.imageCache = new Map();

    // Callbacks
    this.onGoal = null;
    this.onElimination = null;

    // Configuration
    this.gameSpeed = 2.0;
    this.paused = false;
    this.eliminationMode = false; // Mode 2: Battle Royale
    this.chaosMode = false;       // Mode 3: Chaos Mode

    this.resize();
  }

  resize() {
    const rect = this.canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    const displayWidth = rect.width > 0 ? rect.width : (this.canvas.parentElement?.clientWidth || 380);
    const displayHeight = rect.height > 0 ? rect.height : (this.canvas.parentElement?.clientHeight || 460);

    // Internal buffer matches display pixels * DPR for razor sharpness
    this.canvas.width = displayWidth * dpr;
    this.canvas.height = displayHeight * dpr;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    this.dpr = dpr;

    // Shift center slightly to the right to leave comfortable room for the left goal net
    this.cx = this.width * 0.525;
    this.cy = this.height * 0.50;

    // Radius expands to fill available width and height generously
    // Goal net depth on the left
    this.goalDepth = Math.max(26 * dpr, Math.min(38 * dpr, this.width * 0.09));
    
    // Maximize circle radius so it looks grand on all mobile and desktop screens
    const availableW = (this.width - this.goalDepth - 16 * dpr) * 0.51;
    const availableH = (this.height - 16 * dpr) * 0.50;
    this.radius = Math.max(130 * dpr, Math.min(availableW, availableH));

    // Recalculate existing puck sizes if already present
    this.recalculatePuckSizes();
  }

  recalculatePuckSizes() {
    if (!this.pucks || this.pucks.length === 0) return;
    const count = this.pucks.length;
    let puckRadius;
    if (count === 2) {
      // 1v1 match: sleek compact disc with lots of room to glide
      puckRadius = Math.round(this.radius * 0.115);
      puckRadius = Math.max(14 * this.dpr, Math.min(puckRadius, 20 * this.dpr));
    } else if (count <= 8) {
      puckRadius = Math.round(this.radius * 0.085);
      puckRadius = Math.max(11 * this.dpr, Math.min(puckRadius, 15 * this.dpr));
    } else if (count <= 18) {
      // 18 teams (Süper Lig / Ligue 1)
      puckRadius = Math.round(this.radius * 0.056);
      puckRadius = Math.max(8 * this.dpr, Math.min(puckRadius, 12 * this.dpr));
    } else {
      // 20-32 teams (Premier Lig / UCL)
      puckRadius = Math.round(this.radius * 0.046);
      puckRadius = Math.max(7 * this.dpr, Math.min(puckRadius, 10 * this.dpr));
    }

    this.pucks.forEach(p => {
      p.radius = puckRadius;
    });
  }

  preloadTeamLogo(team) {
    if (!team) return;
    const url = team.badgeUrl || team.docxLogoUrl;
    if (url && !this.imageCache.has(team.id)) {
      const img = new Image();
      img.src = url;
      img.onload = () => this.imageCache.set(team.id, img);
      img.onerror = () => {
        // Fallback: mark as null so vector badge draws
        this.imageCache.set(team.id, null);
      };
    }
  }

  setPucks(puckDataList, isElimination = false) {
    this.eliminationMode = isElimination;
    this.pucks = [];
    this.particles = [];
    this.shockwaves = [];

    const count = puckDataList.length;
    // Scale puck radius based on circle radius and number of participants
    // Reduced sizes so arena feels expansive and agile
    let puckRadius;
    if (count === 2) {
      puckRadius = Math.round(this.radius * 0.115);
      puckRadius = Math.max(14 * this.dpr, Math.min(puckRadius, 20 * this.dpr));
    } else if (count <= 8) {
      puckRadius = Math.round(this.radius * 0.085);
      puckRadius = Math.max(11 * this.dpr, Math.min(puckRadius, 15 * this.dpr));
    } else if (count <= 18) {
      puckRadius = Math.round(this.radius * 0.056);
      puckRadius = Math.max(8 * this.dpr, Math.min(puckRadius, 12 * this.dpr));
    } else {
      puckRadius = Math.round(this.radius * 0.046);
      puckRadius = Math.max(7 * this.dpr, Math.min(puckRadius, 10 * this.dpr));
    }

    const baseSpeed = 4.2 * this.dpr;

    puckDataList.forEach((data, index) => {
      this.preloadTeamLogo(data.team);

      // Spawn in circular formation or balanced positions
      let x, y, vx, vy;
      if (count === 2) {
        // 1v1 match: Team A top-center, Team B bottom-center
        const offset = this.radius * 0.38;
        if (index === 0) {
          x = this.cx;
          y = this.cy - offset;
          vx = (Math.random() * 2 - 1) * baseSpeed;
          vy = (1.4 + Math.random() * 0.6) * baseSpeed;
        } else {
          x = this.cx;
          y = this.cy + offset;
          vx = (Math.random() * 2 - 1) * baseSpeed;
          vy = -(1.4 + Math.random() * 0.6) * baseSpeed;
        }
      } else {
        // Multiple teams: distributed safely inside the inner ring
        const spawnRadius = (this.radius - puckRadius * 2.5) * Math.sqrt((index + 0.5) / count);
        const spawnAngle = (index / count) * Math.PI * 2 + Math.PI / 4;
        x = this.cx + Math.cos(spawnAngle) * spawnRadius;
        y = this.cy + Math.sin(spawnAngle) * spawnRadius;

        const launchAngle = Math.random() * Math.PI * 2;
        const spd = baseSpeed * (0.8 + Math.random() * 0.4);
        vx = Math.cos(launchAngle) * spd;
        vy = Math.sin(launchAngle) * spd;
      }

      this.pucks.push({
        id: data.team.id,
        team: data.team,
        side: data.side || (index === 0 ? 'home' : 'away'),
        x: x,
        y: y,
        vx: vx,
        vy: vy,
        radius: puckRadius,
        mass: 1.0,
        trail: [],
        maxTrail: count > 6 ? 10 : 22,
        active: true,
        eliminated: false,
        lastGoalCooldown: 0
      });
    });
  }

  resetKickoff(scoringSide) {
    if (this.pucks.length !== 2) return;
    const baseSpeed = 4.2 * this.dpr;
    const offset = this.radius * 0.38;

    this.pucks[0].x = this.cx;
    this.pucks[0].y = this.cy - offset;
    this.pucks[0].vx = (Math.random() - 0.5) * 2 * baseSpeed;
    this.pucks[0].vy = (1.3 + Math.random() * 0.6) * baseSpeed;
    this.pucks[0].trail = [];

    this.pucks[1].x = this.cx;
    this.pucks[1].y = this.cy + offset;
    this.pucks[1].vx = (Math.random() - 0.5) * 2 * baseSpeed;
    this.pucks[1].vy = -(1.3 + Math.random() * 0.6) * baseSpeed;
    this.pucks[1].trail = [];
  }

  // Sub-stepping physics update
  // Balls move at natural, smooth, constant physical speed. (Time multiplier applies to match clock only!)
  update(dt, freezePucks = false) {
    if (this.paused) return;

    // Normal physical dt (NOT multiplied by 2x/4x/8x!)
    const effectiveDt = Math.min(dt, 0.035);

    if (!freezePucks) {
      const substeps = 4;
      const stepDt = effectiveDt / substeps;

      for (let step = 0; step < substeps; step++) {
        this.physicsSubstep(stepDt);
      }
    }

    // Always update particles & visual effects so celebrations are fluid
    // Always update particles & visual effects so celebrations are fluid
    this.updateParticles(effectiveDt);

    // Screen Shake decay
    if (this.shakeDuration > 0) {
      this.shakeDuration -= effectiveDt;
    }
  }

  physicsSubstep(dt) {
    const goalStartAngle = this.goalAngle - this.goalArc / 2;
    const goalEndAngle = this.goalAngle + this.goalArc / 2;

    // Post positions (edges of the goal mouth)
    const post1X = this.cx + Math.cos(goalStartAngle) * this.radius;
    const post1Y = this.cy + Math.sin(goalStartAngle) * this.radius;
    const post2X = this.cx + Math.cos(goalEndAngle) * this.radius;
    const post2Y = this.cy + Math.sin(goalEndAngle) * this.radius;

    const activePucks = this.pucks.filter(p => p.active && !p.eliminated);

    // 1. Move Pucks & Wall Collision
    activePucks.forEach(p => {
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;

      // Keep speed energetic (normalize if it gets too slow or too fast)
      const currentSpeed = Math.hypot(p.vx, p.vy);
      const targetSpeed = (this.pucks.length > 8 ? 4.0 : 5.2) * this.dpr;
      if (currentSpeed < targetSpeed * 0.75) {
        p.vx *= 1.05;
        p.vy *= 1.05;
      } else if (currentSpeed > targetSpeed * 2.2) {
        p.vx *= 0.96;
        p.vy *= 0.96;
      }

      // Check distance from center
      const dx = p.x - this.cx;
      const dy = p.y - this.cy;
      const dist = Math.hypot(dx, dy);

      // Current angle from center
      let angle = Math.atan2(dy, dx);
      // Normalize angle to [0, 2*PI]
      if (angle < 0) angle += Math.PI * 2;

      // Goal Opening Angle Check
      const inGoalMouth = (angle >= goalStartAngle - 0.05 && angle <= goalEndAngle + 0.05) ||
                          (Math.abs(angle - Math.PI) < this.goalArc * 0.65);

      // Check Posts Collision
      this.checkPostCollision(p, post1X, post1Y);
      this.checkPostCollision(p, post2X, post2Y);

      // Wall / Goal Collision
      if (dist + p.radius >= this.radius) {
        if (inGoalMouth && p.x < this.cx) {
          // Puck is entering the goal!
          const goalBackX = this.cx - this.radius - this.goalDepth;

          // Check if crossed goal line
          if (p.x < this.cx - this.radius + p.radius * 0.2) {
            this.handleGoalTrigger(p);
          }

          // Back net bounce
          if (p.x - p.radius <= goalBackX) {
            p.x = goalBackX + p.radius;
            p.vx = Math.abs(p.vx) * 0.9;
            this.spawnWallSparks(p.x, p.y, p.team.neon);
          }
          // Top & bottom goal net boundaries
          const goalTopY = post1Y - 10;
          const goalBottomY = post2Y + 10;
          if (p.y - p.radius < Math.min(goalTopY, goalBottomY)) {
            p.y = Math.min(goalTopY, goalBottomY) + p.radius;
            p.vy = Math.abs(p.vy);
          } else if (p.y + p.radius > Math.max(goalTopY, goalBottomY)) {
            p.y = Math.max(goalTopY, goalBottomY) - p.radius;
            p.vy = -Math.abs(p.vy);
          }
        } else {
          // Normal Wall Bounce
          const nx = dx / dist;
          const ny = dy / dist;

          // Push back to perimeter
          p.x = this.cx + nx * (this.radius - p.radius);
          p.y = this.cy + ny * (this.radius - p.radius);

          // Dot product
          const dot = p.vx * nx + p.vy * ny;
          if (dot > 0) {
            p.vx -= 2 * dot * nx;
            p.vy -= 2 * dot * ny;

            // Restitution bounce boost
            p.vx *= 1.01;
            p.vy *= 1.01;

            // Effects
            this.spawnWallSparks(p.x + nx * p.radius, p.y + ny * p.radius, p.team.neon);
            this.wallImpacts.push({
              angle: Math.atan2(ny, nx),
              color: p.team.neon,
              life: 1.0
            });
            soundEngine.playBounce(Math.min(1.5, Math.hypot(p.vx, p.vy) / 4));
          }
        }
      }

      // Record positions for neon trail
      p.trail.unshift({ x: p.x, y: p.y });
      if (p.trail.length > p.maxTrail) {
        p.trail.pop();
      }
    });

    // 2. Puck-to-Puck Elastic Collision
    for (let i = 0; i < activePucks.length; i++) {
      for (let j = i + 1; j < activePucks.length; j++) {
        this.resolvePuckCollision(activePucks[i], activePucks[j]);
      }
    }
  }

  checkPostCollision(p, postX, postY) {
    const dx = p.x - postX;
    const dy = p.y - postY;
    const dist = Math.hypot(dx, dy);
    const minDist = p.radius + this.postRadius;

    if (dist < minDist && dist > 0) {
      const nx = dx / dist;
      const ny = dy / dist;
      p.x = postX + nx * minDist;
      p.y = postY + ny * minDist;

      const dot = p.vx * nx + p.vy * ny;
      if (dot < 0) {
        p.vx -= 1.95 * dot * nx;
        p.vy -= 1.95 * dot * ny;
        soundEngine.playPostHit();
        this.spawnWallSparks(postX, postY, '#ffffff');
      }
    }
  }

  resolvePuckCollision(p1, p2) {
    const dx = p2.x - p1.x;
    const dy = p2.y - p1.y;
    const dist = Math.hypot(dx, dy);
    const minDist = p1.radius + p2.radius;

    if (dist < minDist && dist > 0) {
      // Normal vector
      const nx = dx / dist;
      const ny = dy / dist;

      // Separate to prevent overlapping
      const overlap = (minDist - dist) * 0.5;
      p1.x -= nx * overlap;
      p1.y -= ny * overlap;
      p2.x += nx * overlap;
      p2.y += ny * overlap;

      // Relative velocity
      const kx = p1.vx - p2.vx;
      const ky = p1.vy - p2.vy;
      const p = 2 * (nx * kx + ny * ky) / (p1.mass + p2.mass);

      // Elastic response
      p1.vx -= p * p2.mass * nx;
      p1.vy -= p * p2.mass * ny;
      p2.vx += p * p1.mass * nx;
      p2.vy += p * p1.mass * ny;

      // Sound & Sparks
      const clashSpeed = Math.hypot(kx, ky);
      if (clashSpeed > 1.5) {
        soundEngine.playPuckClash(clashSpeed / 5);
        this.spawnWallSparks((p1.x + p2.x) / 2, (p1.y + p2.y) / 2, '#fff');
      }
    }
  }

  handleGoalTrigger(puck) {
    const now = performance.now();
    if (puck.lastGoalCooldown && now - puck.lastGoalCooldown < 1200) {
      return;
    }
    puck.lastGoalCooldown = now;

    if (this.eliminationMode) {
      // Mode 2: Battle Royale -> Kaleye giren ELENİR!
      puck.eliminated = true;
      puck.active = false;
      this.triggerScreenShake(0.35, 12);
      this.spawnEliminationExplosion(puck.x, puck.y, puck.team.neon);
      soundEngine.playElimination();

      if (this.onElimination) {
        this.onElimination(puck.team, this.pucks.filter(p => !p.eliminated).length);
      }
    } else {
      // Mode 1: Kick Off -> GOOOOOL!
      this.triggerScreenShake(0.5, 18);
      this.spawnGoalExplosion(this.cx - this.radius, this.cy, puck.team.neon);
      soundEngine.playGoal();

      if (this.onGoal) {
        this.onGoal(puck);
      }
    }
  }

  triggerScreenShake(duration, intensity) {
    this.shakeDuration = duration;
    this.shakeIntensity = intensity * this.dpr;
  }

  spawnWallSparks(x, y, color) {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (2 + Math.random() * 4) * this.dpr;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color || '#ffea00',
        size: (2 + Math.random() * 3) * this.dpr,
        life: 1.0,
        decay: 0.05 + Math.random() * 0.04
      });
    }
  }

  spawnGoalExplosion(x, y, color) {
    const count = 48;
    for (let i = 0; i < count; i++) {
      const angle = (Math.random() - 0.5) * Math.PI * 1.5; // spray inwards
      const speed = (3 + Math.random() * 8) * this.dpr;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: Math.random() > 0.4 ? color : '#ffffff',
        size: (3 + Math.random() * 5) * this.dpr,
        life: 1.0,
        decay: 0.02 + Math.random() * 0.02
      });
    }

    this.shockwaves.push({
      x: x,
      y: y,
      radius: 10,
      maxRadius: this.radius * 0.9,
      color: color,
      life: 1.0
    });
  }

  spawnEliminationExplosion(x, y, color) {
    const count = 36;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = (4 + Math.random() * 7) * this.dpr;
      this.particles.push({
        x: x,
        y: y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        color: color,
        size: (4 + Math.random() * 4) * this.dpr,
        life: 1.0,
        decay: 0.025 + Math.random() * 0.03
      });
    }
    this.shockwaves.push({
      x: x,
      y: y,
      radius: 8,
      maxRadius: 100 * this.dpr,
      color: '#ff0033',
      life: 1.0
    });
  }

  updateParticles(dt) {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx * dt * 60;
      p.y += p.vy * dt * 60;
      p.vx *= 0.95;
      p.vy *= 0.95;
      p.life -= p.decay * dt * 60;
      if (p.life <= 0) {
        this.particles.splice(i, 1);
      }
    }

    for (let i = this.shockwaves.length - 1; i >= 0; i--) {
      const sw = this.shockwaves[i];
      sw.radius += (sw.maxRadius - sw.radius) * 0.12 * dt * 60;
      sw.life -= 0.035 * dt * 60;
      if (sw.life <= 0) {
        this.shockwaves.splice(i, 1);
      }
    }

    for (let i = this.wallImpacts.length - 1; i >= 0; i--) {
      const wi = this.wallImpacts[i];
      wi.life -= 0.06 * dt * 60;
      if (wi.life <= 0) {
        this.wallImpacts.splice(i, 1);
      }
    }
  }

  // Master Render Loop
  render() {
    const ctx = this.ctx;
    ctx.save();

    // Clear background
    ctx.clearRect(0, 0, this.width, this.height);

    // Apply Screen Shake if active
    if (this.shakeDuration > 0) {
      const ox = (Math.random() - 0.5) * this.shakeIntensity;
      const oy = (Math.random() - 0.5) * this.shakeIntensity;
      ctx.translate(ox, oy);
    }

    // 1. Draw Field Background & Pitch Markings
    this.drawPitchMarkings(ctx);

    // 2. Draw Goal Net (Behind wall)
    this.drawGoalNet(ctx);

    // 3. Draw Neon Ring Perimeter
    this.drawNeonPerimeter(ctx);

    // 4. Draw Laser Trails
    this.drawLaserTrails(ctx);

    // 5. Draw Shockwaves
    this.drawShockwaves(ctx);

    // 6. Draw Particles
    this.drawParticles(ctx);

    // 7. Draw Team Pucks
    this.drawPucks(ctx);

    // 8. Draw Goal Posts (In front)
    this.drawGoalPosts(ctx);

    ctx.restore();
  }

  drawPitchMarkings(ctx) {
    // Subtle dark circular turf backdrop
    const grad = ctx.createRadialGradient(this.cx, this.cy, 20, this.cx, this.cy, this.radius);
    grad.addColorStop(0, '#0a1024');
    grad.addColorStop(0.7, '#060a16');
    grad.addColorStop(1, '#03060d');

    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Center Line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 2 * this.dpr;
    ctx.beginPath();
    ctx.moveTo(this.cx, this.cy - this.radius);
    ctx.lineTo(this.cx, this.cy + this.radius);
    ctx.stroke();

    // Center Circle
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius * 0.28, 0, Math.PI * 2);
    ctx.stroke();

    // Center Spot
    ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, 3 * this.dpr, 0, Math.PI * 2);
    ctx.fill();
  }

  drawGoalNet(ctx) {
    const goalStartAngle = this.goalAngle - this.goalArc / 2;
    const goalEndAngle = this.goalAngle + this.goalArc / 2;

    const p1x = this.cx + Math.cos(goalStartAngle) * this.radius;
    const p1y = this.cy + Math.sin(goalStartAngle) * this.radius;
    const p2x = this.cx + Math.cos(goalEndAngle) * this.radius;
    const p2y = this.cy + Math.sin(goalEndAngle) * this.radius;

    const backX = this.cx - this.radius - this.goalDepth;
    const backP1Y = p1y - 6 * this.dpr;
    const backP2Y = p2y + 6 * this.dpr;

    // Glowing Goal Net Box
    ctx.save();
    ctx.fillStyle = 'rgba(0, 240, 255, 0.03)';
    ctx.beginPath();
    ctx.moveTo(p1x, p1y);
    ctx.lineTo(backX, backP1Y);
    ctx.lineTo(backX, backP2Y);
    ctx.lineTo(p2x, p2y);
    ctx.closePath();
    ctx.fill();

    // Net Grid Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
    ctx.lineWidth = 1.2 * this.dpr;
    ctx.shadowColor = '#00f0ff';
    ctx.shadowBlur = 4;

    // Horizontal net lines
    const hSteps = 6;
    for (let i = 0; i <= hSteps; i++) {
      const t = i / hSteps;
      const yFront = p1y + (p2y - p1y) * t;
      const yBack = backP1Y + (backP2Y - backP1Y) * t;
      ctx.beginPath();
      ctx.moveTo(p1x, yFront);
      ctx.lineTo(backX, yBack);
      ctx.stroke();
    }

    // Vertical net lines
    const vSteps = 6;
    for (let i = 0; i <= vSteps; i++) {
      const t = i / vSteps;
      const x = p1x + (backX - p1x) * t;
      const yTop = p1y + (backP1Y - p1y) * t;
      const yBottom = p2y + (backP2Y - p2y) * t;
      ctx.beginPath();
      ctx.moveTo(x, yTop);
      ctx.lineTo(x, yBottom);
      ctx.stroke();
    }

    ctx.restore();
  }

  drawNeonPerimeter(ctx) {
    ctx.save();
    const goalStartAngle = this.goalAngle - this.goalArc / 2;
    const goalEndAngle = this.goalAngle + this.goalArc / 2;

    // Outer glow blur pass
    ctx.shadowColor = '#ffeaa7';
    ctx.shadowBlur = 14 * this.dpr;
    ctx.strokeStyle = '#fffbf0';
    ctx.lineWidth = 5 * this.dpr;
    ctx.lineCap = 'round';

    // Dashed glowing segments (matching the reference photo)
    ctx.setLineDash([14 * this.dpr, 7 * this.dpr]);

    ctx.beginPath();
    // Arc from goalEndAngle to goalStartAngle (leaving goal mouth open!)
    ctx.arc(this.cx, this.cy, this.radius, goalEndAngle, goalStartAngle + Math.PI * 2);
    ctx.stroke();

    // Second intense white inner core pass
    ctx.setLineDash([]);
    ctx.shadowBlur = 4 * this.dpr;
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2.5 * this.dpr;
    ctx.beginPath();
    ctx.arc(this.cx, this.cy, this.radius, goalEndAngle, goalStartAngle + Math.PI * 2);
    ctx.stroke();

    // Draw active impact flashes on the rim
    this.wallImpacts.forEach(impact => {
      ctx.save();
      ctx.shadowColor = impact.color;
      ctx.shadowBlur = 25 * this.dpr * impact.life;
      ctx.strokeStyle = impact.color;
      ctx.lineWidth = 7 * this.dpr * impact.life;
      ctx.beginPath();
      ctx.arc(this.cx, this.cy, this.radius, impact.angle - 0.2, impact.angle + 0.2);
      ctx.stroke();
      ctx.restore();
    });

    ctx.restore();
  }

  drawLaserTrails(ctx) {
    ctx.save();
    this.pucks.forEach(p => {
      if (!p.active || p.eliminated || p.trail.length < 2) return;

      const neonColor = p.team.neon || '#00f0ff';
      const len = p.trail.length;

      // Draw tapered fading trail
      for (let i = 0; i < len - 1; i++) {
        const pt1 = p.trail[i];
        const pt2 = p.trail[i + 1];
        const alpha = (1 - i / len) * 0.75;
        const width = p.radius * (1 - i / len) * 0.65;

        ctx.strokeStyle = neonColor;
        ctx.globalAlpha = alpha;
        ctx.lineWidth = width;
        ctx.lineCap = 'round';
        ctx.shadowColor = neonColor;
        ctx.shadowBlur = 10 * this.dpr;

        ctx.beginPath();
        ctx.moveTo(pt1.x, pt1.y);
        ctx.lineTo(pt2.x, pt2.y);
        ctx.stroke();
      }
    });
    ctx.restore();
  }

  drawPucks(ctx) {
    this.pucks.forEach(p => {
      if (!p.active || p.eliminated) return;

      ctx.save();
      const neonColor = p.team.neon || '#ffffff';

      // 1. Outer Neon Aura Glow
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 16 * this.dpr;

      // 2. Base Disc
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fill();

      // 3. Draw Team Logo / Emblem
      const img = this.imageCache.get(p.team.id);
      ctx.save();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius - 2 * this.dpr, 0, Math.PI * 2);
      ctx.clip();

      if (img && img.complete && img.naturalWidth > 0) {
        ctx.drawImage(img, p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
      } else {
        // Fallback Vector Rendering if image hasn't loaded yet
        ctx.fillStyle = p.team.c1 || '#ffffff';
        ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
        ctx.fillStyle = p.team.c2 || '#000000';
        ctx.fillRect(p.x, p.y - p.radius, p.radius, p.radius * 2);

        // Center badge circle
        ctx.fillStyle = '#0b0f19';
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius * 0.6, 0, Math.PI * 2);
        ctx.fill();

        // Team Short Text
        ctx.fillStyle = neonColor;
        ctx.font = `900 ${Math.max(10, p.radius * 0.45)}px system-ui, sans-serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(p.team.short || 'FC', p.x, p.y + 1);
      }
      ctx.restore();

      // 4. Specular gloss highlight on the edge
      ctx.shadowBlur = 0;
      const grad = ctx.createLinearGradient(p.x - p.radius, p.y - p.radius, p.x + p.radius, p.y + p.radius);
      grad.addColorStop(0, 'rgba(255, 255, 255, 0.45)');
      grad.addColorStop(0.5, 'rgba(255, 255, 255, 0)');
      grad.addColorStop(1, 'rgba(0, 0, 0, 0.4)');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius - 2 * this.dpr, 0, Math.PI * 2);
      ctx.fill();

      // 5. Outer Bright Neon Rim
      ctx.strokeStyle = neonColor;
      ctx.lineWidth = 3 * this.dpr;
      ctx.shadowColor = neonColor;
      ctx.shadowBlur = 12 * this.dpr;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius - 1.5 * this.dpr, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
    });
  }

  drawGoalPosts(ctx) {
    const goalStartAngle = this.goalAngle - this.goalArc / 2;
    const goalEndAngle = this.goalAngle + this.goalArc / 2;

    const p1x = this.cx + Math.cos(goalStartAngle) * this.radius;
    const p1y = this.cy + Math.sin(goalStartAngle) * this.radius;
    const p2x = this.cx + Math.cos(goalEndAngle) * this.radius;
    const p2y = this.cy + Math.sin(goalEndAngle) * this.radius;

    [ { x: p1x, y: p1y }, { x: p2x, y: p2y } ].forEach(post => {
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.shadowColor = '#00f0ff';
      ctx.shadowBlur = 8 * this.dpr;
      ctx.beginPath();
      ctx.arc(post.x, post.y, this.postRadius * this.dpr, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });
  }

  drawParticles(ctx) {
    ctx.save();
    this.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.shadowColor = p.color;
      ctx.shadowBlur = 6 * this.dpr;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }

  drawShockwaves(ctx) {
    ctx.save();
    this.shockwaves.forEach(sw => {
      ctx.strokeStyle = sw.color;
      ctx.globalAlpha = sw.life * 0.8;
      ctx.lineWidth = 4 * this.dpr * sw.life;
      ctx.shadowColor = sw.color;
      ctx.shadowBlur = 15 * this.dpr;
      ctx.beginPath();
      ctx.arc(sw.x, sw.y, sw.radius, 0, Math.PI * 2);
      ctx.stroke();
    });
    ctx.restore();
  }
}
