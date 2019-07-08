import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';

import { EventsService } from '../events.service';
import { Event } from '../event.model';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit {
  enteredDescription = '';
  enteredStartTime = '';
  enteredEndTime = '';
  event: Event;
  private mode = 'create';
  private eventId: string;

  constructor(public eventsService: EventsService, public route: ActivatedRoute) {}

  ngOnInit() {
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('eventId')) {
        this.mode = 'edit';
        this.eventId = paramMap.get('eventId');
        this.eventsService.getEvent(this.eventId).subscribe(eventData => {
          this.event = {
            id: eventData._id,
            description: eventData.description,
            startTime: eventData.startTime,
            endTime: eventData.endTime
          }
        });
      } else {
        this.mode = 'create';
        this.eventId = null;
      }
    });
  }

  onSaveEvent(form: NgForm) {
    if (form.invalid) {
      return;
    }
    if (this.mode === 'create') {
      this.eventsService.addEvent(form.value.description, form.value.startTime, form.value.endTime);
    } else {
      this.eventsService.updateEvent(this.eventId, form.value.description, form.value.startTime, form.value.endTime);
    }
    form.resetForm();
  }
}
