import { useState, useEffect, useRef } from 'react';
import { X, ExternalLink, Copy, Check, Heart } from 'lucide-react';

export default function CredentialsDialog({ onClose, onRedirect }) {
  const [copyStatus, setCopyStatus] = useState({
    username: false,
    password: false
  });
  
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const [showCredentials, setShowCredentials] = useState(false);
  
  const fullText = "Me has hecho el hombre más afortunado del mundo con tu respuesta. He creado un espacio especial donde guardaremos recuerdos, compartiremos notas de amor y crearemos nuestro álbum de fotos juntos.";
  const typingSpeed = 30; // milisegundos por caracter
  
  // Blog credentials
  const credentials = {
    username: "andygandarillas@mail.com",
    password: "AndyG16"
  };
  
  // Referencia para hacer scroll al contenedor
  const containerRef = useRef(null);
  
  // Efecto de escritura de texto
  useEffect(() => {
    if (displayedText.length < fullText.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(fullText.substring(0, displayedText.length + 1));
      }, typingSpeed);
      return () => clearTimeout(timeout);
    } else {
      setIsTypingComplete(true);
      const timeout = setTimeout(() => {
        setShowCredentials(true);
      }, 500);
      return () => clearTimeout(timeout);
    }
  }, [displayedText]);
  
  // Efecto para hacer scroll automático mientras se escribe
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [displayedText]);
  
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
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b relative flex items-center justify-center">
          <Heart className="text-rose-600 fill-rose-600 mr-2" size={24} />
          <h2 className="text-xl font-bold text-rose-600">¡Estoy tan feliz!</h2>
          <button
            onClick={onClose}
            className="absolute right-4 text-gray-500 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>
        
        {/* Body - scrollable if needed */}
        <div ref={containerRef} className="p-4 overflow-y-auto flex-grow">
          <div className="mb-4">
            <p className="text-gray-700">
              {displayedText}
              {displayedText.length < fullText.length && 
                <span className="inline-block w-2 h-4 bg-rose-500 ml-1 animate-pulse"></span>
              }
            </p>
          </div>
          
          {showCredentials && (
            <div className="space-y-3 mt-4 animate-fadeIn">
              <p className="text-sm font-medium text-gray-800">
                Accede a nuestro rincón especial con:
              </p>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Usuario
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={credentials.username}
                    readOnly
                    className="bg-white p-2 text-sm rounded border border-gray-300 flex-1 text-gray-800"
                  />
                  <button
                    onClick={() => copyToClipboard(credentials.username, 'username')}
                    className="ml-2 p-1 text-gray-500 hover:text-rose-500"
                  >
                    {copyStatus.username ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  Contraseña
                </label>
                <div className="flex items-center">
                  <input
                    type="text"
                    value={credentials.password}
                    readOnly
                    className="bg-white p-2 text-sm rounded border border-gray-300 flex-1 text-gray-800"
                  />
                  <button
                    onClick={() => copyToClipboard(credentials.password, 'password')}
                    className="ml-2 p-1 text-gray-500 hover:text-rose-500"
                  >
                    {copyStatus.password ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="border-t p-4">
          <button
            onClick={onRedirect}
            className="w-full bg-rose-500 hover:bg-rose-600 text-white font-medium py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-300"
            disabled={!isTypingComplete}
          >
            Descubrir nuestro espacio <ExternalLink className="ml-2" size={16} />
          </button>
          
          <p className="text-xs text-gray-500 mt-2 text-center">
            Nuestro pequeño secreto ♡
          </p>
        </div>
      </div>
    </div>
  );
}