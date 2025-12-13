import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class CelebrationService {
  celebrate(): void {
    this.playSound();
    this.showFireworks();
  }

  private playSound(): void {
    try {
      const audio = new Audio('assets/fav.mp3');
      audio.volume = 0.5;
      audio.play().catch(() => {
        // Silently fail if audio playback is not available
      });
    } catch (error) {
      // Silently fail if audio is not available
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
