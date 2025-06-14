import { FC, memo } from 'react';
import { useLocation } from 'react-router-dom';

import { BurgerIngredientUI } from '@ui';
import { TBurgerIngredientProps } from './type';
import { use_dispatch } from '../../services/store';
import { burger_constructor_actions } from '../../services/slices/slice_burger_constructor/slice_burger_constructor';

export const BurgerIngredient: FC<TBurgerIngredientProps> = memo(
  ({ ingredient, count }) => {
    const _location = useLocation();
    const _dispatch = use_dispatch();

    const _handleAdd = () => {
      _dispatch(
        burger_constructor_actions.add_ingredient({
          ...ingredient,
          id: ingredient._id
        })
      );
    };

    return (
      <BurgerIngredientUI
        ingredient={ingredient}
        count={count}
        locationState={{ background: _location }}
        handleAdd={_handleAdd}
      />
    );
  }
);
