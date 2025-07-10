import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import { type RootState } from '../stores/store';
import { useAuthInterceptor } from '../hooks/useAuthInterceptor';
import { getCurrentUser } from '../stores/auth/slice';
import MainLayout from "../components/organisms/mainLayout";
import AuthPage from "../pages/auth";
import Dashboard from "../pages/dashboard";
import Producers from "../pages/producer";
import PropertyCreate from "../pages/property";
import PropertyList from "../pages/property/list";
import PropertyDetail from "../pages/property/detail";
import AdminPage from "../pages/admin";


const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useSelector((state: RootState) => state.authReducer);

  if (!isAuthenticated) {
    return <Navigate to="/auth" />;
  }

  return <>{children}</>;
};

// Componente interno que usa o hook dentro do contexto do Router
const RouterContent = () => {
  const { isAuthenticated, user } = useSelector((state: RootState) => state.authReducer);
  const dispatch = useDispatch();

  // Ativar interceptor de autenticação dentro do contexto do Router
  useAuthInterceptor();

  // Buscar perfil do usuário se há token mas não há dados do usuário
  React.useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !user) {
      dispatch(getCurrentUser() as any);
    }
  }, [dispatch, user]);

  return (
    <Routes>
      <Route path="/auth" element={isAuthenticated ? <Navigate to="/dashboard" /> : <AuthPage />} />

      <Route element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/producers" element={<Producers />} />
        <Route path="/admin" element={<AdminPage />} />

        {/* Rotas de Propriedades */}
        <Route path="/properties" element={<PropertyList />} />
        <Route path="/properties/new" element={<PropertyCreate />} />
        <Route path="/properties/:propertyId" element={<PropertyDetail />} />
      </Route>

      <Route path="*" element={<Navigate to={isAuthenticated ? "/dashboard" : "/auth"} />} />
    </Routes>
  );
};

const AppRoutes = () => {
  return (
    <Router>
      <RouterContent />
    </Router>
  );
};

export default AppRoutes;