import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import MainLayout from "../components/organisms/mainLayout";
import AuthPage from "../pages/auth";
import Dashboard from "../pages/dashboard";
import Producers from "../pages/producer";
import PropertyCreate from "../pages/property/";
import PropertyList from "../pages/property/list";
import PropertyDetail from "../pages/property/detail";


const AppRoutes = () => {
  return (
    <Router>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />

        <Route element={<MainLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/producers" element={<Producers />} />
          
          {/* Rotas de Propriedades */}
          <Route path="/properties" element={<PropertyList />} />
          <Route path="/properties/new" element={<PropertyCreate />} />
          <Route path="/properties/:propertyId" element={<PropertyDetail />} />

        </Route>
        
        <Route path="*" element={<Navigate to="/auth" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;