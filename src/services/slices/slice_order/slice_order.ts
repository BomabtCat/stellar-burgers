import {
  getOrderByNumberApi,
  getOrdersApi,
  orderBurgerApi
} from '../../../utils/burger-api';
import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { TOrder } from '@utils-types';
import { Root_State } from '../../store';

type TOrders_State = {
  orders: TOrder[];
  order: TOrder | null;
  is_loading: boolean;
  error_message: string | null;
};

const initialState: TOrders_State = {
  orders: [],
  order: null,
  is_loading: false,
  error_message: null
};

export const fetch_order_burger = createAsyncThunk<
  TOrder,
  string[],
  { rejectValue: string }
>('orders/fetchOrderBurger', async (data, { rejectWithValue }) => {
  try {
    const response = await orderBurgerApi(data);
    return response.order;
  } catch (error) {
    return rejectWithValue('Ошибка при создании заказа');
  }
});

export const fetch_order_by_number = createAsyncThunk<
  TOrder,
  number,
  { rejectValue: string }
>('orders/fetchOrderByNumber', async (number, { rejectWithValue }) => {
  try {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  } catch (error) {
    return rejectWithValue('Ошибка при получении заказа по номеру');
  }
});

export const fetch_orders = createAsyncThunk<
  TOrder[],
  void,
  { rejectValue: string }
>('orders/fetchOrders', async (_, { rejectWithValue }) => {
  try {
    const response = await getOrdersApi();
    return response;
  } catch (error) {
    return rejectWithValue('Ошибка при получении всех заказов');
  }
});

export const orders_slice = createSlice({
  name: 'orders',
  initialState,
  reducers: {
    order_modal_data_action: (state, action: PayloadAction<TOrder | null>) => {
      state.order = action.payload;
    },
    clear_order_modal_data_action: (state) => {
      state.order = null;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetch_order_burger.pending, (state) => {
        state.is_loading = true;
        state.error_message = null;
      })
      .addCase(fetch_order_burger.fulfilled, (state, action) => {
        state.order = action.payload;
        state.is_loading = false;
      })
      .addCase(fetch_order_burger.rejected, (state, action) => {
        state.is_loading = false;
        state.error_message = action.payload || 'Неизвестная ошибка';
      })

      .addCase(fetch_order_by_number.pending, (state) => {
        state.is_loading = true;
        state.error_message = null;
      })
      .addCase(fetch_order_by_number.fulfilled, (state, action) => {
        state.order = action.payload;
        state.is_loading = false;
      })
      .addCase(fetch_order_by_number.rejected, (state, action) => {
        state.is_loading = false;
        state.error_message = action.payload || 'Неизвестная ошибка';
      })

      .addCase(fetch_orders.pending, (state) => {
        state.is_loading = true;
        state.error_message = null;
      })
      .addCase(fetch_orders.fulfilled, (state, action) => {
        state.orders = action.payload;
        state.is_loading = false;
      })
      .addCase(fetch_orders.rejected, (state, action) => {
        state.is_loading = false;
        state.error_message = action.payload || 'Неизвестная ошибка';
      });
  }
});

export const order_actions = orders_slice.actions;

export const order_selectors = {
  orders_selector: (state: Root_State) => state.orders.orders,
  order_selector: (state: Root_State) => state.orders.order,
  is_loading_selector: (state: Root_State) => state.orders.is_loading,
  error_message_selector: (state: Root_State) => state.orders.error_message
};

export default orders_slice.reducer;
