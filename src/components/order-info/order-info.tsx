import { FC, useEffect, useMemo } from 'react';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { use_dispatch, useSelector } from '../../services/store';
import {
  fetch_order_by_number,
  order_selectors
} from '../../services/slices/slice_order/slice_order';
import { ingSelectors } from '../../services/slices/slice_ingredients/slices_ingredients';
import { useParams } from 'react-router-dom';

export const OrderInfo: FC = () => {
  const _orderData = useSelector(order_selectors.order_selector);
  const _ingredients: TIngredient[] = useSelector(ingSelectors.ingSel);

  const _id = useParams().number;
  const _dispatch = use_dispatch();

  useEffect(() => {
    _dispatch(fetch_order_by_number(Number(_id)));
  }, [_dispatch, _id]);

  const _orderInfo = useMemo(() => {
    if (!_orderData || !_ingredients.length) return null;

    const _date = new Date(_orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const _ingredientsInfo = _orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const _ingredient = _ingredients.find((ing) => ing._id === item);
          if (_ingredient) {
            acc[item] = {
              ..._ingredient,
              count: 1
            };
          }
        } else acc[item].count++;

        return acc;
      },
      {}
    );

    const _total = Object.values(_ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ..._orderData,
      ingredientsInfo: _ingredientsInfo,
      date: _date,
      total: _total
    };
  }, [_orderData, _ingredients]);

  if (!_orderInfo) return <Preloader />;

  return <OrderInfoUI orderInfo={_orderInfo} />;
};
