import { Injectable, signal, computed } from '@angular/core';

export interface Movie {
  id: number;
  title: string;
  image: string;
  description: string;
  actors: string[];
  actorImages: string[];
  actorIds: number[];
  year: number;
  rating: number; // 0-10
  link: string;
  trailerUrl?: string;
}

export interface Actor {
  id: number;
  name: string;
  profileImage: string;
}

export interface UserMovieRating {
  movieId: number;
  rating: 'thumbsUp' | 'thumbsDown' | 'didntSee' | null;
  addedToList: boolean;
}

interface TMDbMovie {
  id: number;
  title: string;
  poster_path: string;
  overview: string;
  release_date: string;
  vote_average: number;
}

interface TMDbCredits {
  cast: Array<{ id: number; name: string; profile_path: string | null }>;
}

interface TMDbVideoResult {
  results: Array<{
    id: string;
    key: string;
    name: string;
    type: string;
    official: boolean;
    iso_639_1?: string;
  }>;
}


@Injectable({
  providedIn: 'root',
})
export class MovieService {
  private readonly API_KEY = '47b9a9b5aea7b85e093e203b33d41878';
  private readonly BASE_URL = 'https://api.themoviedb.org/3';
  private readonly IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

  private movies = signal<Movie[]>([]);
  private currentMovieIndex = signal(0);
  private userRatings = signal<Map<number, UserMovieRating>>(new Map());
  private isLoaded = signal(false);
  private userMoviesList = signal<Movie[]>([]);

  currentMovie = computed(() => {
    const movies = this.movies();
    const index = this.currentMovieIndex();
    return index < movies.length ? movies[index] : null;
  });

  constructor() {
    this.loadMovies();
  }

