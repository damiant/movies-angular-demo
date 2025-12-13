import { Component, input, output, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonIcon,
  IonButton,
  IonBadge,
} from '@ionic/angular/standalone';
import { Movie } from '../../services/movie.service';
import { star, playCircle, openOutline } from 'ionicons/icons';
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
    ActorCardComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieCardLargeComponent {
  movie = input<Movie | null>(null);
  showTrailerButton = input(false);
  isCompact = input(false);
  reducePadding = input(false);

  actorClick = output<number>();
  trailerClick = output<void>();
  imdbClick = output<void>();

  star = star;
  playCircle = playCircle;
  openOutline = openOutline;

  constructor() {
    addIcons({ star, playCircle, openOutline });
  }
}
