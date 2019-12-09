import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as recipientsActions from '../actions/recipients.actions';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { RecipientsEntity } from '../reducers/recipients.reducer';

@Injectable()
export class RecipientsEffects {

  saveTheRecipient$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recipientsActions.recipientAdded),
      switchMap((originalAction) => this.client.post<RecipientsEntity>(`${environment.rootApiUrl}recipients`, originalAction.payload)
        .pipe(
          map(newRecipient => recipientsActions.recipientAddedSuccessfully({ payload: newRecipient, oldId: originalAction.payload.id }))
        ))
    ), { dispatch: true }
  );

  saveTheHolidays$ = createEffect(() =>
    this.actions$.pipe(
      ofType(recipientsActions.recipientAddedSuccessfully),
      switchMap((thing) => this.client.put(`${environment.rootApiUrl}recipients/${thing.payload.id}/holidays`,
        thing.payload.selectedHolidayIds)
      )), { dispatch: false }
  );

  loadTheRecipients$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(recipientsActions.loadRecipients),
        switchMap(() => this.client.get<GetRecipientsResponse>(`${environment.rootApiUrl}recipients`)
          .pipe(
            map(response => response.recipients),
            map(blah => blah.map(thing => ({ id: thing.id, name: thing.name, email: thing.email, selectedHolidayIds: thing.holidays } as RecipientsEntity))),
            map((recipients) => recipientsActions.loadRecipientsSucceeded({ payload: recipients }))
          )
        )
      )
    , { dispatch: true });

  constructor(private actions$: Actions, private client: HttpClient) { }

}

interface GetRecipientsResponse {
  recipients: RecipientThing[];
}

interface RecipientThing {
  id: string;
  name: string;
  email: string;
  holidays: string[];
}
