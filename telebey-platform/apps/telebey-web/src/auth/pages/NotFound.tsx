
import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, ArrowLeft } from 'lucide-react';
import VerificatieLogo from '@/auth/components/verificatie-logo';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-50">
      <header className="w-full bg-white shadow-sm py-4">
        <div className="container flex justify-between items-center">
          <VerificatieLogo />
          <div className="flex items-center gap-4">
            <Link to="/login" className="text-sm font-medium text-verificatie-600 hover:text-verificatie-800 verificatie-transition">
              Sign in
            </Link>
            <Link to="/register" className="text-sm font-medium text-verificatie-600 hover:text-verificatie-800 verificatie-transition">
              Create account
            </Link>
          </div>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="max-w-lg w-full text-center">
          <div className="mx-auto w-24 h-24 bg-verificatie-100 rounded-full flex items-center justify-center mb-6">
            <Shield className="h-12 w-12 text-verificatie-600" />
          </div>
          <h1 className="text-5xl font-bold text-verificatie-900 mb-4">404</h1>
          <h2 className="text-2xl font-medium text-gray-700 mb-6">Page not found</h2>
          <p className="text-gray-500 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <Link 
            to="/" 
            className="inline-flex items-center px-5 py-2.5 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-verificatie-600 hover:bg-verificatie-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-verificatie-500 verificatie-transition"
          >
            <ArrowLeft className="mr-2 h-5 w-5" /> Go back home
          </Link>
        </div>
      </main>
      
      <footer className="bg-white py-6 border-t">
        <div className="container">
          <p className="text-center text-sm text-gray-500">
            © {new Date().getFullYear()} Verificatie.nl. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default NotFound;
