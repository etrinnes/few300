import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HolidayListItem, RecipientListModel } from '../../models';
import { GiftGivingState, selectHolidayModel, selectHolidayListModel, selectRecipientModel } from '../../reducers';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-recipients',
  templateUrl: './recipients.component.html',
  styleUrls: ['./recipients.component.scss']
})
export class RecipientsComponent implements OnInit {

  holidays$: Observable<HolidayListItem[]>;
  recipients$: Observable<RecipientListModel[]>;
  constructor(private store: Store<GiftGivingState>) { }

  ngOnInit() {
    this.holidays$ = this.store.select(selectHolidayListModel);
    this.recipients$ = this.store.select(selectRecipientModel);
  }

}
