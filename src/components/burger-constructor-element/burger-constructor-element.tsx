import { FC, memo } from 'react';
import { BurgerConstructorElementUI } from '@ui';
import { BurgerConstructorElementProps } from './type';
import { use_dispatch } from '../../services/store';
import { burger_constructor_actions } from '../../services/slices/slice_burger_constructor/slice_burger_constructor';

export const BurgerConstructorElement: FC<BurgerConstructorElementProps> = memo(
  ({ ingredient, index, totalItems }) => {
    const _dispatch = use_dispatch();

    const _handleMoveDown = () => {
      _dispatch(
        burger_constructor_actions.drag_ingredient({
          from: index,
          to: index + 1
        })
      );
    };

    const _handleMoveUp = () => {
      _dispatch(
        burger_constructor_actions.drag_ingredient({
          from: index,
          to: index - 1
        })
      );
    };

    const _handleClose = () => {
      _dispatch(burger_constructor_actions.remove_ingredient(index));
    };

    return (
      <BurgerConstructorElementUI
        ingredient={ingredient}
        index={index}
        totalItems={totalItems}
        handleMoveUp={_handleMoveUp}
        handleMoveDown={_handleMoveDown}
        handleClose={_handleClose}
      />
    );
  }
);
