import { FC, SyntheticEvent, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { resetPasswordApi } from '@api';
import { ResetPasswordUI } from '@ui-pages';

export const ResetPassword: FC = () => {
  const navigate = useNavigate();

  const [password, setPassword] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | undefined>(undefined);

  const isResetPasswordAllowed = () =>
    localStorage.getItem('resetPassword') !== null;

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(undefined);
    try {
      await resetPasswordApi({ password, token });
      localStorage.removeItem('resetPassword');
      navigate('/login');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    }
  };

  useEffect(() => {
    if (!isResetPasswordAllowed()) {
      navigate('/forgot-password', { replace: true });
    }
  }, [navigate]);

  return (
    <ResetPasswordUI
      errorText={error}
      password={password}
      token={token}
      setPassword={setPassword}
      setToken={setToken}
      handleSubmit={handleSubmit}
    />
  );
};
