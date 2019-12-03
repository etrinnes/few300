import { Component, OnInit, Input, ChangeDetectionStrategy } from '@angular/core';
import { HolidaysModel } from '../../../models';

@Component({
  selector: 'app-holiday-list',
  templateUrl: './holiday-list.component.html',
  styleUrls: ['./holiday-list.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class HolidayListComponent implements OnInit {

  // model: HolidaysModel = {
  //   holidays: [
  //     { id: '1', name: 'Christmas', date: new Date(2019, 11, 25).toISOString() },
  //     { id: '2', name: 'July 4th', date: new Date(2020, 6, 4).toISOString() }
  //   ]
  // };
  @Input() model: HolidaysModel;
  constructor() { }

  ngOnInit() {
  }

}
