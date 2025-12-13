import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CelebrationService {
  private audioContext: AudioContext | null = null;

  celebrate(): void {
    this.playDingSound();
    this.showFireworks();
  }

  private playDingSound(): void {
    try {
      if (!this.audioContext) {
        this.audioContext = new (window as any).AudioContext();
      }

      const ctx = this.audioContext;
      if (!ctx) return;

      const now = ctx.currentTime;

      // Create oscillator for ding sound
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.connect(gain);
      gain.connect(ctx.destination);

      // Ding sound: higher pitch that decays
      osc.frequency.setValueAtTime(1200, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.3);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.3);

      osc.start(now);
      osc.stop(now + 0.3);
    } catch (error) {
      // Silently fail if audio context is not available
    }
  }

  private showFireworks(): void {
    const container = document.body;

    for (let i = 0; i < 30; i++) {
      setTimeout(() => {
        this.createParticle(container);
      }, i * 20);
    }
  }

  private createParticle(container: HTMLElement): void {
    const particle = document.createElement('div');
    particle.style.position = 'fixed';
    particle.style.pointerEvents = 'none';
    particle.style.fontSize = '24px';
    particle.style.fontWeight = 'bold';
    particle.style.zIndex = '9999';

    // Random emoji fireworks
    const emojis = ['✨', '🎉', '⭐', '🌟', '💫'];
    particle.textContent = emojis[Math.floor(Math.random() * emojis.length)];

    // Random starting position (center of screen area)
    const startX = window.innerWidth / 2 + (Math.random() - 0.5) * 100;
    const startY = window.innerHeight / 2 + (Math.random() - 0.5) * 100;

    particle.style.left = startX + 'px';
    particle.style.top = startY + 'px';
    particle.style.opacity = '1';

    container.appendChild(particle);

    // Random direction and speed
    const angle = Math.random() * Math.PI * 2;
    const velocity = 3 + Math.random() * 4;
    let x = startX;
    let y = startY;
    let vx = Math.cos(angle) * velocity;
    let vy = Math.sin(angle) * velocity;
    let opacity = 1;

    const animate = () => {
      x += vx;
      y += vy;
      vy += 0.2; // Gravity
      opacity -= 0.03;

      particle.style.left = x + 'px';
      particle.style.top = y + 'px';
      particle.style.opacity = opacity.toString();

      if (opacity > 0) {
        requestAnimationFrame(animate);
      } else {
        particle.remove();
      }
    };

    animate();
  }
}
