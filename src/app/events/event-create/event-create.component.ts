import { Component, EventEmitter, Output } from "@angular/core";

@Component({
  selector: 'app-event-create',
  templateUrl: './event-create.component.html',
  styleUrls: ['./event-create.component.css']
})
export class EventCreateComponent {
  enteredDescription = '';
  enteredStartTime = '';
  enteredEndTime = '';
  @Output() eventCreated = new EventEmitter();

  onAddEvent() {
    const event = {
      description: this.enteredDescription,
      startTime: this.enteredStartTime,
      endTime: this.enteredEndTime
    };
    this.eventCreated.emit(event);
  }
}
