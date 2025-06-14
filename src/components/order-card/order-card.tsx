import { FC, memo, useMemo } from 'react';
import { useLocation } from 'react-router-dom';

import { OrderCardProps } from './type';
import { TIngredient } from '@utils-types';
import { OrderCardUI } from '../ui/order-card';
import { useSelector } from '../../services/store';
import { ingSelectors } from '../../services/slices/slice_ingredients/slices_ingredients';

const _maxIngredients = 6;

export const OrderCard: FC<OrderCardProps> = memo(({ order }) => {
  const _location = useLocation();

  const _ingredients: TIngredient[] = useSelector(ingSelectors.ingSel);

  const _orderInfo = useMemo(() => {
    if (!_ingredients.length) return null;

    const _ingredientsInfo = order.ingredients.reduce(
      (acc: TIngredient[], item: string) => {
        const _ingredient = _ingredients.find((ing) => ing._id === item);
        if (_ingredient) return [...acc, _ingredient];
        return acc;
      },
      []
    );

    const _total = _ingredientsInfo.reduce((acc, item) => acc + item.price, 0);

    const _ingredientsToShow = _ingredientsInfo.slice(0, _maxIngredients);

    const _remains =
      _ingredientsInfo.length > _maxIngredients
        ? _ingredientsInfo.length - _maxIngredients
        : 0;

    const _date = new Date(order.createdAt);
    return {
      ...order,
      ingredientsInfo: _ingredientsInfo,
      ingredientsToShow: _ingredientsToShow,
      remains: _remains,
      total: _total,
      date: _date
    };
  }, [order, _ingredients]);

  if (!_orderInfo) return null;

  return (
    <OrderCardUI
      orderInfo={_orderInfo}
      maxIngredients={_maxIngredients}
      locationState={{ background: _location }}
    />
  );
});
