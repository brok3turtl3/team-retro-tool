import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CardState } from '../app.state';

export const selectCardState = createFeatureSelector<CardState>('cards');

export const selectCards = createSelector(
  selectCardState,
  (state) => state.cards
);
