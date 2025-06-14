import reducer, {
  fetch_order_burger,
  fetch_order_by_number,
  fetch_orders,
  order_actions,
} from './slice_order';


const generateMockOrder = (index = 0) => ({
  _id: `order_${index}`,
  ingredients: [`ingredient_${index}_a`, `ingredient_${index}_b`],
  status: index % 2 === 0 ? 'done' : 'pending',
  name: `Order #${index}`,
  number: 1000 + index,
  createdAt: new Date(2025, 5, index + 1).toISOString(),
  updatedAt: new Date(2025, 5, index + 1, 1).toISOString(),
});

const mockOrder = generateMockOrder(1);
const mockOrdersList = [generateMockOrder(1), generateMockOrder(2)];


describe('orders slice reducer', () => {
  const initialState = {
    orders: [],
    order: null,
    is_loading: false,
    error_message: null,
  };

  it('Возвращает начальное состояние при неизвестном действии', () => {
    expect(reducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('Синхронные действия', () => {
    test('Должен установить order через order_modal_data_action', () => {
      const action = order_actions.order_modal_data_action(mockOrder);
      const result = reducer(initialState, action);
      expect(result.order?._id).toBe(mockOrder._id);
      expect(result.order?.number).toBe(mockOrder.number);
    });

    test('Должен очистить order через clear_order_modal_data_action', () => {
      const stateWithOrder = { ...initialState, order: mockOrder };
      const action = order_actions.clear_order_modal_data_action();
      const result = reducer(stateWithOrder, action);
      expect(result.order).toBeNull();
    });
  });

  describe('fetch_order_burger', () => {
    let state: any;

    beforeEach(() => {
      state = reducer(initialState, {} as any);
    });

    test('pending - включает загрузку и убирает ошибку', () => {
      const action = { type: fetch_order_burger.pending.type };
      const result = reducer(state, action);
      expect(result.is_loading).toBeTruthy();
      expect(result.error_message).toBeNull();
    });

    test('fulfilled - устанавливает заказ и завершает загрузку', () => {
      const action = {
        type: fetch_order_burger.fulfilled.type,
        payload: mockOrder,
      };
      const result = reducer(state, action);
      expect(result.order).toBeDefined();
      expect(result.order?.name).toBe(mockOrder.name);
      expect(result.is_loading).toBeFalsy();
    });

    test('rejected - записывает сообщение об ошибке', () => {
      const message = 'Order creation error';
      const action = {
        type: fetch_order_burger.rejected.type,
        payload: message,
      };
      const result = reducer(state, action);
      expect(result.error_message).toMatch(message);
      expect(result.is_loading).toBeFalsy();
    });
  });

  describe('fetch_order_by_number', () => {
    let state: any;

    beforeEach(() => {
      state = reducer(initialState, {} as any);
    });

    test('pending - активирует загрузку и сбрасывает ошибку', () => {
      const action = { type: fetch_order_by_number.pending.type };
      const result = reducer(state, action);
      expect(result.is_loading).toBe(true);
      expect(result.error_message).toBeNull();
    });

    test('fulfilled - обновляет текущий заказ', () => {
      const action = {
        type: fetch_order_by_number.fulfilled.type,
        payload: mockOrder,
      };
      const result = reducer(state, action);
      expect(result.order).toEqual(expect.objectContaining({
        _id: mockOrder._id,
        number: mockOrder.number,
      }));
    });

    test('rejected - сохраняет текст ошибки', () => {
      const message = 'Fetch order by number error';
      const action = {
        type: fetch_order_by_number.rejected.type,
        payload: message,
      };
      const result = reducer(state, action);
      expect(result.error_message).toContain(message);
    });
  });

  describe('fetch_orders', () => {
    let state: any;

    beforeEach(() => {
      state = reducer(initialState, {} as any);
    });

    test('pending - включает загрузку и убирает ошибку', () => {
      const action = { type: fetch_orders.pending.type };
      const result = reducer(state, action);
      expect(result.is_loading).toBe(true);
      expect(result.error_message).toBeNull();
    });

    test('fulfilled - устанавливает список заказов', () => {
      const action = {
        type: fetch_orders.fulfilled.type,
        payload: mockOrdersList,
      };
      const result = reducer(state, action);
      expect(result.orders.length).toBeGreaterThan(0);
      expect(result.orders[0]).toHaveProperty('_id');
    });

    test('rejected - записывает сообщение об ошибке', () => {
      const message = 'Fetch all orders error';
      const action = {
        type: fetch_orders.rejected.type,
        payload: message,
      };
      const result = reducer(state, action);
      expect(result.error_message).toBe(message);
    });
  });
});