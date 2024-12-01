import { createReducer, on } from '@ngrx/store';
import {
  loadCardsSuccess,
  addCard,
  updateCard,
  deleteCard,
} from '../actions/card.actions';
import { CardState } from '../app.state';

export const initialState: CardState = {
  cards: [],
};

export const cardReducer = createReducer(
  initialState,
  on(loadCardsSuccess, (state, { cards }) => ({ ...state, cards })),
  on(addCard, (state, { card }) => ({
    ...state,
    cards: [...state.cards, card],
  })),
  on(updateCard, (state, { card }) => ({
    ...state,
    cards: state.cards.map((c) => (c.id === card.id ? card : c)),
  })),
  on(deleteCard, (state, { cardId }) => ({
    ...state,
    cards: state.cards.filter((c) => c.id !== cardId),
  }))
);
