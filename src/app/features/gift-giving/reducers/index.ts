export const featureName = 'giftGivingFeature';
import * as fromHolidays from './holidays.reducer';
import * as fromHolidayModels from '../models/holidays';
import * as fromHolidayListControl from './holiday-list-controls.reducer';
import * as fromHolidayListControlModels from '../models/list-controls';
import * as fromRecipients from './recipients.reducer';
import * as fromRecipientModels from '../models/recipients';
import * as moment from 'moment';
import { ActionReducerMap, createFeatureSelector, createSelector } from '@ngrx/store';
import { DashboardModel } from '../models';


export interface GiftGivingState {
  holidays: fromHolidays.HolidayState;
  holidayListControls: fromHolidayListControl.HolidayListControlState;
  recipients: fromRecipients.RecipientState;
}

export const reducers: ActionReducerMap<GiftGivingState> = {
  holidays: fromHolidays.reducer,
  holidayListControls: fromHolidayListControl.reducer,
  recipients: fromRecipients.reducer
};


// SELECTORS

// 1. Feature Selector
const selectGiftFeature = createFeatureSelector<GiftGivingState>(featureName);

// 2. Feature per branch
const selectHolidaysBranch = createSelector(selectGiftFeature, g => g.holidays);
const selectHolidayListControlsBranch = createSelector(selectGiftFeature, g => g.holidayListControls);
const selectRecipientBranch = createSelector(selectGiftFeature, g => g.recipients);

// 3. Helpers
const { selectAll: selectHolidayArray, selectEntities: selectHolidayEntities } = fromHolidays.adapter.getSelectors(selectHolidaysBranch);
const { selectAll: selectRecipientArray } = fromRecipients.adapter.getSelectors(selectRecipientBranch);

const selectShowAll = createSelector(
  selectHolidayListControlsBranch,
  b => b.showAll
);

const selectSortBy = createSelector(
  selectHolidayListControlsBranch,
  b => b.sortBy
);

// 4. For the components


// 4.a. We need one that returns a holiday model


const selectHolidayModelRaw = createSelector(selectHolidayArray,
  selectHolidayArray,
  (holidays) => {
    return {
      holidays
    } as fromHolidayModels.HolidaysModel;
  }
);

const selectHolidayModelFiltered = createSelector(
  selectHolidayModelRaw,
  selectShowAll,
  (holidayModel, showAll) => {
    if (showAll) {
      return holidayModel;
    } else {
      return {
        holidays: holidayModel.holidays.filter(h => new Date(h.date) >= new Date())
      } as fromHolidayModels.HolidaysModel;
    }
  }
);

const selectHolidayListSorted = createSelector(
  selectHolidayModelFiltered,
  selectSortBy,
  (holiday, by) => {
    if (by === 'date') {
      return {
        holidays: [...holiday.holidays.sort(    // the ... was added so we create a new array instead of mutating the existing one
          (lhs, rhs) => {
            if (new Date(lhs.date) < new Date(rhs.date)) {
              return -1;
            }
            if (new Date(lhs.date) > new Date(rhs.date)) {
              return 1;
            }
            return 0;
          }
        )]
      };
    } else {
      return {
        holidays: [...holiday.holidays.sort(
          (lhs, rhs) => {
            if (lhs.name.toLocaleLowerCase() < rhs.name.toLocaleLowerCase()) {
              return -1;
            } else if (lhs.name.toLocaleLowerCase() > rhs.name.toLocaleLowerCase()) {
              return 1;
            }
            return 0;
          }
        )]
      };
    }
  }
);

export const selectHolidayListModel = createSelector(
  selectHolidayModelRaw,
  r => r.holidays
);

export const selectHolidayModel = createSelector(
  selectHolidayListSorted,
  h => h
);

export const selectHolidayListControlsModel = createSelector(
  selectHolidayListControlsBranch,
  b => {
    return {
      showingAll: b.showAll,
      showingUpcoming: !b.showAll,
      sortingByDate: b.sortBy === 'date',
      sortingByName: b.sortBy === 'name'
    } as fromHolidayListControlModels.ListControlsModel;
  }
);

export const selectRecipientModel = createSelector(
  selectRecipientArray,
  selectHolidayEntities,
  (recipients, holidays) => {
    return recipients.map(recipient => {
      return {
        id: recipient.id,
        name: recipient.name,
        email: recipient.email,
        holidays: recipient.selectedHolidayIds
          .map(id => holidays[id])
          .map(makeHolidayThing)
      } as fromRecipientModels.RecipientListModel;
    });
  }
);


export const selectDashboardModel = createSelector(
  selectHolidayModelRaw,
  selectRecipientModel,
  (holiday, recipients) => {
    const sortedHolidays = [...holiday.holidays.filter(h => new Date(h.date) >= new Date()).sort((lhs, rhs) => {
      if (new Date(lhs.date) > new Date(rhs.date)) {
        return 1;
      }
      if (new Date(lhs.date) < new Date(rhs.date)) {
        return -1;
      }
      return 0;
    })];
    return sortedHolidays.map(h => ({
      holidayId: h.id,
      holiday: h.name,
      recipients: recipients.filter(recipient => recipient.holidays)
        .map(thing => ({ id: thing.id, name: thing.name }))
    } as DashboardModel));
  }
);

function makeHolidayThing(h: fromHolidays.HolidayEntity) {
  return {
    id: h.id,
    description: h.name
  };
}

