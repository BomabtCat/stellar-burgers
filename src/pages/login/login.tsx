import { FC, SyntheticEvent, useState } from 'react';
import { LoginUI } from '@ui-pages';
import { use_dispatch } from '../../services/store';
import { fetch_login_user } from '../../services/slices/slice_user/slice_user';
import { useNavigate } from 'react-router-dom';

export const Login: FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();
  const dispatch = use_dispatch();

  const handleSubmit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setError(null);

    const resultAction = await dispatch(fetch_login_user({ email, password }));

    if (fetch_login_user.fulfilled.match(resultAction)) {
      navigate('/');
    } else {
      setError('Ошибка при авторизации.');
    }
  };

  return (
    <LoginUI
      errorText=''
      email={email}
      setEmail={setEmail}
      password={password}
      setPassword={setPassword}
      handleSubmit={handleSubmit}
    />
  );
};

export default Login;
