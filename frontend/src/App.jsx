import React, { useState } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import Vendors from './pages/Vendors';
import VendorMenu from './pages/VendorMenu';
import VendorCart from './pages/VendorCart';
import AdminDashboard from './pages/AdminDashboard';
import VendorDashboard from './pages/VendorDashboard';
import AdminLogin from './pages/AdminLogin';
import VendorLogin from './pages/VendorLogin';

function AppRoutes() {
  const [adminToken, setAdminToken] = useState(localStorage.getItem('adminToken'));
  const [vendorToken, setVendorToken] = useState(localStorage.getItem('vendorToken'));
  const [vendorId, setVendorId] = useState(localStorage.getItem('vendorId'));
  const location = useLocation();

  const handleAdminLogin = (token) => {
    localStorage.setItem('adminToken', token);
    setAdminToken(token);
  };

  const handleVendorLogin = (token, id) => {
    localStorage.setItem('vendorToken', token);
    localStorage.setItem('vendorId', id);
    setVendorToken(token);
    setVendorId(id);
  };

  const handleLogout = (type) => {
    if (type === 'admin') {
      localStorage.removeItem('adminToken');
      setAdminToken(null);
    } else if (type === 'vendor') {
      localStorage.removeItem('vendorToken');
      localStorage.removeItem('vendorId');
      setVendorToken(null);
      setVendorId(null);
    }
  };

  return (
    <div key={location.pathname} className="page-fade-in">
      <Routes>
        <Route path="/vendors" element={<Vendors />} />
        <Route path="/menu/:vendorId" element={<VendorMenu />} />
        <Route path="/menu/:vendorId/cart" element={<VendorCart />} />
        <Route path="/" element={<Vendors />} />
        <Route path="/admin/login" element={<AdminLogin onLogin={handleAdminLogin} />} />
        <Route path="/admin/dashboard" element={adminToken ? <AdminDashboard token={adminToken} onLogout={() => handleLogout('admin')} /> : <AdminLogin onLogin={handleAdminLogin} />} />
        <Route path="/vendor/login" element={<VendorLogin onLogin={handleVendorLogin} />} />
        <Route path="/vendor/dashboard" element={vendorToken ? <VendorDashboard token={vendorToken} vendorId={vendorId} onLogout={() => handleLogout('vendor')} /> : <VendorLogin onLogin={handleVendorLogin} />} />
      </Routes>
    </div>
  );
}

function App() {
  const shouldUseHashRouter = process.env.REACT_APP_ROUTER_MODE === 'hash';
  const RouterComponent = shouldUseHashRouter ? HashRouter : BrowserRouter;

  return (
    <RouterComponent>
      <AppRoutes />
    </RouterComponent>
  );
}

export default App;
