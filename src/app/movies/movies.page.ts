import { Component, signal, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
  IonButton,
  IonImg,
  IonBadge,
  IonLabel,
  IonSpinner,
  IonIcon,
  IonMenuButton,
  IonButtons,
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { star } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { MovieFooterComponent } from '../movie-footer/movie-footer.component';

@Component({
  selector: 'app-movies',
  templateUrl: './movies.page.html',
  styleUrls: ['./movies.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonContent,
    IonHeader,
    IonTitle,
    IonToolbar,
    IonCard,
    IonCardContent,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
    IonButton,
    IonImg,
    IonBadge,
    IonLabel,
    IonSpinner,
    IonIcon,
    IonMenuButton,
    IonButtons,
    MovieFooterComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MoviesPage {
  currentMovie = this.movieService.currentMovie;
  isLoading = signal(false);
  star = star;

  constructor(private movieService: MovieService, private router: Router) {
    addIcons({ star });
    this.isLoading.set(true);
    setTimeout(() => this.isLoading.set(false), 500);
  }

  openMovieLink(): void {
    const movie = this.currentMovie();
    if (movie?.link) {
      window.open(movie.link, '_blank');
    }
  }

  onReset(): void {
    this.movieService.resetMovies();
  }

  goToActorMovies(actorId: number): void {
    this.router.navigate(['/actor', actorId]);
  }
}
