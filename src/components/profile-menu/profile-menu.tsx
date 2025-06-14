import { FC } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ProfileMenuUI } from '@ui';
import { use_dispatch } from '../../services/store';
import { fetch_logout } from '../../services/slices/slice_user/slice_user';

export const ProfileMenu: FC = () => {
  const { pathname } = useLocation();
  const _navigate = useNavigate();
  const _dispatch = use_dispatch();

  const _handleLogout = () => {
    _dispatch(fetch_logout());
    _navigate('/');
  };

  return <ProfileMenuUI handleLogout={_handleLogout} pathname={pathname} />;
};
