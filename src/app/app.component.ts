import { Component } from '@angular/core';

import { Event } from './events/event.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  storedEvents: Event[] = [];

  onEventAdded(event) {
    this.storedEvents.push(event);
  }
}
