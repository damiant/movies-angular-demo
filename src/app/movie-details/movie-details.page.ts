import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
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
import { openOutline, playCircle, closeOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { MovieFooterComponent } from '../movie-footer/movie-footer.component';
import { SafePipe } from '../pipes/safe.pipe';

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
    MovieFooterComponent,
    SafePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailsPage {
  movie = this.movieService.getSelectedMovie();
  showTrailerModal = signal(false);
  openOutline = openOutline;
  playCircle = playCircle;
  closeOutline = closeOutline;

  constructor(private movieService: MovieService, private router: Router) {
    addIcons({ openOutline, playCircle, closeOutline });
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
    if (!actorId) {
      return;
    }
    this.router.navigate(['/actor', actorId]);
  }
}


