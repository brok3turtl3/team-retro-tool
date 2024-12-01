import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { Category } from 'src/app/state/app.state';
import { selectCategories } from 'src/app/state/selectors/category.selectors';
import { loadCategoriesSuccess } from 'src/app/state/actions/category.actions';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  categories$: Observable<Category[]>;
  constructor(private store: Store, private categoryService: CategoryService) {
    this.categories$ = this.store.select(selectCategories);
  }

  ngOnInit(): void {
    console.log('HIT!!!');
    this.categoryService.getCategories().subscribe((categories) => {
      this.store.dispatch(loadCategoriesSuccess({ categories }));
    });
  }
}
