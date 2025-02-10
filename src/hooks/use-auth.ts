import { useUser } from './use-user.ts';
import { useNavigate } from 'react-router-dom';
import { AxiosResponse } from 'axios';
import { AuthResponse } from '../types/urls.ts';
import { apiInstance } from '../utils/api-instance.ts';
import { LOGIN_URL, REGISTER_URL } from '../consts/api.ts';

interface RegisterPayload {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export const useAuth = () => {
  const { user, addUser, removeUser, token } = useUser();
  const navigate = useNavigate();

  const login = async (email: string, password: string) => {
    const { data, status } = await apiInstance.post<
      any,
      AxiosResponse<AuthResponse>
    >(LOGIN_URL, {
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

  const register = async (payload: RegisterPayload) => {
    const { data, status } = await apiInstance.post<
      any,
      AxiosResponse<AuthResponse>
    >(REGISTER_URL, payload);

    if (status === 201 && data.token) {
      addUser(data.token);
      navigate('/');
    }
  };

  return {
    user,
    token,
    login,
    logout,
    register,
  };
};
