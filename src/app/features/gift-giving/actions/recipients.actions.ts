import { createAction, props } from '@ngrx/store';
import { RecipientsEntity } from '../reducers/recipients.reducer';

let currentId = 1;

export const recipientAdded = createAction(
  '[gift giving] added a recipient',
  ({ name, email, selectedHolidayIds }: { name: string; email: string; selectedHolidayIds: string[] }) => ({
    payload: {
      id: 'T' + currentId++,
      name,
      email,
      selectedHolidayIds
    }
  })
);

export const loadRecipients = createAction(
  '[gift giving] load recipients'
);

export const loadRecipientsSucceeded = createAction(
  '[gift giving] recipients loaded successfully',
  props<{ payload: RecipientsEntity[] }>()
);
