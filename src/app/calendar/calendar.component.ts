import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { CalendarService } from './calendar.service';
import { Event } from '../events/event.model';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html'
})
export class CalendarComponent implements OnInit {
  calendarPlugins = [dayGridPlugin, timeGridPlugin, listPlugin];
  calendarHeader = {
    left: 'title',
    center: 'dayGridMonth,timeGridWeek,timeGridDay',
    right: 'today prev,next'
  };

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
