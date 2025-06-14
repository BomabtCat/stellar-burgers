// src/services/slices/slice_feed/slice_feed.ts

import { getFeedsApi } from '../../../utils/burger-api';
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { TOrdersData } from '@utils-types';

type TFeed_State = TOrdersData & {
  is_loading: boolean;
  error_message: string | null;
};

export type { TFeed_State }; // Добавляем экспорт типа TFeed_State

export const initialState: TFeed_State = {
  orders: [],
  total: 0,
  totalToday: 0,
  is_loading: true,
  error_message: null
};

export const fetch_feed = createAsyncThunk<
  TOrdersData,
  void,
  { rejectValue: string }
>('feeds/fetchFeed', async (_, { rejectWithValue }) => {
  try {
    console.log('Fetching feeds...');
    const response = await getFeedsApi();
    console.log('Fetched feeds:', response);
    return response;
  } catch (error) {
    console.error('Error fetching feeds:', error);
    return rejectWithValue('Ошибка при получении данных ленты заказов');
  }
});

export const feed_slice = createSlice({
  name: 'feed',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetch_feed.pending, (state) => {
        state.is_loading = true;
        state.error_message = null;
      })
      .addCase(
        fetch_feed.fulfilled,
        (state, action: PayloadAction<TOrdersData>) => {
          state.orders = action.payload.orders;
          state.total = action.payload.total;
          state.totalToday = action.payload.totalToday;
          state.is_loading = false;
        }
      )
      .addCase(fetch_feed.rejected, (state, action) => {
        state.is_loading = false;
        state.error_message = action.error.message || 'Неизвестная ошибка';
      });
  }
});

export const feed_selectors = {
  orders_selector: (state: { feed: TFeed_State }) => state.feed.orders,
  total_selector: (state: { feed: TFeed_State }) => state.feed.total,
  total_today_selector: (state: { feed: TFeed_State }) => state.feed.totalToday,
  is_loading_selector: (state: { feed: TFeed_State }) => state.feed.is_loading,
  error_message_selector: (state: { feed: TFeed_State }) =>
    state.feed.error_message
};

export default feed_slice.reducer;
