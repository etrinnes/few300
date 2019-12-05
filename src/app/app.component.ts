import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { AppState, selectErrorMessage, selectHasError } from './reducers';
import { applicationStarted } from './actions/app.actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'few300';

  hasError$: Observable<boolean>;
  errorMessage$: Observable<string>;

  constructor(private store: Store<AppState>) {
    store.dispatch(applicationStarted());
  }

  ngOnInit() {
    this.hasError$ = this.store.select(selectHasError);
    this.errorMessage$ = this.store.select(selectErrorMessage);
  }
}
