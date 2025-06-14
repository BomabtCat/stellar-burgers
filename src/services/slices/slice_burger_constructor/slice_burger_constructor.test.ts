import { configureStore } from '@reduxjs/toolkit';
import { burger_constructor_slice, burger_constructor_actions, initialState, burger_constructor_selectors } from './slice_burger_constructor'; // adjust the import path accordingly
import { v4 as uuid } from 'uuid';
import { TConstructorIngredient } from '../../../utils/types';
jest.mock('uuid', () => ({
  v4: jest.fn(() => 'test-uuid')
}));

const createMockIngredient = (overrides: Partial<TConstructorIngredient> = {}): TConstructorIngredient => ({
  _id: 'default-id',
  type: 'ingredient',
  name: 'Default Ingredient',
  id: 'default-ingredient',
  proteins: 0,
  fat: 0,
  carbohydrates: 0,
  calories: 0,
  price: 0,
  image: 'https://example.com/default.jpg ',
  image_large: 'https://example.com/default-large.jpg ',
  image_mobile: 'https://example.com/default-mobile.jpg ',
  ...overrides
});

describe('burger_constructor_slice reducers', () => {
  it('should handle add_ingredient with bun', () => {
    const ingredient = createMockIngredient({
      _id: 'test-bun-id',
      type: 'bun',
      name: 'Sesame',
      price: 1.5
    });

    const nextState = burger_constructor_slice.reducer(initialState, 
      burger_constructor_actions.add_ingredient(ingredient));

    expect(nextState.bun).toEqual({ ...ingredient, id: 'test-uuid' });
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('should handle add_ingredient with regular ingredient', () => {
    const ingredient = createMockIngredient({
      _id: 'test-lettuce-id',
      type: 'ingredient',
      name: 'Lettuce',
      proteins: 1.2,
      fat: 0.1,
      carbohydrates: 2.3,
      calories: 10,
      price: 2.5
    });

    const nextState = burger_constructor_slice.reducer(initialState, 
      burger_constructor_actions.add_ingredient(ingredient));

    expect(nextState.bun).toBeNull();
    expect(nextState.ingredients).toHaveLength(1);
    expect(nextState.ingredients[0]).toEqual({ ...ingredient, id: 'test-uuid' });
  });

  it('should handle remove_ingredient', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        createMockIngredient({
          _id: 'test-lettuce-id',
          type: 'ingredient',
          name: 'Lettuce',
          proteins: 1.2,
          fat: 0.1,
          carbohydrates: 2.3,
          calories: 10,
          price: 2.5
        })
      ]
    };

    const nextState = burger_constructor_slice.reducer(stateWithIngredients, 
      burger_constructor_actions.remove_ingredient(0));

    expect(nextState.ingredients).toHaveLength(0);
  });

  it('should handle drag_ingredient', () => {
    const stateWithIngredients = {
      bun: null,
      ingredients: [
        createMockIngredient({ _id: 'test-lettuce-id', name: 'Lettuce' }),
        createMockIngredient({ _id: 'test-tomato-id', name: 'Tomato' }),
        createMockIngredient({ _id: 'test-cheese-id', name: 'Cheese' })
      ]
    };

    const nextState = burger_constructor_slice.reducer(stateWithIngredients, 
      burger_constructor_actions.drag_ingredient({ from: 0, to: 2 }));

    expect(nextState.ingredients[0].name).toBe('Tomato');
    expect(nextState.ingredients[2].name).toBe('Lettuce');
  });

  it('should handle clear_ingredients', () => {
    const stateWithIngredients = {
      bun: createMockIngredient({
        _id: 'test-bun-id',
        type: 'bun',
        name: 'Sesame',
        price: 1.5
      }),
      ingredients: [
        createMockIngredient({
          _id: 'test-lettuce-id',
          type: 'ingredient',
          name: 'Lettuce',
          proteins: 1.2,
          fat: 0.1,
          carbohydrates: 2.3,
          calories: 10,
          price: 2.5
        })
      ]
    };

    const nextState = burger_constructor_slice.reducer(stateWithIngredients, 
      burger_constructor_actions.clear_ingredients());

    expect(nextState.bun).toBeNull();
    expect(nextState.ingredients).toHaveLength(0);
  });

  it('should return the correct bun selector', () => {
    const state = {
      burgerConstructor: {
        bun: createMockIngredient({
          _id: 'test-bun-id',
          type: 'bun',
          name: 'Sesame',
          price: 1.5
        }),
        ingredients: [
          createMockIngredient({
            _id: 'test-lettuce-id',
            type: 'ingredient',
            name: 'Lettuce',
            proteins: 1.2,
            fat: 0.1,
            carbohydrates: 2.3,
            calories: 10,
            price: 2.5
          })
        ]
      }
    };

    const bun = burger_constructor_selectors.bun_selector(state);
    expect(bun).toEqual(createMockIngredient({
      _id: 'test-bun-id',
      type: 'bun',
      name: 'Sesame',
      price: 1.5
    }));
  });

  it('should return the correct ingredients selector', () => {
    const state = {
      burgerConstructor: {
        bun: null,
        ingredients: [
          createMockIngredient({
            _id: 'test-lettuce-id',
            type: 'ingredient',
            name: 'Lettuce',
            proteins: 1.2,
            fat: 0.1,
            carbohydrates: 2.3,
            calories: 10,
            price: 2.5
          })
        ]
      }
    };

    const ingredients = burger_constructor_selectors.ingredients_selector(state);
    expect(ingredients).toEqual([
      createMockIngredient({
        _id: 'test-lettuce-id',
        type: 'ingredient',
        name: 'Lettuce',
        proteins: 1.2,
        fat: 0.1,
        carbohydrates: 2.3,
        calories: 10,
        price: 2.5
      })
    ]);
  });
});

const store = configureStore({ 
  reducer: { burgerConstructor: burger_constructor_slice.reducer } 
});