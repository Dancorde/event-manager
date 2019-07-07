import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

import { Event } from './event.model';

@Injectable({providedIn: 'root'})
export class EventsService {
  private events: Event[] = [];
  private eventsUpdated = new Subject<Event[]>();

  constructor(private http: HttpClient) {}

  getEvents() {
    this.http.get<{events: Event[]}>('http://localhost:3000/api/events')
      .subscribe((eventData) => {
        this.events = eventData.events;
        this.eventsUpdated.next([...this.events]);
      });
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
