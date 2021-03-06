import { EntityState, createEntityAdapter } from '@ngrx/entity';
import { createReducer, Action, on } from '@ngrx/store';
import * as actions from '../actions/holidays.actions';

export interface HolidayEntity {
  id: string;
  name: string;
  date: string;
}

export interface HolidayState extends EntityState<HolidayEntity> {

}

export const adapter = createEntityAdapter<HolidayEntity>();

// const initialState: HolidayState = {
//   ids: ['1', '2'],
//   entities: {
//     1: { id: '1', name: 'Christmas', date: new Date(2019, 11, 25).toISOString() },
//     2: { id: '2', name: 'Jeff\'s Birthday', date: new Date(2020, 3, 20).toISOString() }
//   }
// };

const initialState = adapter.getInitialState();

const reducerFunction = createReducer(
  initialState,
  on(actions.addHoliday, (state, action) => adapter.addOne(action.payload, state)),
  on(actions.loadHolidaysSucceeded, (state, action) => adapter.addAll(action.payload, state)),
  on(actions.addHolidaySucceeded, (state, action) => {
    const oldState = adapter.removeOne(action.oldId, state);
    return adapter.addOne(action.payload, oldState);
  }),
  on(actions.addHolidayFailed, (state, action) => adapter.removeOne(action.payload.id, state))
);

export function reducer(state: HolidayState = initialState, action: Action) {
  return reducerFunction(state, action);
}



