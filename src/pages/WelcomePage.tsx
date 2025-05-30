import { FaInfoCircle, FaShieldAlt } from "react-icons/fa";

export default function WelcomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-white rounded-xl shadow-md p-8 space-y-6">
        <div className="text-center">
          <h1 className="text-3xl md:text-4xl font-bold text-sky-600 mb-3">
            Bienvenido al Sistema de Evaluación de Autismo
          </h1>
          <p className="text-gray-600 text-lg">
            Herramienta profesional para la detección temprana de TEA
          </p>
        </div>

        <div className="border-t border-b border-gray-200 py-5 space-y-4">
          <div className="flex items-start">
            <div className="text-sky-500 mr-3 mt-1">
              <FaInfoCircle size={20} />
            </div>
            <p className="text-gray-700">
              Este sistema le guiará a través de una evaluación cuidadosamente
              diseñada para identificar posibles indicadores de trastorno del
              espectro autista.
            </p>
          </div>

          <div className="flex items-start">
            <div className="text-sky-500 mr-3 mt-1">
              <FaShieldAlt size={20} />
            </div>
            <p className="text-gray-700">
              Todas las respuestas son confidenciales y serán utilizadas
              únicamente con fines diagnósticos.
            </p>
          </div>
        </div>
      </div>

      <footer className="mt-8 text-center text-gray-500 text-sm">
        <p>
          Sistema desarrollado por profesionales en neurodesarrollo y otras
          cosas
        </p>
      </footer>
    </div>
  );
}
