import { useUser } from './use-user.ts';
import { useNavigate } from 'react-router-dom';
import { AuthResponse } from '../types/urls.ts';
import { apiInstance } from '../utils/api-instance.ts';
import { LOGIN_URL } from '../consts/api.ts';

export const useAuth = () => {
  const { user, addUser, removeUser, token } = useUser();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const { data, status } = await apiInstance.post<AuthResponse>(LOGIN_URL, {
      email,
      password,
    });

    if (status === 200) {
      addUser(data.token);
      navigate('/');
    } else {
      return { error: true };
    }

    return { error: false };
  };

  const logout = () => {
    removeUser();
    navigate('/login');
  };

  return {
    user,
    token,
    login,
    logout,
  };
};
