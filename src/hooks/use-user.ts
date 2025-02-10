import { useContext, useEffect } from 'react';
import { AuthContext } from '../context/auth-context.tsx';
import { decodeToken } from 'react-jwt';
import { apiInstance } from '../utils/api-instance.ts';
import { Token, tokenSchema } from '../types/user.ts';

export const useUser = () => {
  const { user, setUser, token, setToken } = useContext(AuthContext);

  useEffect(() => {
    if (token) {
      addUser(token);
    } else {
      removeUser();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  const addUser = (token: string) => {
    setToken(token);
    apiInstance.defaults.headers.common['Authorization'] = 'Bearer ' + token;
    const decodedToken = decodeToken<Token>(token);
    const parsed = tokenSchema.safeParse(decodedToken);

    if (parsed.success) {
      setUser({
        id: parsed.data.id,
        email: parsed.data.sub,
        firstName: parsed.data.firstName,
        lastName: parsed.data.lastName,
        userRole: parsed.data.userRole,
      });
    } else {
      console.error(
        'There was an error while trying to validate token: ',
        parsed.error
      );
    }
  };

  const removeUser = () => {
    setUser(null);
    setToken(null); // This should trigger localStorage removal in AuthContext
    delete apiInstance.defaults.headers.common['Authorization'];
  };

  return { user, addUser, removeUser, setUser, token, setToken };
};
