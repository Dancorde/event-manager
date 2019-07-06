import { Component, Input } from '@angular/core';

import { Event } from "../event.model";

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent {
  @Input() events: Event[] = [];
}
