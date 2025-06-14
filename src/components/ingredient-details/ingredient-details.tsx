import { FC } from 'react';
import { Preloader } from '../ui/preloader';
import { IngredientDetailsUI } from '../ui/ingredient-details';
import { useSelector } from '../../services/store';
import { ingSelectors } from '../../services/slices/slice_ingredients/slices_ingredients';
import { useParams, useLocation } from 'react-router-dom';
import styles from './ingredient-details.module.css';

export const IngredientDetails: FC = () => {
  const ingredients = useSelector(ingSelectors.ingSel);
  const isLoading = useSelector(ingSelectors.isLoadingSel);
  const { id } = useParams();
  const location = useLocation();

  const ingredientData = ingredients.find((i) => i._id === id);

  if (isLoading) {
    return <Preloader />;
  }

  if (!ingredientData) {
    return (
      <div className={styles.error}>
        <h2>Ингредиент не найден</h2>
      </div>
    );
  }

  const isModal = location.state && location.state.background;

  return (
    <div className={isModal ? '' : styles.container}>
      <div className={isModal ? '' : styles.content}>
        {!isModal && (
          <h3 className='text text_type_main-large'>Детали ингредиента</h3>
        )}
        <IngredientDetailsUI ingredientData={ingredientData} />
      </div>
    </div>
  );
};
