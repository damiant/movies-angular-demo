import { Component, ChangeDetectionStrategy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonImg,
  IonBadge,
  IonIcon,
  IonBackButton,
  IonButtons,
  IonCardHeader,
  IonCardTitle,
  IonCardSubtitle,
} from '@ionic/angular/standalone';
import { Movie, MovieService } from '../services/movie.service';
import { openOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

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
    IonIcon,
    IonBackButton,
    IonButtons,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieDetailsPage {
  movie = this.movieService.getSelectedMovie();
  openOutline = openOutline;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService
  ) {
    addIcons({ openOutline });
  }

  openMovieLink(): void {
    const selectedMovie = this.movie();
    if (selectedMovie?.link) {
      window.open(selectedMovie.link, '_blank');
    }
  }
}


