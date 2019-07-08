import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { Event } from './event.model';

@Injectable({providedIn: 'root'})
export class EventsService {
  private events: Event[] = [];
  private eventsUpdated = new Subject<Event[]>();

  constructor(private http: HttpClient) {}

  getEvents() {
    this.http.get<{message: string, events: Event[]}>('http://localhost:3000/api/events')
      .pipe(map((eventData) => {
        return eventData.events.map(event => {
          return {
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            id: event._id
          };
        });
      }))
      .subscribe((transformedEvents) => {
        this.events = transformedEvents;
        this.eventsUpdated.next([...this.events]);
      });
  }

  getEventUpdateListener() {
    return this.eventsUpdated.asObservable();
  }

  addEvent(description: string, startTime: string, endTime: string) {
    const event: Event = {id: null, description, startTime, endTime};
    this.http.post<{message: string, eventId: string}>('http://localhost:3000/api/events', event)
      .subscribe((responseData) => {
        const id = responseData.eventId;
        event.id = id;
        this.events.push(event);
        this.eventsUpdated.next([...this.events]);
      });
  }

  deleteEvent(eventId: string) {
    this.http.delete('http://localhost:3000/api/events/' + eventId)
      .subscribe(() => {
        const updatedEvents = this.events.filter(event => event.id !== eventId);
        this.events = updatedEvents;
        this.eventsUpdated.next([...this.events]);
      });
  }
}
