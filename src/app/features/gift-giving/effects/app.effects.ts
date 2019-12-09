import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as appActions from '../../../actions/app.actions';
import * as holidayActions from '../actions/holidays.actions';
import * as recipientActions from '../actions/recipients.actions';
import { map, switchMap } from 'rxjs/operators';

@Injectable()
export class AppEffects {

  // turn addHolidayFailed -> applicationError
  addHolidayFailure$ = createEffect(() =>
    this.actions$.pipe(
      ofType(holidayActions.addHolidayFailed),
      map((x) => appActions.applicationError({ message: x.message, feature: 'Gift Giving' }))
    )
  );

  // turn app_started into loadHolidays
  loadDataOnAppStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.applicationStarted),
      switchMap(() => [
        holidayActions.loadHolidays(),
        recipientActions.loadRecipients()
      ])
    )
  );
  constructor(private actions$: Actions) { }
}
