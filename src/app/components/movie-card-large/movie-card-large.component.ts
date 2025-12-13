import { Component, input, output, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonIcon,
  IonButton,
  IonBadge,
  IonSkeletonText,
} from '@ionic/angular/standalone';
import { Movie } from '../../services/movie.service';
import { CelebrationService } from '../../services/celebration.service';
import { star, playCircle, openOutline, starOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { ActorCardComponent } from '../actor-card/actor-card.component';

@Component({
  selector: 'app-movie-card-large',
  templateUrl: './movie-card-large.component.html',
  styleUrls: ['./movie-card-large.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonIcon,
    IonButton,
    IonBadge,
    IonSkeletonText,
    ActorCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCardLargeComponent {
  movie = input<Movie | null>(null);
  showTrailerButton = input(false);
  isCompact = input(false);
  reducePadding = input(false);
  limitActors = input<number | null>(null);
  isFavorited = input(false);

  isFavoritedLocal = signal(false);
  imageLoaded = signal(false);
  imageError = signal(false);

  actorClick = output<number>();
  trailerClick = output<void>();
  imdbClick = output<void>();
  favoriteClick = output<void>();

  star = star;
  starOutline = starOutline;
  playCircle = playCircle;
  openOutline = openOutline;

  constructor(private celebrationService: CelebrationService) {
    addIcons({ star, starOutline, playCircle, openOutline });
    effect(() => {
      this.isFavoritedLocal.set(this.isFavorited());
    });
  }

  onFavoriteClick(): void {
    const wasAlreadyFavorited = this.isFavoritedLocal();
    this.isFavoritedLocal.set(!wasAlreadyFavorited);
    this.favoriteClick.emit();
    if (!wasAlreadyFavorited) {
      this.celebrationService.celebrate();
    }
  }

  onImageLoad(): void {
    this.imageLoaded.set(true);
  }

  onImageError(): void {
    this.imageError.set(true);
  }

  getDisplayedActors(): string[] {
    const movie = this.movie();
    if (!movie?.actors) return [];
    const limit = this.limitActors();
    return limit ? movie.actors.slice(0, limit) : movie.actors;
  }

  getDisplayedActorIds(): number[] {
    const movie = this.movie();
    if (!movie?.actorIds) return [];
    const limit = this.limitActors();
    return limit ? movie.actorIds.slice(0, limit) : movie.actorIds;
  }

  getDisplayedActorImages(): string[] {
    const movie = this.movie();
    if (!movie?.actorImages) return [];
    const limit = this.limitActors();
    return limit ? movie.actorImages.slice(0, limit) : movie.actorImages;
  }}