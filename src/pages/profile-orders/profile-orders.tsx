import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { use_dispatch, useSelector } from '../../services/store';
import {
  fetch_orders,
  order_selectors
} from '../../services/slices/slice_order/slice_order';

export const ProfileOrders: FC = () => {
  const orders: TOrder[] = useSelector(order_selectors.orders_selector);

  const dispatch = use_dispatch();

  useEffect(() => {
    dispatch(fetch_orders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
