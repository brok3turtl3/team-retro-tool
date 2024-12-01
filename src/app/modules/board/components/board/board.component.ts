import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { Category } from 'src/app/state/app.state';
import { selectCategories } from 'src/app/state/selectors/category.selectors';
import { loadCategories } from 'src/app/state/actions/category.actions';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  categories$: Observable<Category[]>;
  constructor(private store: Store) {
    this.categories$ = this.store.select(selectCategories);
  }

  ngOnInit(): void {
    this.store.dispatch(loadCategories());
  }
}
