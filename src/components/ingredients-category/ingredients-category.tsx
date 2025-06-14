import { forwardRef, useMemo } from 'react';
import { TIngredientsCategoryProps } from './type';
import { TIngredient } from '@utils-types';
import { IngredientsCategoryUI } from '../ui/ingredients-category';
import { useSelector } from '../../services/store';
import { burger_constructor_selectors } from '../../services/slices/slice_burger_constructor/slice_burger_constructor';

export const IngredientsCategory = forwardRef<
  HTMLUListElement,
  TIngredientsCategoryProps
>(({ title, titleRef, ingredients }, ref) => {
  const _bun = useSelector(burger_constructor_selectors.bun_selector);
  const _constructorIngredients = useSelector(
    burger_constructor_selectors.ingredients_selector
  );

  const _ingredientsCounters = useMemo(() => {
    const _counters: { [key: string]: number } = {};

    _constructorIngredients.forEach((ingredient: TIngredient) => {
      if (!_counters[ingredient._id]) _counters[ingredient._id] = 0;
      _counters[ingredient._id]++;
    });

    if (_bun) _counters[_bun._id] = 2;

    return _counters;
  }, [_bun, _constructorIngredients]);

  return (
    <IngredientsCategoryUI
      title={title}
      titleRef={titleRef}
      ingredients={ingredients}
      ingredientsCounters={_ingredientsCounters}
      ref={ref}
    />
  );
});
