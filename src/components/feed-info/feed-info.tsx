import { FC } from 'react';

import { TOrder } from '@utils-types';
import { FeedInfoUI } from '../ui/feed-info';
import { useSelector } from '../../services/store';
import { feed_selectors } from '../../services/slices/slice_feed/slice_feed';

const _getOrders = (orders: TOrder[], status: string): number[] =>
  orders
    .filter((item) => item.status === status)
    .map((item) => item.number)
    .slice(0, 20);

export const FeedInfo: FC = () => {
  const _orders: TOrder[] = useSelector(feed_selectors.orders_selector);
  const _feed = {
    total: useSelector(feed_selectors.total_selector),
    totalToday: useSelector(feed_selectors.total_today_selector)
  };

  const _readyOrders = _getOrders(_orders, 'done');
  const _pendingOrders = _getOrders(_orders, 'pending');

  return (
    <FeedInfoUI
      readyOrders={_readyOrders}
      pendingOrders={_pendingOrders}
      feed={_feed}
    />
  );
};