  private async loadMovies(): Promise<void> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/movie/popular?api_key=${this.API_KEY}&language=en-US&page=1`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json() as { results: TMDbMovie[] };
      await this.processMovies(data.results);
    } catch (error) {
      this.movies.set([]);
      this.isLoaded.set(true);
    }
  }

  private async processMovies(tmdbMovies: TMDbMovie[]): Promise<void> {
    const moviePromises = tmdbMovies.slice(0, 20).map((tmdbMovie) =>
      this.enrichMovieWithCredits(tmdbMovie)
    );

    try {
      const enrichedMovies = await Promise.all(moviePromises);
      this.movies.set(enrichedMovies.filter((movie): movie is Movie => movie !== null));
      this.initializeRatings();
      this.isLoaded.set(true);
    } catch (error) {
      this.movies.set([]);
      this.isLoaded.set(true);
    }
  }

  private async enrichMovieWithCredits(tmdbMovie: TMDbMovie): Promise<Movie> {
    try {
      const [creditsResponse, videosResponse] = await Promise.all([
        fetch(
          `${this.BASE_URL}/movie/${tmdbMovie.id}/credits?api_key=${this.API_KEY}`
        ),
        fetch(
          `${this.BASE_URL}/movie/${tmdbMovie.id}/videos?api_key=${this.API_KEY}`
        ),
      ]);

      if (!creditsResponse.ok) throw new Error(`HTTP error! status: ${creditsResponse.status}`);
      const credits = await creditsResponse.json() as TMDbCredits;
      const cast = credits.cast;
      const actors = cast.map((actor) => actor.name);
      const actorIds = cast.map((actor) => actor.id);
      const actorImages = cast.map((actor) =>
        actor.profile_path
          ? `${this.IMAGE_BASE_URL}${actor.profile_path}`
          : 'https://via.placeholder.com/150x150?text=No+Image'
      );

      let trailerUrl: string | undefined;
      if (videosResponse.ok) {
        const videos = await videosResponse.json() as TMDbVideoResult;
        // First try to find official English trailer
        let trailer = videos.results.find(
          (v) => v.type === 'Trailer' && v.official && (v.iso_639_1 === 'en' || !v.iso_639_1)
        );
        // Then try any official trailer
        if (!trailer) {
          trailer = videos.results.find((v) => v.type === 'Trailer' && v.official);
        }
        // Then try any trailer or teaser
        if (!trailer) {
          trailer = videos.results.find((v) => v.type === 'Trailer' || v.type === 'Teaser');
        }
        if (trailer) {
          trailerUrl = `https://www.youtube.com/embed/${trailer.key}`;
        }
      }

      return this.createMovieFromTMDb(tmdbMovie, actors, actorImages, actorIds, trailerUrl);
    } catch (error) {
      return this.createMovieFromTMDb(tmdbMovie, [], [], []);
    }
  }

  private createMovieFromTMDb(tmdbMovie: TMDbMovie, actors: string[], actorImages: string[], actorIds: number[] = [], trailerUrl?: string): Movie {
    const year = new Date(tmdbMovie.release_date).getFullYear();
    return {
      id: tmdbMovie.id,
      title: tmdbMovie.title,
      image: tmdbMovie.poster_path
        ? `${this.IMAGE_BASE_URL}${tmdbMovie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Image',
      description: tmdbMovie.overview || 'No description available',
      actors: actors.length > 0 ? actors : ['Unknown'],
      actorImages: actorImages.length > 0 ? actorImages : [],
      actorIds: actorIds.length > 0 ? actorIds : [],
      year: year || new Date().getFullYear(),
      rating: tmdbMovie.vote_average,
      link: `https://www.themoviedb.org/movie/${tmdbMovie.id}`,
      trailerUrl,
    };
  }

  private initializeRatings(): void {
    const ratingsMap = new Map<number, UserMovieRating>();
    this.movies().forEach((movie) => {
      ratingsMap.set(movie.id, {
        movieId: movie.id,
        rating: null,
        addedToList: false,
      });
    });
    this.userRatings.set(ratingsMap);
  }

  rateMovie(movieId: number, rating: 'thumbsUp' | 'thumbsDown'): void {
    const ratingsMap = this.userRatings();
    const userRating = ratingsMap.get(movieId);
    if (userRating) {
      userRating.rating = rating;
    }
    this.nextMovie();
  }

  markAsDidntSee(movieId: number): void {
    const ratingsMap = this.userRatings();
    const userRating = ratingsMap.get(movieId);
    if (userRating) {
      userRating.rating = 'didntSee';
    }
    this.nextMovie();
  }

  addToList(movieId: number): void {
    const ratingsMap = this.userRatings();
    const userRating = ratingsMap.get(movieId);
    if (userRating) {
      userRating.addedToList = true;
      const movie = this.movies().find((m) => m.id === movieId);
      if (movie) {
        const currentList = this.userMoviesList();
        if (!currentList.find((m) => m.id === movieId)) {
          this.userMoviesList.set([...currentList, movie]);
        }
      }
    }
  }

  nextMovie(): void {
    const nextIndex = this.currentMovieIndex() + 1;
    this.currentMovieIndex.set(nextIndex);
  }

  resetMovies(): void {
    this.currentMovieIndex.set(0);
    this.userRatings.set(new Map());
    this.userMoviesList.set([]);
    this.initializeRatings();
  }

  getUserRatings(): Map<number, UserMovieRating> {
    return this.userRatings();
  }

  getUserMoviesList() {
    return this.userMoviesList;
  }

  async getActorMovies(actorId: number): Promise<Movie[]> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/person/${actorId}/movie_credits?api_key=${this.API_KEY}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json() as {
        cast: Array<{
          id: number;
          title: string;
          poster_path: string;
          overview: string;
          release_date: string;
          vote_average: number;
        }>;
      };
      

      const moviesWithPosters = data.cast
        .filter((movie) => movie.poster_path && movie.release_date)
        .sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
      
      const moviePromises = moviesWithPosters.map((tmdbMovie) =>
        this.enrichMovieWithCredits(tmdbMovie as TMDbMovie)
      );
      
      const enrichedMovies = await Promise.all(moviePromises);
      
      return enrichedMovies;
    } catch (error) {
      return [];
    }
  }

  async getActor(actorId: number): Promise<Actor | null> {
    try {
      const response = await fetch(
        `${this.BASE_URL}/person/${actorId}?api_key=${this.API_KEY}`
      );
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json() as { id: number; name: string; profile_path: string | null };
      return {
        id: data.id,
        name: data.name,
        profileImage: data.profile_path
          ? `${this.IMAGE_BASE_URL}${data.profile_path}`
          : 'https://via.placeholder.com/300x450?text=No+Image',
      };
    } catch {
      return null;
    }
  }

  setSelectedMovie(movie: Movie): void {
    // Store selected movie for navigation
    this.selectedMovie.set(movie);
  }

  private selectedMovie = signal<Movie | null>(null);
  private savedMovies = signal<Set<number>>(this.loadSavedMovies());

  private loadSavedMovies(): Set<number> {
    try {
      const saved = localStorage.getItem('savedMovies');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  }

  private saveSavedMoviesToStorage(): void {
    try {
      localStorage.setItem('savedMovies', JSON.stringify(Array.from(this.savedMovies())));
    } catch {
      // Silently fail if storage is unavailable
    }
  }

  isSavedForLater(movieId: number): boolean {
    return this.savedMovies().has(movieId);
  }

  toggleSaveForLater(movieId: number): void {
    const saved = this.savedMovies();
    if (saved.has(movieId)) {
      saved.delete(movieId);
    } else {
      saved.add(movieId);
    }
    this.savedMovies.set(new Set(saved));
    this.saveSavedMoviesToStorage();
  }

  getSavedMovies(allMovies: Movie[]): Movie[] {
    const saved = this.savedMovies();
    return allMovies.filter((m) => saved.has(m.id));
  }

  getMovies(): Movie[] {
    return this.movies();
  }

  getSelectedMovie() {
    return this.selectedMovie;
  }
}
