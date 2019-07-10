import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import {
  MatInputModule,
  MatCardModule,
  MatButtonModule,
  MatExpansionModule,
  MatProgressSpinnerModule,
  MatToolbarModule,
  MatDialogModule,
  MatDatepickerModule,
  MatNativeDateModule
} from '@angular/material';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { EventCreateComponent } from './events/event-create/event-create.component';
import { EventListComponent } from './events/event-list/event-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { HeaderComponent } from './header/header.component';
import { ErrorComponent } from './error/error.component';
import { FullCalendarModule } from '@fullcalendar/angular';
import { CalendarComponent } from './calendar/calendar.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    EventCreateComponent,
    EventListComponent,
    LoginComponent,
    SignupComponent,
    ErrorComponent,
    CalendarComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    MatToolbarModule,
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatExpansionModule,
    MatProgressSpinnerModule,
    HttpClientModule,
    MatDialogModule,
    FullCalendarModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true }
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
