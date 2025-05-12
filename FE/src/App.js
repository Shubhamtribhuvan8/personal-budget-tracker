import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import LoginForm from './pages/LoginForm';
import SignupForm from './pages/SignupForm';
import ProtectedRoute from './pages/ProtectedRoute';
import Dashboard from './app/dashboard/page';
import TransactionsPage from './app/dashboard/transactions/page';
import BudgetPage from './app/dashboard/budget/page';
import { SidebarProvider } from './components/ui/sidebar';
import { AppSidebar } from './components/app-sidebar';
import ReportsPage from './app/dashboard/reports/page';
import CategoriesPage from './app/dashboard/categories/page';
import SettingsPage from './app/dashboard/settings/page';

const App = () => {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<LoginForm />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route
            path="/dashboard/*"
            element={
              <ProtectedRoute>
                <SidebarProvider>
                  <div className="flex min-h-screen">
                    <AppSidebar />
                    <div className="flex-1">
                      <Routes>
                        <Route path="/" element={<Dashboard />} />
                        <Route path="/transactions" element={<TransactionsPage />} />
                        <Route path="/budget" element={<BudgetPage />} />
                        <Route path="/reports" element={<ReportsPage />} />
                        <Route path="/categories" element={<CategoriesPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                      </Routes>
                    </div>
                  </div>
                </SidebarProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
};

export default App;
