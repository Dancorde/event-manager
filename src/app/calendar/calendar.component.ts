import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CalendarService } from './calendar.service';
import { Event } from '../events/event.model';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import bootstrapPlugin from '@fullcalendar/bootstrap';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit {
  calendarPlugins = [dayGridPlugin, timeGridPlugin, bootstrapPlugin];
  calendarHeader = {
    left: 'title',
    center: 'dayGridMonth,timeGridDay',
    right: 'prev,next'
  };
  timeZone = 'America/Sao_Paulo';

  events: Event[] = [];
  private eventsSub: Subscription;

  constructor(public calendarService: CalendarService) {}

  ngOnInit() {
    this.calendarService.getEvents();
    this.eventsSub = this.calendarService.getEventUpdateListener()
      .subscribe((events: Event[]) => {
        this.events = events;
      });
  }

  dateClick(arg) {
    alert(arg.dateStr);
  }
}
