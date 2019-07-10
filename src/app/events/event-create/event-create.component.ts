import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';

import { EventsService } from '../events.service';
import { Event } from '../event.model';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent implements OnInit, OnDestroy {
  enteredDescription = '';
  enteredStartTime = '';
  enteredEndTime = '';
  enteredDate = '';
  event: Event;
  isLoading = false;
  private mode = 'create';
  private eventId: string;
  private authStatusSub: Subscription;

  constructor(
    public eventsService: EventsService,
    public route: ActivatedRoute,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('eventId')) {
        this.mode = 'edit';
        this.eventId = paramMap.get('eventId');
        this.isLoading = true;
        this.eventsService.getEvent(this.eventId).subscribe(eventData => {
          this.isLoading = false;
          this.event = {
            id: eventData._id,
            description: eventData.description,
            startTime: eventData.startTime,
            endTime: eventData.endTime
          };
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
    this.isLoading = true;
    if (this.mode === 'create') {
      this.eventsService.addEvent(form.value.description, form.value.startTime, form.value.endTime);
    } else {
      this.eventsService.updateEvent(this.eventId, form.value.description, form.value.startTime, form.value.endTime);
    }
    form.resetForm();
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
