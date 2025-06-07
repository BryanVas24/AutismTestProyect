import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { SyncOutlined, EditOutlined } from "@ant-design/icons";
import {
  Table,
  Card,
  Tag,
  Spin,
  message,
  Form,
  Input,
  Button,
  Modal,
} from "antd";
const { TextArea } = Input;
import { viewTest, closeTest } from "../api/TestApi";

interface TestResultData {
  paciente: {
    iniciales: string;
    sexo: boolean;
    birthDate: string;
  };
  prediagnostico: {
    prediagnostico: string | null;
    privado: string | null;
    publico: string | null;
    veredicto: string | null;
    agendaId: number;
    testId: number;
  };
  test: {
    nombre: string;
    descripcion: string;
    sistemaPuntaje: string;
    edadMin: number;
    edadMax: number;
  };
  respuestas: Array<{
    numPregunta: number;
    pregunta: string;
    nombre: string;
    valor: number;
    tiempoRespuesta: number;
    cambios: number;
  }>;
  enlace: string;
}

const TestResultsViewer: React.FC = () => {
  const { token, agendaId, testId } = useParams<{
    token: string;
    agendaId: string;
    testId: string;
  }>();
  const [data, setData] = useState<TestResultData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<string>("");
  const [form] = Form.useForm();
  const [showDiagnosticForm, setShowDiagnosticForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isCaseClosed, setIsCaseClosed] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      if (!token) {
        throw new Error("Token is undefined");
      }
      const response = await viewTest(token.toString());

      if (response?.status) {
        setData(response.value);
        setLastUpdated(new Date().toLocaleTimeString());
        // Verificar si ya hay un prediagnóstico completo
        if (
          response.value.prediagnostico &&
          response.value.prediagnostico.veredicto
        ) {
          setIsCaseClosed(true);
        }
      } else {
        throw new Error(response?.msg || "Error al cargar los resultados");
      }
    } catch (err) {
      console.error("Error fetching test results:", err);
      setError(err instanceof Error ? err.message : "Error desconocido");
      message.error("Error al cargar los resultados");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setError("No se proporcionó un token válido");
      return;
    }

    // Cargar datos inmediatamente
    fetchData();

    // Configurar intervalo de actualización cada 15 segundos
    const intervalId = setInterval(fetchData, 15000);

    // Limpiar intervalo al desmontar el componente
    return () => clearInterval(intervalId);
  }, [token]);

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

  const handleSubmitDiagnostic = async (values: {
    prediagnostico: string;
    privado: string;
    publico: string;
    veredicto: string;
  }) => {
    try {
      setSubmitting(true);
      if (!token || !data) return;

      const diagnosticData = {
        prediagnostico: values.prediagnostico,
        privado: values.privado,
        publico: values.publico,
        veredicto: values.veredicto,
        agendaId: agendaId ? parseInt(agendaId) : 1,
        testId: testId ? parseInt(testId) : 1,
      };

      const response = await closeTest({
        diagnostico: diagnosticData,
        enlace: token,
      });

      if (response?.status) {
        message.success("Caso cerrado exitosamente");
        setShowDiagnosticForm(false);
        setIsCaseClosed(true);
        fetchData(); // Refrescar los datos
      } else {
        throw new Error(response?.data?.msg || "Error al cerrar el caso");
      }
    } catch (err) {
      console.error("Error al cerrar el caso:", err);
      message.error(
        err instanceof Error ? err.message : "Error al cerrar el caso"
      );
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    {
      title: "#",
      dataIndex: "numPregunta",
      key: "numPregunta",
      width: 50,
    },
    {
      title: "Pregunta",
      dataIndex: "pregunta",
      key: "pregunta",
    },
    {
      title: "Respuesta",
      dataIndex: "nombre",
      key: "nombre",
      render: (text: string, record: any) => (
        <Tag color={record.valor > 0 ? "red" : "green"}>{text}</Tag>
      ),
    },
    {
      title: "Puntos",
      dataIndex: "valor",
      key: "valor",
      width: 80,
    },
    {
      title: "Tiempo (s)",
      dataIndex: "tiempoRespuesta",
      key: "tiempoRespuesta",
      width: 100,
    },
    {
      title: "Cambios",
      dataIndex: "cambios",
      key: "cambios",
      width: 100,
    },
  ];

  if (error) {
    return (
      <div className="text-center py-8 text-red-500">
        <p>{error}</p>
      </div>
    );
  }

  if (!data && loading) {
    return (
      <div className="text-center py-8">
        <Spin size="large" />
        <p>Cargando resultados...</p>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center py-8">
        <p>No se encontraron resultados</p>
      </div>
    );
  }

  const age = calculateAge(data.paciente.birthDate);
  const gender = data.paciente.sexo ? "Masculino" : "Femenino";

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold text-gray-800">
          Resultados de la Prueba en Tiempo Real
        </h1>
        <div className="flex items-center text-sm text-gray-500">
          <SyncOutlined spin className="mr-1" />
          <span>Última actualización: {lastUpdated}</span>
        </div>
      </div>

      {/* Información del paciente */}
      <Card title="Información del Paciente" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="font-semibold">Iniciales</p>
            <p>{data.paciente.iniciales}</p>
          </div>
          <div>
            <p className="font-semibold">Edad</p>
            <p>{age} años</p>
          </div>
          <div>
            <p className="font-semibold">Género</p>
            <p>{gender}</p>
          </div>
        </div>
      </Card>

      {/* Información de la prueba */}
      <Card title="Información de la Prueba" className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <p className="font-semibold">Nombre</p>
            <p>{data.test.nombre}</p>
          </div>
          <div>
            <p className="font-semibold">Descripción</p>
            <p>{data.test.descripcion}</p>
          </div>
          <div>
            <p className="font-semibold">Sistema de Puntaje</p>
            <p>{data.test.sistemaPuntaje}</p>
          </div>
          <div>
            <p className="font-semibold">Rango de Edad</p>
            <p>
              {data.test.edadMin} - {data.test.edadMax} años
            </p>
          </div>
        </div>
      </Card>

      {/* Prediagnóstico */}
      <Card
        title={
          <div className="flex justify-between items-center">
            <span>Prediagnóstico</span>
            {!isCaseClosed && (
              <Button
                type="primary"
                icon={<EditOutlined />}
                onClick={() => setShowDiagnosticForm(true)}
              >
                Completar Diagnóstico
              </Button>
            )}
          </div>
        }
        className="mb-6"
      >
        {data.prediagnostico ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="font-semibold">Público</p>
              <p>{data.prediagnostico.publico || "No disponible"}</p>
            </div>
            <div>
              <p className="font-semibold">Privado</p>
              <p>{data.prediagnostico.privado || "No disponible"}</p>
            </div>
            <div>
              <p className="font-semibold">Veredicto</p>
              <p>{data.prediagnostico.veredicto || "No disponible"}</p>
            </div>
          </div>
        ) : (
          <p>No se ha realizado un diagnóstico aún</p>
        )}
      </Card>

      {/* Respuestas del paciente */}
      <Card title="Respuestas del Paciente">
        <Table
          columns={columns}
          dataSource={data.respuestas}
          rowKey="numPregunta"
          pagination={false}
          loading={loading}
          scroll={{ x: true }}
        />
      </Card>

      <div className="mt-4 text-sm text-gray-500">
        <p>Token de enlace: {data.enlace}</p>
      </div>

      {/* Modal del formulario de diagnóstico */}
      <Modal
        title="Completar Diagnóstico y Cerrar Caso"
        visible={showDiagnosticForm}
        onCancel={() => setShowDiagnosticForm(false)}
        footer={null}
        width={800}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmitDiagnostic}
          initialValues={{
            prediagnostico: data.prediagnostico?.prediagnostico || "",
            privado: data.prediagnostico?.privado || "",
            publico: data.prediagnostico?.publico || "",
            veredicto: data.prediagnostico?.veredicto || "",
          }}
        >
          <Form.Item
            name="prediagnostico"
            label="Prediagnóstico (Interno)"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el prediagnóstico",
              },
            ]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="privado"
            label="Notas Privadas"
            rules={[
              {
                required: true,
                message: "Por favor ingrese las notas privadas",
              },
            ]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="publico"
            label="Diagnóstico Público"
            rules={[
              {
                required: true,
                message: "Por favor ingrese el diagnóstico público",
              },
            ]}
          >
            <TextArea rows={3} />
          </Form.Item>

          <Form.Item
            name="veredicto"
            label="Veredicto Final"
            rules={[
              { required: true, message: "Por favor ingrese el veredicto" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item>
            <div className="flex justify-end space-x-4">
              <Button onClick={() => setShowDiagnosticForm(false)}>
                Cancelar
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={submitting}
                disabled={isCaseClosed}
              >
                Cerrar Caso
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default TestResultsViewer;
