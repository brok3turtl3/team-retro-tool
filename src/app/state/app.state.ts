export interface AppState {
  categories: CategoryState;
  cards: CardState;
}

export interface CategoryState {
  categories: Category[];
}

export interface CardState {
  cards: Card[];
}

export interface Category {
  id: string;
  name: string;
}

export interface Card {
  id: string;
  content: string;
  categoryId: string;
}
