# Movie Rater App

Movie Rater is a modern, mobile-first Ionic + Angular application for browsing, rating, and favoriting movies. It features a beautiful, responsive UI with animated navigation, persistent footer, and smooth transitions. The app demonstrates advanced Angular 17+ features including Signals, Effects, and standalone components, and leverages Ionic 7+ for a native-like mobile experience.

## Features

- **Movie Discovery:** Browse a curated list of movies with posters, ratings, and descriptions.
- **Favorites:** Mark movies as favorites and view your personalized list. The favorite count is always visible and animates on change.
- **Animated Footer Navigation:** Persistent footer with segment navigation that hides on scroll down and reappears on scroll up, for a true mobile feel.
- **Movie Details:** View detailed information, trailers, and cast for each movie.
- **Actor Pages:** Explore movies by your favorite actors.
- **Responsive & Themed:** Uses CSS variables and SCSS for easy theming and a consistent look across devices.
- **Performance:** Uses Angular Signals and Effects for highly reactive, efficient UI updates. Scroll events are throttled for smooth performance.

## Tech Stack
- **Angular 17+** (standalone components, Signals API)
- **Ionic 7+** (ion-content, ion-segment, etc.)
- **TypeScript (strict mode)**
- **SCSS/CSS Variables**

## Getting Started
1. Install dependencies:
   ```bash
   bun install
   ```
2. Run the app:
   ```bash
   bun run start
   ```
3. Build for production:
   ```bash
   npm run build
   ```

## Project Structure
- `src/app/` — Main app code (pages, components, services)
- `src/theme/variables.scss` — Theme variables
- `src/assets/` — Images and icons

## Notes
- Footer navigation and favorite count are fully reactive and animated.
- Scroll-based footer hide/show is implemented using a shared ScrollService and Angular Signals.
- No RxJS or @Input() used; all state is managed with signals and services.

---

This project is a showcase of best practices for building modern, reactive, mobile-friendly Angular + Ionic apps.
