import { Component, input, output, ChangeDetectionStrategy, signal } from '@angular/core';


@Component({
  selector: 'app-actor-card',
  templateUrl: './actor-card.component.html',
  styleUrls: ['./actor-card.component.scss'],
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ActorCardComponent {
  name = input<string>('');
  image = input<string | null>(null);
  whiteText = input(false);
  
  imageLoadFailed = signal(false);
  
  actorClick = output<void>();

  onImageError(): void {
    this.imageLoadFailed.set(true);
  }

  getInitials(): string {
    const name = this.name();
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }
}
