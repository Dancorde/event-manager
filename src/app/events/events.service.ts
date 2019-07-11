import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';

// import { Event } from './event.model';

const BACKEND_URL = environment.apiUrl + '/events/';

@Injectable({providedIn: 'root'})
export class EventsService {
  private events: any[] = [];
  private eventsUpdated = new Subject<any[]>();

  constructor(private http: HttpClient, private router: Router) {}

  getEvents() {
    this.http
      .get<{ message: string, events: any[] }>(BACKEND_URL)
      .pipe(map((eventData) => {
        return eventData.events.map(event => {
          return {
            description: event.description,
            startTime: event.startTime,
            endTime: event.endTime,
            id: event._id,
            creator: event.creator
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

  getEvent(id: string) {
    return this.http.get<{
      _id: string;
      description: string;
      startTime: string;
      endTime: string;
      creator: string;
    }>(BACKEND_URL + id);
  }

  addEvent(description: string, startTime: string, endTime: string) {
    const event: any = {id: null, description, startTime, endTime};
    this.http.post<{ message: string, eventId: string }>(BACKEND_URL, event)
      .subscribe((responseData) => {
        const id = responseData.eventId;
        event.id = id;
        this.events.push(event);
        this.eventsUpdated.next([...this.events]);
        this.router.navigate(['/']);
      }, error => {
        this.router.navigate(['/']);
      });
  }

  updateEvent(id: string, description: string, startTime: string, endTime: string) {
    const event: any = {
      id,
      description,
      startTime,
      endTime
    };
    this.http.patch(BACKEND_URL + id, event)
      .subscribe(response => {
        const updatedEvents = [...this.events];
        const oldEventIndex = updatedEvents.findIndex( e => e.id === event.id);
        updatedEvents[oldEventIndex] = event;
        this.events = updatedEvents;
        this.eventsUpdated.next([...this.events]);
        this.router.navigate(['/']);
      }, error => {
        this.router.navigate(['/']);
      });

  }

  deleteEvent(eventId: string) {
    this.http.delete(BACKEND_URL + eventId)
      .subscribe(() => {
        const updatedEvents = this.events.filter(event => event.id !== eventId);
        this.events = updatedEvents;
        this.eventsUpdated.next([...this.events]);
      });
  }
}
