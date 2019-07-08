import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { Event } from '../event.model';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-event-list',
  templateUrl: './event-list.component.html'
})
export class EventListComponent implements OnInit, OnDestroy {
  events: Event[] = [];
  private eventsSub: Subscription;

  constructor(public eventsService: EventsService) {}

  ngOnInit() {
    this.eventsService.getEvents();
    this.eventsSub = this.eventsService.getEventUpdateListener()
      .subscribe((events: Event[]) => {
        this.events = events;
      });
  }

  onDelete(eventId: string) {
    this.eventsService.deleteEvent(eventId);
  }

  ngOnDestroy() {
    this.eventsSub.unsubscribe();
  }
}
