import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
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
import { Movie } from '../services/movie.service';
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

  constructor(private router: Router) {
    addIcons({ openOutline });
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state?.['movie']) {
      this.movie = navigation.extras.state['movie'];
    }
  }

  ngOnInit(): void {}

  goBack(): void {
    this.router.navigate(['/actor-movies'], {
      relativeTo: null,
    });
  }

  openMovieLink(): void {
    if (this.movie?.link) {
      window.open(this.movie.link, '_blank');
    }
  }
}

