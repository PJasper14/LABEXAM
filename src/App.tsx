import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import './App.css';

// Context providers
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CartProvider } from './contexts/CartContext';

// Common components
import NavigationBar from './components/common/Navbar';
import Footer from './components/common/Footer';

// Customer components
import HomePage from './components/customer/HomePage';
import ProductCatalog from './components/customer/ProductCatalog';
import ProductDetail from './components/customer/ProductDetail';
import ShoppingCart from './components/customer/ShoppingCart';
import Checkout from './components/customer/Checkout';
import OrderConfirmation from './components/customer/OrderConfirmation';
import Login from './components/customer/Login';
import Register from './components/customer/Register';

// Admin components
import AdminDashboard from './components/admin/AdminDashboard';
import ProductManagement from './components/admin/ProductManagement';
import ProductForm from './components/admin/ProductForm';
import OrderManagement from './components/admin/OrderManagement';
import OrderDetail from './components/admin/OrderDetail';

// Route Guards
const AdminRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (!isAdmin) {
    // Redirect to home if authenticated but not admin
    return <Navigate to="/" replace />;
  }
  
  return element;
};

const CustomerRoute: React.FC<{ element: React.ReactElement }> = ({ element }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  
  if (!isAuthenticated) {
    // Redirect to login if not authenticated
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  if (isAdmin) {
    // Redirect to admin dashboard if admin tries to access customer routes
    return <Navigate to="/admin/dashboard" replace />;
  }
  
  return element;
};

// Route Redirector for admin users
const RouteRedirector: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isAdmin } = useAuth();
  const location = useLocation();
  
  useEffect(() => {
    // If admin tries to access the home or products page directly, redirect to admin dashboard
    if (isAuthenticated && isAdmin) {
      if (location.pathname === '/' || location.pathname === '/products') {
        window.location.href = '/admin/dashboard';
      }
    }
  }, [location.pathname, isAuthenticated, isAdmin]);
  
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<HomePage />} />
      <Route path="/products" element={<ProductCatalog />} />
      <Route path="/products/:id" element={<ProductDetail />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      
      {/* Customer routes (require customer authentication) */}
      <Route path="/cart" element={<CustomerRoute element={<ShoppingCart />} />} />
      <Route path="/checkout" element={<CustomerRoute element={<Checkout />} />} />
      <Route path="/order-confirmation" element={<CustomerRoute element={<OrderConfirmation />} />} />
      
      {/* Admin routes (require admin authentication) */}
      <Route path="/admin/dashboard" element={<AdminRoute element={<AdminDashboard />} />} />
      <Route path="/admin/products" element={<AdminRoute element={<ProductManagement />} />} />
      <Route path="/admin/products/new" element={<AdminRoute element={<ProductForm />} />} />
      <Route path="/admin/products/edit/:id" element={<AdminRoute element={<ProductForm />} />} />
      <Route path="/admin/orders" element={<AdminRoute element={<OrderManagement />} />} />
      <Route path="/admin/orders/:id" element={<AdminRoute element={<OrderDetail />} />} />
      
      {/* Fallback route */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <div className="d-flex flex-column min-vh-100">
            <NavigationBar />
            
            <main className="flex-grow-1">
              <RouteRedirector>
                <AppRoutes />
              </RouteRedirector>
            </main>
            
            <Footer />
          </div>
        </Router>
      </CartProvider>
    </AuthProvider>
  );
};

export default App;
