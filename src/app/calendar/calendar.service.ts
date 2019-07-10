import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Event } from '../events/event.model';


@Injectable({providedIn: 'root'})
export class CalendarService {
  private events: any[] = [];
  private eventsUpdated = new Subject<any[]>();

  constructor(private http: HttpClient) {}

  getEvents() {
    this.http
      .get<{ message: string, events: any[] }>('http://localhost:3000/api/events')
      .pipe(map((eventData) => {
        return eventData.events.map(event => {
          return {
            title: event.description,
            start: event.startTime,
            end: event.endTime,
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
}
