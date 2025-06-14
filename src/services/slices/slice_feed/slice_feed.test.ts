import { configureStore } from '@reduxjs/toolkit';
import feedSlice, {
  fetch_feed,
  feed_selectors,
  TFeed_State
} from './slice_feed';

import { v4 as uuidv4 } from 'uuid';
import { TOrdersData } from '@utils-types';

// Типизация заказа
type TIngredient = 'bun' | 'meat' | 'cheese' | 'salad' | 'tomato' | 'chicken' | 'sauce' | 'cucumber';
type TStatus = 'done' | 'pending';

interface GeneratedOrder {
  _id: string;
  ingredients: TIngredient[];
  status: TStatus;
  number: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface GeneratedOrdersData {
  orders: GeneratedOrder[];
  total: number;
  totalToday: number;
}

const randomElement = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomDate = (start: Date, end: Date): string =>
  new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString();

const generateBurgerName = (): string => {
  const adjectives = ['Двойной', 'Вегетарианский', 'Цыпленок', 'Острый'];
  const proteins = ['бургер', 'сендвич', 'ролл', 'буррито'];
  return `${randomElement(adjectives)} ${randomElement(proteins)}`;
};

const generateIngredients = (): TIngredient[] => {
  const allIngredients: TIngredient[] = ['bun', 'meat', 'cheese', 'salad', 'tomato', 'chicken', 'sauce', 'cucumber'];
  const count = Math.floor(Math.random() * 3) + 2; // от 2 до 5 ингредиентов
  const selected: TIngredient[] = [];

  while (selected.length < count) {
    const item = randomElement(allIngredients);
    if (!selected.includes(item)) selected.push(item);
  }

  return selected;
};

const generateMockOrdersData = (
  orderCount: number = 2,
  totalOrders: number = 1000,
  todayCount: number = 50
): GeneratedOrdersData => {
  const now = new Date();
  const startOfDay = new Date(now.setHours(0, 0, 0, 0));
  const endOfDay = new Date(now.setHours(23, 59, 59, 999));

  const orders: GeneratedOrder[] = Array.from({ length: orderCount }, (_, i) => ({
    _id: uuidv4(),
    ingredients: generateIngredients(),
    status: Math.random() > 0.5 ? 'done' : 'pending',
    number: 10000 + i + Math.floor(Math.random() * 1000),
    name: generateBurgerName(),
    createdAt: randomDate(startOfDay, endOfDay),
    updatedAt: randomDate(startOfDay, endOfDay)
  }));

  return {
    orders,
    total: totalOrders,
    totalToday: todayCount
  };
};

type RootState = {
  feed: TFeed_State;
};

describe('Проверка логики слайса "feed"', () => {
  let testStore: ReturnType<typeof configureStore>;

  beforeEach(() => {
    testStore = configureStore({
      reducer: {
        feed: feedSlice
      }
    });
  });

  describe('Тестирование асинхронного действия fetch_feed', () => {
    it('должно корректно обработать успешную загрузку данных', async () => {
      const mockData = generateMockOrdersData(2, 800, 37);

      await testStore.dispatch(fetch_feed.fulfilled(mockData, ''));

      const state = testStore.getState() as RootState;

      expect(state.feed.orders).toEqual(mockData.orders);
      expect(state.feed.total).toBe(mockData.total);
      expect(state.feed.totalToday).toBe(mockData.totalToday);
      expect(state.feed.is_loading).toBe(false);
      expect(state.feed.error_message).toBeNull();
    });

    it('должно установить сообщение об ошибке при провале', async () => {
      const errorMessage = 'Ошибка сети или неизвестный ответ сервера';

      await testStore.dispatch(fetch_feed.rejected(new Error(errorMessage), '', undefined, errorMessage));

      const state = testStore.getState() as RootState;

      expect(state.feed.is_loading).toBe(false);
      expect(state.feed.error_message).toBe(errorMessage);
    });
  });

  describe('Тестирование селекторов состояния', () => {
    it('orders_selector должен возвращать список заказов из стора', () => {
      const mockData = generateMockOrdersData(2, 800, 37);
      testStore.dispatch(fetch_feed.fulfilled(mockData, ''));

      const result = feed_selectors.orders_selector(testStore.getState() as RootState);
      expect(result).toEqual(mockData.orders);
    });

    it('total_selector должен возвращать общее количество заказов', () => {
      const mockData = generateMockOrdersData(2, 800, 37);
      testStore.dispatch(fetch_feed.fulfilled(mockData, ''));

      const result = feed_selectors.total_selector(testStore.getState() as RootState);
      expect(result).toBe(mockData.total);
    });

    it('total_today_selector должен возвращать количество за день', () => {
      const mockData = generateMockOrdersData(2, 800, 37);
      testStore.dispatch(fetch_feed.fulfilled(mockData, ''));

      const result = feed_selectors.total_today_selector(testStore.getState() as RootState);
      expect(result).toBe(mockData.totalToday);
    });

    it('error_message_selector должен возвращать текст последней ошибки', () => {
      const errorText = 'Не удалось получить данные';

      testStore.dispatch(fetch_feed.rejected(new Error(errorText), '', undefined, errorText));

      const result = feed_selectors.error_message_selector(testStore.getState() as RootState);
      expect(result).toBe(errorText);
    });
  });
});