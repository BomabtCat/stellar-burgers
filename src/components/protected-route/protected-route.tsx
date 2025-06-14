import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { user_selectors } from '../../services/slices/slice_user/slice_user';
import { useSelector } from '../../services/store';

type ProtectedRouteProps = {
  only_unauth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  only_unauth,
  children
}: ProtectedRouteProps) => {
  const location = useLocation();

  const user_data = useSelector(user_selectors.user_selector);
  const is_auth_checked = useSelector(user_selectors.is_auth_checked_selector);

  if (!is_auth_checked) return <Preloader />;

  if (!only_unauth && !user_data) {
    return <Navigate replace to='/login' state={{ from: location }} />;
  }

  if (only_unauth && user_data) {
    const from = location.state?.from || { pathname: '/' };
    return <Navigate replace to={from} />;
  }

  return children;
};
