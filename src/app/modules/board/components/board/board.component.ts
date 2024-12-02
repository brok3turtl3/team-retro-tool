import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { Observable } from 'rxjs';
import { CategoryService } from 'src/app/services/category.service';
import { CardService } from 'src/app/services/card.service';
import { Card, Category } from 'src/app/state/app.state';
import { selectCategories } from 'src/app/state/selectors/category.selectors';
import { selectCards } from 'src/app/state/selectors/card.selectors';
import { loadCategoriesSuccess } from 'src/app/state/actions/category.actions';
import { loadCardsSuccess } from 'src/app/state/actions/card.actions';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  categories$: Observable<Category[]>;
  cards$: Observable<Card[]>;
  constructor(
    private store: Store,
    private categoryService: CategoryService,
    private cardService: CardService
  ) {
    this.categories$ = this.store.select(selectCategories);
    this.cards$ = this.store.select(selectCards);
  }

  ngOnInit(): void {
    console.log('HIT!!!');
    this.categoryService.getCategories().subscribe((categories) => {
      this.store.dispatch(loadCategoriesSuccess({ categories }));
    });

    this.cardService.getCards().subscribe((cards) => {
      console.log('Fetched cards:', cards);
      this.store.dispatch(loadCardsSuccess({ cards }));
    });
  }

  getCardsForCategory(categoryId: string): Observable<Card[]> {
    return this.cards$.pipe(
      map((cards) => cards.filter((card) => card.categoryId === categoryId))
    );
  }
}
