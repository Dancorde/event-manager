import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EventListComponent } from './events/event-list/event-list.component';
import { EventCreateComponent } from './events/event-create/event-create.component';
import { AuthGuard } from './auth/auth.guard';


const routes: Routes = [
  { path: '', component: EventListComponent, canActivate: [AuthGuard] },
  { path: 'create', component: EventCreateComponent, canActivate: [AuthGuard] },
  { path: 'edit/:eventId', component: EventCreateComponent, canActivate: [AuthGuard] },
  { path: 'auth', loadChildren: '../app/auth/auth.module#AuthModule' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
