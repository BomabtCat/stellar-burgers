import { useState, useRef, useEffect, FC } from 'react';
import { useInView } from 'react-intersection-observer';

import { TTabMode } from '@utils-types';
import { BurgerIngredientsUI } from '../ui/burger-ingredients';
import { ingSelectors } from '../../services/slices/slice_ingredients/slices_ingredients';
import { useSelector } from '../../services/store';

export const BurgerIngredients: FC = () => {
  const _ingredients = useSelector(ingSelectors.ingSel);

  const _buns = _ingredients?.filter((ingredient) => ingredient.type === 'bun');
  const _mains = _ingredients?.filter(
    (ingredient) => ingredient.type === 'main'
  );
  const _sauces = _ingredients?.filter(
    (ingredient) => ingredient.type === 'sauce'
  );

  const [_currentTab, _setCurrentTab] = useState<TTabMode>('bun');

  const _titleBunRef = useRef<HTMLHeadingElement>(null);
  const _titleMainRef = useRef<HTMLHeadingElement>(null);
  const _titleSaucesRef = useRef<HTMLHeadingElement>(null);

  const [_bunsRef, _inViewBuns] = useInView({ threshold: 0 });
  const [_mainsRef, _inViewFilling] = useInView({ threshold: 0 });
  const [_saucesRef, _inViewSauces] = useInView({ threshold: 0 });

  useEffect(() => {
    if (_inViewBuns) {
      _setCurrentTab('bun');
    } else if (_inViewSauces) {
      _setCurrentTab('sauce');
    } else if (_inViewFilling) {
      _setCurrentTab('main');
    }
  }, [_inViewBuns, _inViewFilling, _inViewSauces]);

  const _onTabClick = (tab: string) => {
    _setCurrentTab(tab as TTabMode);
    if (tab === 'bun') {
      _titleBunRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (tab === 'main') {
      _titleMainRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
    if (tab === 'sauce') {
      _titleSaucesRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <BurgerIngredientsUI
      currentTab={_currentTab}
      buns={_buns}
      mains={_mains}
      sauces={_sauces}
      titleBunRef={_titleBunRef}
      titleMainRef={_titleMainRef}
      titleSaucesRef={_titleSaucesRef}
      bunsRef={_bunsRef}
      mainsRef={_mainsRef}
      saucesRef={_saucesRef}
      onTabClick={_onTabClick}
    />
  );
};
