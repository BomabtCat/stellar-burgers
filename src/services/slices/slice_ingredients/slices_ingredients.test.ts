import reducer, { fetchIngs } from './slices_ingredients';

const mockIngsList = [
  { _id: '1', name: 'Ing_1' },
  { _id: '2', name: 'Ing_2' },
];

describe('Проверка редьюсера ингредиентов', () => {
  const initialState = {
    ings: [],
    isLoading: true,
    err: null,
  };

 
  let state: ReturnType<typeof reducer>;

  beforeEach(() => {
    state = reducer(initialState, { type: '' });
  });

  it('Возвращает начальное состояние при неизвестном экшене', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Поведение при асинхронном запросе данных', () => {
    it('pending - активирует загрузку и очищает ошибку', () => {
      const action = { type: fetchIngs.pending.type };
      const resultState = reducer(state, action);

      expect(resultState.isLoading).toBe(true);
      expect(resultState.err).toBeNull();
      expect(resultState.ings).toHaveLength(0);
    });

    it('fulfilled - сохраняет данные и завершает загрузку', () => {
      const action = {
        type: fetchIngs.fulfilled.type,
        payload: mockIngsList,
      };
      const resultState = reducer(state, action);

      expect(resultState.ings).toEqual(mockIngsList);
      expect(resultState.isLoading).toBe(false);
    });

    it('rejected - устанавливает текст ошибки и завершает загрузку', () => {
      const errorText = 'Ошибка загрузки ингредиентов';
      const action = {
        type: fetchIngs.rejected.type,
        payload: errorText,
      };
      const resultState = reducer(state, action);

      expect(resultState.isLoading).toBe(false);
      expect(resultState.err).toBe(errorText);
      expect(resultState.ings).toHaveLength(0);
    });
  });
});