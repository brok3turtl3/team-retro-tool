import { createFeatureSelector, createSelector } from '@ngrx/store';
import { CategoryState } from '../app.state';

export const selectCategoryState =
  createFeatureSelector<CategoryState>('categories');

export const selectCategories = createSelector(
  selectCategoryState,
  (state) => state.categories
);
