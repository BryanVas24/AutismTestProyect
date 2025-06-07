import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  UserOutlined,
  FileTextOutlined,
  CopyOutlined,
  CheckOutlined,
} from "@ant-design/icons";
import { getAgendaById } from "../api/AgendaModuleApi";
import { getPacienteById } from "../api/PacientesAPI";
import { createPrueba } from "../api/PruebaTestAPI";
import { listTest } from "../api/TestApi";

interface PacienteData {
  id: number;
  iniciales: string;
  sexo: boolean;
  birthdate: string;
  telefono: string;
  correo: string;
  residencia: string;
  representantes: Array<{
    nombre: string;
    apellido: string;
    afinidad: string;
  }>;
}

interface Test {
  id: number;
  nombre: string;
  descripcion: string;
  sistema_puntaje: string;
  edad_min: number;
  edad_max: number;
  preguntas: Array<{
    pregunta: string;
    puntajepregs: Array<{
      nombre: string;
      valor: number;
    }>;
  }>;
}

const TestCreator: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [paciente, setPaciente] = useState<PacienteData | null>(null);
  const [tests, setTests] = useState<Test[]>([]);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [generatedUrl, setGeneratedUrl] = useState<string | null>(null);
  const [visualizadorUrl, setVisualizadorUrl] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const agendaResponse = await getAgendaById(Number(id));
        if (!agendaResponse?.value) {
          throw new Error("No se encontró la agenda");
        }

        const pacienteId = agendaResponse.value.pacienteId;
        const pacienteResponse = await getPacienteById(pacienteId);
        if (!pacienteResponse?.value) {
          throw new Error("No se encontró el paciente");
        }
        setPaciente(pacienteResponse.value);

        const testsResponse = await listTest();
        if (!testsResponse?.value) {
          throw new Error("No se pudieron cargar los tests");
        }
        setTests(testsResponse.value);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDateObj.getDate())
    ) {
      age--;
    }

    return age;
  };

  const handleTestSelect = (testId: number) => {
    const test = tests.find((t) => t.id === testId) || null;
    setSelectedTest(test);
  };

  const handleCreateTest = async () => {
    if (!paciente || !selectedTest) return;

    try {
      setError(null);
      setSuccessMessage(null);
      setGeneratedUrl(null);

      const testData = {
        paciente: {
          iniciales: paciente.iniciales,
          sexo: paciente.sexo,
          birthDate: paciente.birthdate,
        },
        test: {
          nombre: selectedTest.nombre,
          descripcion: selectedTest.descripcion,
          sistemaPuntaje: selectedTest.sistema_puntaje,
          edadMin: selectedTest.edad_min,
          edadMax: selectedTest.edad_max,
        },
      };

      const response = await createPrueba(testData);
      if (response?.response.status) {
        const token = response?.response.value;
        const testId = selectedTest.id;
        const url = `${window.location.origin}/prueba-autismo?enlace=${token}&testId=${testId}`;
        const urlVisualizador = `${window.location.origin}/sistem/test-result/${token}/${id}/${testId}`;
        setGeneratedUrl(url);
        setVisualizadorUrl(urlVisualizador);
        setSuccessMessage("Prueba creada exitosamente");
        navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 3000);
      } else {
        throw new Error(response?.data?.msg || "Error al crear la prueba");
      }
    } catch (err) {
      console.error("Error creating test:", err);
      setError(err instanceof Error ? err.message : "Error al crear la prueba");
    }
  };

  const copyToClipboard = () => {
    if (!generatedUrl) return;
    navigator.clipboard.writeText(generatedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (loading) return <div className="text-center py-8">Cargando...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (!paciente)
    return <div className="text-center py-8">No se encontró el paciente</div>;

  const age = calculateAge(paciente.birthdate);
  const gender = paciente.sexo ? "Masculino" : "Femenino";

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        Iniciar Prediagnóstico
      </h1>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex items-center space-x-4 mb-4">
          <div className="bg-blue-100 p-3 rounded-full">
            <UserOutlined className="text-blue-600 text-xl" />
          </div>
          <div>
            <h2 className="text-xl font-semibold">{paciente.iniciales}</h2>
            <p className="text-gray-600">
              {age} años • {gender}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-medium text-gray-700">Contacto</h3>
            <p className="text-gray-600">{paciente.telefono}</p>
            <p className="text-gray-600">{paciente.correo}</p>
          </div>
          <div>
            <h3 className="font-medium text-gray-700">Residencia</h3>
            <p className="text-gray-600">{paciente.residencia}</p>
          </div>
        </div>

        {paciente.representantes.length > 0 && (
          <div className="mt-4">
            <h3 className="font-medium text-gray-700">Representante</h3>
            {paciente.representantes.map((rep, index) => (
              <p key={index} className="text-gray-600">
                {rep.nombre} {rep.apellido} ({rep.afinidad})
              </p>
            ))}
          </div>
        )}
      </div>
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Seleccionar Test</h2>

        <select
          className="w-full p-3 border border-gray-300 rounded-lg mb-4"
          onChange={(e) => handleTestSelect(Number(e.target.value))}
          value={selectedTest?.id || ""}
        >
          <option value="">Seleccione un test...</option>
          {tests.map((test) => (
            <option key={test.id} value={test.id}>
              {test.nombre} (Edad: {test.edad_min}-{test.edad_max} años)
            </option>
          ))}
        </select>

        {selectedTest && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <div className="flex items-start space-x-3">
              <div className="bg-blue-100 p-2 rounded-lg">
                <FileTextOutlined className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{selectedTest.nombre}</h3>
                <p className="text-gray-600 mb-2">{selectedTest.descripcion}</p>
                <p className="text-sm text-gray-500">
                  Sistema de puntaje: {selectedTest.sistema_puntaje}
                </p>
                <p className="text-sm text-gray-500">
                  Rango de edad: {selectedTest.edad_min} -{" "}
                  {selectedTest.edad_max} años
                </p>

                <div className="mt-4">
                  <h4 className="font-medium mb-2">Preguntas del test:</h4>
                  <ul className="space-y-3">
                    {selectedTest.preguntas.map((pregunta, idx) => (
                      <li key={idx} className="text-gray-700">
                        <p className="font-medium">{pregunta.pregunta}</p>
                        {pregunta.puntajepregs.length > 0 && (
                          <ul className="ml-4 mt-1 space-y-1">
                            {pregunta.puntajepregs.map((opcion, opIdx) => (
                              <li key={opIdx} className="text-sm text-gray-600">
                                • {opcion.nombre} (Puntos: {opcion.valor})
                              </li>
                            ))}
                          </ul>
                        )}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {successMessage && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <p className="text-green-800 font-medium">{successMessage}</p>
          {generatedUrl && (
            <div className="mt-3">
              <div className="flex items-center">
                <input
                  type="text"
                  value={generatedUrl}
                  readOnly
                  className="flex-1 p-2 border border-gray-300 rounded-l-lg text-sm"
                  onClick={(e) => (e.target as HTMLInputElement).select()}
                />
                <button
                  onClick={copyToClipboard}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg flex items-center"
                >
                  {copied ? (
                    <>
                      <CheckOutlined className="mr-2" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <CopyOutlined className="mr-2" />
                      Copiar
                    </>
                  )}
                </button>
              </div>
              <p className="text-sm text-gray-600 mt-2">
                Comparte este enlace con el paciente para que complete la prueba
              </p>
            </div>
          )}
        </div>
      )}

      <div className="text-center">
        <button
          onClick={handleCreateTest}
          disabled={!selectedTest || !!generatedUrl}
          className={`px-6 py-3 rounded-lg font-medium ${
            !selectedTest
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : generatedUrl
              ? "bg-green-500 text-white cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {generatedUrl ? "Prueba Creada" : "Crear Prueba"}
        </button>

        {/* Botón para redirigir al visualizador */}
        {visualizadorUrl && (
          <div className="mt-4">
            <button
              onClick={() => window.open(visualizadorUrl, "_blank")}
              className="px-6 py-3 rounded-lg font-medium bg-blue-600 text-white hover:bg-blue-700"
            >
              Ir al Visualizador de la Prueba
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestCreator;
