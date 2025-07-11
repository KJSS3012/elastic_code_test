import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../stores/auth/slice';
import { type RootState } from '../stores/store';
import { setUnauthorizedCallback } from '../services/api';

export const useAuthInterceptor = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.authReducer);
  const { error } = useSelector((state: RootState) => state.producerReducer);

  // Configurar callback para logout imediato em caso de 401
  useEffect(() => {
    const handleUnauthorized = () => {
      console.log('Interceptado erro 401 - fazendo logout e redirecionando');
      dispatch(logout());
      navigate('/auth', { replace: true });
    };

    setUnauthorizedCallback(handleUnauthorized);

    // Cleanup
    return () => {
      setUnauthorizedCallback(() => { });
    };
  }, [dispatch, navigate]);

  useEffect(() => {
    // Verificar se houve erro de autorização via Redux
    if (error && (error.includes('UNAUTHORIZED') || error.includes('401'))) {
      console.log('Detectado erro de autorização via Redux:', error);
      // Despachar logout e redirecionar
      dispatch(logout());
      navigate('/auth', { replace: true });
    }
  }, [error, dispatch, navigate]);

  useEffect(() => {
    // Se perdeu autenticação mas ainda está em rota protegida, redirecionar
    if (!isAuthenticated && !window.location.pathname.includes('/auth')) {
      console.log('Redirecionando para login - não autenticado');
      navigate('/auth', { replace: true });
    }
  }, [isAuthenticated, navigate]);
};
