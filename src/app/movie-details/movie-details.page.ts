import { Component, ChangeDetectionStrategy, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonBadge,
  IonBackButton,
  IonButtons,
  IonIcon,
  IonModal,
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { CelebrationService } from '../services/celebration.service';
import { openOutline, playCircle, closeOutline, star, starOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { SafePipe } from '../pipes/safe.pipe';
import { ActorCardComponent } from '../components/actor-card/actor-card.component';
import { PageSpacingComponent } from '../components/page-spacing/page-spacing.component';

@Component({
  selector: 'app-movie-details',
  templateUrl: './movie-details.page.html',
  styleUrls: ['./movie-details.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonButton,
    IonBadge,
    IonBackButton,
    IonButtons,
    IonIcon,
    IonModal,
    SafePipe,
    ActorCardComponent,
    PageSpacingComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailsPage {
  movie = this.movieService.getSelectedMovie();
  showTrailerModal = signal(false);
  isSavedForLater = signal(false);
  isFromFavorites = signal(false);
  openOutline = openOutline;
  playCircle = playCircle;
  closeOutline = closeOutline;
  star = star;
  starOutline = starOutline;

  constructor(private movieService: MovieService, private router: Router, private celebrationService: CelebrationService) {
    addIcons({ openOutline, playCircle, closeOutline, star, starOutline });
    
    // Check if navigating from favorites page
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['fromFavorites']) {
      this.isFromFavorites.set(true);
    }
    
    effect(() => {
      const movieId = this.movie()?.id;
      if (movieId) {
        this.isSavedForLater.set(this.movieService.isSavedForLater(movieId));
      }
    });
  }

  openMovieLink(): void {
    const selectedMovie = this.movie();
    if (selectedMovie?.link) {
      window.open(selectedMovie.link, '_blank');
    }
  }

  openTrailerModal(): void {
    this.showTrailerModal.set(true);
  }

  closeTrailerModal(): void {
    this.showTrailerModal.set(false);
  }

  goToActorMovies(actorId: number): void {
    if (!actorId || this.isFromFavorites()) {
      return;
    }
    this.router.navigate(['/actor', actorId]);
  }

  toggleFavorite(): void {
    const movieId = this.movie()?.id;
    if (movieId) {
      const wasAlreadySaved = this.isSavedForLater();
      this.movieService.toggleSaveForLater(movieId);
      const isNowSaved = !wasAlreadySaved;
      this.isSavedForLater.set(isNowSaved);
      if (isNowSaved) {
        this.celebrationService.celebrate();
      }
    }
  }
}


