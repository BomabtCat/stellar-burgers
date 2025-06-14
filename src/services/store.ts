import {
  TypedUseSelectorHook,
  useDispatch as dispatch_hook,
  useSelector as selector_hook
} from 'react-redux';
import { user_slice } from './slices/slice_user/slice_user';
import { feed_slice } from './slices/slice_feed/slice_feed';
import { orders_slice } from './slices/slice_order/slice_order';
import { ingSlice } from './slices/slice_ingredients/slices_ingredients';
import { combineSlices, configureStore } from '@reduxjs/toolkit';
import { burger_constructor_slice } from './slices/slice_burger_constructor/slice_burger_constructor';

export const root_reducer = combineSlices(
  ingSlice,
  user_slice,
  burger_constructor_slice,
  orders_slice,
  feed_slice
);

const store = configureStore({
  reducer: root_reducer,
  devTools: process.env.NODE_ENV !== 'production'
});

export type Root_State = ReturnType<typeof root_reducer>;

export type App_Dispatch = typeof store.dispatch;

export const use_dispatch: () => App_Dispatch = () => dispatch_hook();

export const useSelector: TypedUseSelectorHook<Root_State> = selector_hook;

export default store;
