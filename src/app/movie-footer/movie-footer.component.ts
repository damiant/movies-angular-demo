import { Component, input, signal, ChangeDetectionStrategy, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonFab,
  IonFabButton,
  IonFabList,
  IonIcon,
} from '@ionic/angular/standalone';
import { MovieService } from '../services/movie.service';
import { thumbsUpOutline, thumbsDownOutline, eyeOffOutline, bookmarkOutline, bookmarkSharp, filmOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';

@Component({
  selector: 'app-movie-footer',
  templateUrl: './movie-footer.component.html',
  styleUrls: ['./movie-footer.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonFab,
    IonFabButton,
    IonFabList,
    IonIcon,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MovieFooterComponent {
  movieId = input<number | null>(null);
  showFooter = input(true);

  thumbsUpOutline = thumbsUpOutline;
  thumbsDownOutline = thumbsDownOutline;
  eyeOffOutline = eyeOffOutline;
  bookmarkOutline = bookmarkOutline;
  bookmarkSharp = bookmarkSharp;
  filmOutline = filmOutline;
  activePulse = signal<string | null>(null);
  floatingTexts = signal<Array<{ id: number; text: string }>>([]);
  isSavedForLater = signal(false);
  private floatingTextId = 0;

  constructor(private movieService: MovieService) {
    addIcons({ thumbsUpOutline, thumbsDownOutline, eyeOffOutline, bookmarkOutline, bookmarkSharp, filmOutline });

    effect(() => {
      const id = this.movieId();
      if (id) {
        this.isSavedForLater.set(this.movieService.isSavedForLater(id));
      }
    });
  }

  onThumbsUp(): void {
    if (this.movieId()) {
      this.animateButton('thumbsUp', 'Thumbs Up');
      this.movieService.rateMovie(this.movieId()!, 'thumbsUp');
    }
  }

  onThumbsDown(): void {
    if (this.movieId()) {
      this.animateButton('thumbsDown', 'Thumbs Down');
      this.movieService.rateMovie(this.movieId()!, 'thumbsDown');
    }
  }

  onDidntSee(): void {
    if (this.movieId()) {
      this.animateButton('didntSee', "Haven't Seen");
      this.movieService.markAsDidntSee(this.movieId()!);
    }
  }

  onAddToList(): void {
    if (this.movieId()) {
      const isSaved = this.isSavedForLater();
      this.animateButton('addToList', isSaved ? 'Removed from Saved' : 'Saved for Later');
      this.movieService.toggleSaveForLater(this.movieId()!);
      this.isSavedForLater.set(!isSaved);
    }
  }

  private animateButton(buttonId: string, text: string): void {
    this.activePulse.set(buttonId);
    setTimeout(() => {
      this.activePulse.set(null);
    }, 600);

    const floatingId = this.floatingTextId++;
    const current = this.floatingTexts();
    this.floatingTexts.set([...current, { id: floatingId, text }]);
    setTimeout(() => {
      this.floatingTexts.set(this.floatingTexts().filter((t) => t.id !== floatingId));
    }, 1500);
  }
}
