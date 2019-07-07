import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

import { Event } from './event.model';

@Injectable({providedIn: 'root'})
export class EventsService {
  private events: Event[] = [];
  private eventsUpdated = new Subject<Event[]>();

  getEvents() {
    return [...this.events];
  }

  getEventUpdateListener() {
    return this.eventsUpdated.asObservable();
  }

  addEvent(enteredEvent: Event) {
    const event: Event = enteredEvent;
    this.events.push(event);
    this.eventsUpdated.next([...this.events]);
  }
}
