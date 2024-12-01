import { createReducer, on } from '@ngrx/store';
import {
  loadCategoriesSuccess,
  addCategory,
  updateCategory,
  deleteCategory,
} from '../actions/category.actions';
import { CategoryState } from '../app.state';

export const initialState: CategoryState = {
  categories: [
    { id: '1', name: 'What Went Well' },
    { id: '2', name: 'What Didn’t Go Well' },
    { id: '3', name: 'Action Items' },
  ],
};

export const categoryReducer = createReducer(
  initialState,
  on(loadCategoriesSuccess, (state, { categories }) => ({
    ...state,
    categories,
  })),
  on(addCategory, (state, { category }) => ({
    ...state,
    categories: [...state.categories, category],
  })),
  on(updateCategory, (state, { category }) => ({
    ...state,
    categories: state.categories.map((cat) =>
      cat.id === category.id ? category : cat
    ),
  })),
  on(deleteCategory, (state, { categoryId }) => ({
    ...state,
    categories: state.categories.filter((cat) => cat.id !== categoryId),
  }))
);
