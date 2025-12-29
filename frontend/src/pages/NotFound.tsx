import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FileQuestion, Home, Search } from 'lucide-react';

const NotFound: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="text-center">
        <FileQuestion size={64} className="mx-auto text-gray-400 mb-6" />
        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">
          Página No Encontrada
        </h2>
        <p className="text-gray-600 mb-8">
          La página que buscas no existe o ha sido movida.
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={() => navigate('/')}
            className="btn btn-primary flex items-center gap-2"
          >
            <Home size={20} />
            Ir al Inicio
          </button>
          <button
            onClick={() => navigate(-1)}
            className="btn btn-outline flex items-center gap-2"
          >
            <Search size={20} />
            Regresar
          </button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;