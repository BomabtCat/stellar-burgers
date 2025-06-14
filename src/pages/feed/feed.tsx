import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { use_dispatch, useSelector } from '../../services/store';
import {
  feed_selectors,
  fetch_feed
} from '../../services/slices/slice_feed/slice_feed';

export const Feed: FC = () => {
  const orders: TOrder[] = useSelector(feed_selectors.orders_selector);

  const dispatch = use_dispatch();

  useEffect(() => {
    dispatch(fetch_feed());
  }, [dispatch]);

  if (!orders.length) return <Preloader />;
  return (
    <FeedUI orders={orders} handleGetFeeds={() => dispatch(fetch_feed())} />
  );
};
