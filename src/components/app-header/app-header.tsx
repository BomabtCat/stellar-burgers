import { FC } from 'react';
import { AppHeaderUI } from '@ui';
import { useSelector } from '../../services/store';
import { getUserState } from '../../services/slices/slice_user/slice_user';

export const AppHeader: FC = () => {
  const userState = useSelector(getUserState);
  const userName = userState.user_data?.name;
  return <AppHeaderUI userName={userName} />;
};
