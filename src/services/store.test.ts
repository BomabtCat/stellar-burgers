import store, { root_reducer } from '../services/store';

test('проверка работы rootReducer', () => {
  const expected = root_reducer(undefined, { type: 'UNKNOWN_ACTION' });
  expect(expected).toEqual(store.getState());
});
