import { Component, OnInit } from '@angular/core';
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
    IonImg,
    IonBadge,
    IonIcon,
    IonBackButton,
    IonButtons,
    IonCardHeader,
    IonCardTitle,
    IonCardSubtitle,
  ],
})
export class MovieDetailsPage implements OnInit {
  movie: Movie | null = null;
  openOutline = openOutline;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private movieService: MovieService
  ) {
    addIcons({ openOutline });
  }

  ngOnInit(): void {
    // Try to get movie from service first
    this.movieService.getSelectedMovie().subscribe((movie) => {
      if (movie) {
        this.movie = movie;
        return;
      }

      // Fallback: try to get from navigation state
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state?.['movie']) {
        this.movie = navigation.extras.state['movie'];
      }
    });
  }

  openMovieLink(): void {
    if (this.movie?.link) {
      window.open(this.movie.link, '_blank');
    }
  }
}


