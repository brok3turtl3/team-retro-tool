import { createAction, props } from '@ngrx/store';
import { Card } from '../app.state';

export const loadCards = createAction('[Card] Load Cards');
export const loadCardsSuccess = createAction(
  '[Card] Load Cards Success',
  props<{ cards: Card[] }>()
);
export const addCard = createAction('[Card] Add Card', props<{ card: Card }>());
export const updateCard = createAction(
  '[Card] Update Card',
  props<{ card: Card }>()
);
export const deleteCard = createAction(
  '[Card] Delete Card',
  props<{ cardId: string }>()
);
