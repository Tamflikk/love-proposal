import { useState } from 'react';
import { X, ExternalLink, Copy, Check } from 'lucide-react';

export default function CredentialsDialog({ onClose, onRedirect }) {
  const [copyStatus, setCopyStatus] = useState({
    username: false,
    password: false
  });
  
  // Blog credentials
  const credentials = {
    username: "andygandarillas@mail.com",
    password: "AndyG16"
  };
  
  // Copy to clipboard function
  const copyToClipboard = (text, field) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopyStatus(prev => ({ ...prev, [field]: true }));
      
      // Reset copy status after 2 seconds
      setTimeout(() => {
        setCopyStatus(prev => ({ ...prev, [field]: false }));
      }, 2000);
    });
  };
  
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={20} />
        </button>
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-rose-600 mb-2">¡Felicidades!</h2>
          <p className="text-gray-700">
            Has desbloqueado acceso a nuestro blog privado donde podrás encontrar más sorpresas.
          </p>
        </div>
        
        <div className="space-y-4 mb-6">
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre de usuario
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={credentials.username}
                readOnly
                className="bg-white p-2 rounded border border-gray-300 flex-1 text-gray-800"
              />
              <button
                onClick={() => copyToClipboard(credentials.username, 'username')}
                className="ml-2 p-2 text-gray-500 hover:text-rose-500"
                aria-label="Copiar nombre de usuario"
              >
                {copyStatus.username ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>
          
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Contraseña
            </label>
            <div className="flex items-center">
              <input
                type="text"
                value={credentials.password}
                readOnly
                className="bg-white p-2 rounded border border-gray-300 flex-1 text-gray-800"
              />
              <button
                onClick={() => copyToClipboard(credentials.password, 'password')}
                className="ml-2 p-2 text-gray-500 hover:text-rose-500"
                aria-label="Copiar contraseña"
              >
                {copyStatus.password ? <Check size={20} className="text-green-500" /> : <Copy size={20} />}
              </button>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-4">
            Usa estas credenciales para acceder a nuestro blog especial con todas las fotos y momentos que hemos compartido juntos.
          </p>
          
          <button
            onClick={onRedirect}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3 px-6 rounded-lg flex items-center justify-center transition-all duration-300"
          >
            Ir al blog <ExternalLink className="ml-2" size={18} />
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            Guarda estas credenciales en un lugar seguro. ¡No las compartas con nadie!
          </p>
        </div>
      </div>
    </div>
  );
}