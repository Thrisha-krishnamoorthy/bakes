import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import ProductsPage from './components/ProductsPage';
import OrdersPage from './components/OrdersPage';
import LoginPage from './components/LoginPage';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return <LoginPage onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <Router>
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar onLogout={() => setIsAuthenticated(false)} />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Navigate to="/products" replace />} />
            <Route path="/products" element={<ProductsPage />} />
            <Route path="/orders" element={<OrdersPage />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;