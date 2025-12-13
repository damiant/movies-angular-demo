import { Component, ViewChild } from '@angular/core';
import { IonApp, IonRouterOutlet, IonMenu, IonContent, IonList, IonLabel, IonItem, IonIcon, IonHeader, IonToolbar, IonTitle } from '@ionic/angular/standalone';
import { RouterLink } from '@angular/router';
import { homeOutline, starOutline } from 'ionicons/icons';
import { addIcons } from 'ionicons';
import { MovieFooterComponent } from './movie-footer/movie-footer.component';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  imports: [IonApp, IonRouterOutlet, IonMenu, IonContent, IonList, IonLabel, IonItem, IonIcon, IonHeader, IonToolbar, IonTitle, RouterLink, MovieFooterComponent],
})
export class AppComponent {
  homeOutline = homeOutline;
  starOutline = starOutline;

  @ViewChild('menu') menu!: IonMenu;

  constructor() {
    addIcons({ homeOutline, starOutline });
  }

  closeMenu(): void {
    if (this.menu) {
      this.menu.close();
    }
  }
}
