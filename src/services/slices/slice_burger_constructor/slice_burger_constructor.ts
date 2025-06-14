import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TConstructorIngredient } from '@utils-types';
import { v4 as uuid } from 'uuid';

export type TBurger_Constructor_State = {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
};

export const initialState: TBurger_Constructor_State = {
  bun: null,
  ingredients: []
};

export const burger_constructor_slice = createSlice({
  name: 'burgerConstructor',
  initialState,
  reducers: {
    add_ingredient: {
      reducer: (state, { payload }: PayloadAction<TConstructorIngredient>) => {
        if (payload.type === 'bun') {
          state.bun = payload;
        } else {
          state.ingredients.push(payload);
        }
      },
      prepare: (ingredient: TConstructorIngredient) => ({
        payload: { ...ingredient, id: uuid() }
      })
    },
    remove_ingredient: (state, { payload }: PayloadAction<number>) => {
      state.ingredients.splice(payload, 1);
    },
    drag_ingredient: (
      state,
      { payload }: PayloadAction<{ from: number; to: number }>
    ) => {
      const { from, to } = payload;
      const ingredients = [...state.ingredients];

      ingredients.splice(to, 0, ingredients.splice(from, 1)[0]);
      state.ingredients = ingredients;
    },
    clear_ingredients: (state) => {
      state.bun = null;
      state.ingredients = [];
    }
  }
});

export const burger_constructor_selectors = {
  bun_selector: (state: { burgerConstructor: TBurger_Constructor_State }) =>
    state.burgerConstructor.bun,

  ingredients_selector: (state: {
    burgerConstructor: TBurger_Constructor_State;
  }) => state.burgerConstructor.ingredients,

  constructor_state_selector: (state: {
    burgerConstructor: TBurger_Constructor_State;
  }) => state.burgerConstructor
};

export const burger_constructor_actions = burger_constructor_slice.actions;

export default burger_constructor_slice.reducer;
