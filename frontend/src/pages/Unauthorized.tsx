import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Home } from 'lucide-react';

const Unauthorized: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <Shield size={64} className="mx-auto text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Acceso No Autorizado
        </h1>
        <p className="text-gray-600 mb-8">
          No tienes permisos para acceder a esta página.
        </p>
        <button
          onClick={() => navigate('/')}
          className="btn btn-primary flex items-center gap-2 mx-auto"
        >
          <Home size={20} />
          Volver al Inicio
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;