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
    this.http.get<{message: string, events: Event[]}>('http://localhost:3000/api/events')
      .subscribe((eventData) => {
        this.events = eventData.events;
        this.eventsUpdated.next([...this.events]);
      });
  }

  getEventUpdateListener() {
    return this.eventsUpdated.asObservable();
  }

  addEvent(description: string, startTime: string, endTime: string) {
    const event: Event = {id: null, description, startTime, endTime};
    this.http.post<{message: string}>('http://localhost:3000/api/events', event)
      .subscribe((responseData) => {
        console.log(responseData.message);
        this.events.push(event);
        this.eventsUpdated.next([...this.events]);
      });
  }
}
