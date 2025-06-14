import { FC, useMemo, useEffect } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { use_dispatch, useSelector } from '../../services/store';
import { useNavigate } from 'react-router-dom';

import {
  burger_constructor_actions,
  burger_constructor_selectors
} from '../../services/slices/slice_burger_constructor/slice_burger_constructor';
import {
  fetch_order_burger,
  order_actions,
  order_selectors
} from '../../services/slices/slice_order/slice_order';
import { fetch_user } from '../../services/slices/slice_user/slice_user';
import { user_selectors } from '../../services/slices/slice_user/slice_user';

export const BurgerConstructor: FC = () => {
  const _navigate = useNavigate();
  const _dispatch = use_dispatch();

  const _user = useSelector(user_selectors.user_selector);
  const _bun = useSelector(burger_constructor_selectors.bun_selector);
  const _ingredients = useSelector(
    burger_constructor_selectors.ingredients_selector
  );
  const _orderRequest = useSelector(order_selectors.is_loading_selector);
  const _orderModalData = useSelector(order_selectors.order_selector);

  useEffect(() => {
    if (!_user) {
      _dispatch(fetch_user());
    }

    return () => {
      if (_orderModalData) {
        localStorage.removeItem('orderId');
        _dispatch(order_actions.clear_order_modal_data_action());
        _dispatch(burger_constructor_actions.clear_ingredients());
      }
    };
  }, [_dispatch, _user, _orderModalData]);

  const _closeOrderModal = () => {
    _dispatch(order_actions.clear_order_modal_data_action());
    _dispatch(burger_constructor_actions.clear_ingredients());
    localStorage.removeItem('orderId');
  };

  const _onOrderClick = () => {
    if (!_bun || _orderRequest) return;

    if (!_user) {
      return _navigate('/login');
    }

    const _bunId = _bun._id;
    const _ingredientsIds = _ingredients.map((item) => item._id);
    const _orderData = [_bunId, ..._ingredientsIds, _bunId];

    _dispatch(fetch_order_burger(_orderData));
  };

  const _calculatePrice = useMemo(() => {
    const _bunPrice = _bun ? _bun.price * 2 : 0;
    const _ingredientsPrice = _ingredients.reduce(
      (total: number, ingredient: TConstructorIngredient) =>
        total + ingredient.price,
      0
    );
    return _bunPrice + _ingredientsPrice;
  }, [_bun, _ingredients]);

  return (
    <BurgerConstructorUI
      price={_calculatePrice}
      orderRequest={_orderRequest}
      constructorItems={{ bun: _bun, ingredients: _ingredients }}
      orderModalData={_orderModalData}
      onOrderClick={_onOrderClick}
      closeOrderModal={_closeOrderModal}
    />
  );
};
