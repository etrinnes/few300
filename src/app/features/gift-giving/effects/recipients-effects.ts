import { Injectable } from '@angular/core';
import { createEffect, Actions, ofType } from '@ngrx/effects';
import * as recipientsActions from '../actions/recipients.actions';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { switchMap, map } from 'rxjs/operators';
import { RecipientsEntity } from '../reducers/recipients.reducer';

@Injectable()
export class RecipientsEffects {

  loadTheRecipients$ = createEffect(() =>
    this.actions$
      .pipe(
        ofType(recipientsActions.loadRecipients),
        switchMap(() => this.client.get<GetRecipientsResponse>(`${environment.rootApiUrl}recipients`)
          .pipe(
            map(response => response.recipients),
            map((recipients) => recipientsActions.loadRecipientsSucceeded({ payload: recipients }))
          )
        )
      )
    , { dispatch: true });
  constructor(private actions$: Actions, private client: HttpClient) { }

}

interface GetRecipientsResponse {
  recipients: RecipientsEntity[];
}
