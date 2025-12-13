import { Component, input, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Actor } from '../../services/movie.service';

@Component({
  selector: 'app-actor-large',
  templateUrl: './actor-large.component.html',
  styleUrls: ['./actor-large.component.scss'],
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActorLargeComponent {
  actor = input<Actor | null>(null);
  movieCount = input(0);
  imageLoadFailed = signal(false);

  onImageError(): void {
    this.imageLoadFailed.set(true);
  }

  getInitials(): string {
    const actor = this.actor();
    if (!actor) return '';
    return actor.name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
