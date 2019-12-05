import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as appActions from '../../../actions/app.actions';
import * as holidayActions from '../actions/holidays.actions';
import { map } from 'rxjs/operators';

@Injectable()
export class AppEffects {

  // turn app_started into loadHolidays
  loadDataOnAppStart$ = createEffect(() =>
    this.actions$.pipe(
      ofType(appActions.applicationStarted),
      map(() => holidayActions.loadHolidays()) // turns action of one type into another type
    )
  );
  constructor(private actions$: Actions) { }
}
