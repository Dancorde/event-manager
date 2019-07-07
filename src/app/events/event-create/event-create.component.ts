import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';

import { Event } from '../event.model';
import { EventsService } from '../events.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  enteredDescription = '';
  enteredStartTime = '';
  enteredEndTime = '';

  constructor(public eventsService: EventsService) {

  }

  onAddEvent(form: NgForm) {
    if (form.invalid) {
      return;
    }
    const event: Event = {
      description: form.value.description,
      startTime: form.value.startTime,
      endTime: form.value.endTime
    };
    this.eventsService.addEvent(event);
    form.resetForm();
  }
}
