import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { imagenes } from "../data/images";
import { getTest, sendAnswer } from "../api/TestApi";
import { iniciarTour } from "../utils/tour";
import type {
  RespuestaGuardada,
  TestData,
  Pregunta,
  PuntajePreg,
} from "../types/PruebaTest";
import {
  Card,
  Button,
  Progress,
  Typography,
  Image,
  Row,
  Col,
  message,
  Spin,
} from "antd";
import WelcomeScreen from "../components/prueba/WelcomeScreen";
import CompletionScreen from "../components/prueba/CompletionScreen";
import { QuestionControls } from "../components/prueba/QuestionControls";
import {
  enviarTestData,
  mapTestData,
} from "../components/prueba/hooks/mapperData";
const { Title } = Typography;
const PruebaAutismo: React.FC = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const enlace = queryParams.get("enlace");
  const testId = queryParams.get("testId");
  const [respuestas, setRespuestas] = useState<RespuestaGuardada[]>([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [testData, setTestData] = useState<TestData | null>(null);
  const [valorSeleccionado, setValorSeleccionado] = useState<number | null>(
    null
  );
  const [testStarted, setTestStarted] = useState<boolean>(false);
  const [testCompleted, setTestCompleted] = useState<boolean>(false);
  const [imagenActual, setImagenActual] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [sending, setSending] = useState<boolean>(false);
  const [tiemposInicio, setTiemposInicio] = useState<{ [key: number]: number }>(
    {}
  );
  const [contadorCambios, setContadorCambios] = useState<{
    [key: number]: number;
  }>({});

  const cargarTestData = async () => {
    try {
      setLoading(true);
      const data = await getTest({ id: testId?.toString() || "" });

      if (data?.status) {
        const mappedData = mapTestData(data);
        setTestData(mappedData);
        const initialTimes: { [key: number]: number } = {};
        const initialCounters: { [key: number]: number } = {};

        mappedData.preguntas.forEach((preg) => {
          initialTimes[preg.Id] = 0;
          initialCounters[preg.Id] = 0;
        });

        setTiemposInicio(initialTimes);
        setContadorCambios(initialCounters);
      } else {
        throw new Error(data?.data?.msg || "No se pudo cargar el test");
      }
    } catch (err) {
      message.error(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };
  const seleccionarImagenAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * imagenes.length);
    setImagenActual(imagenes[indiceAleatorio]);
  };
  useEffect(() => {
    if (!testData) return;

    const preguntaId = testData.preguntas[preguntaActual].Id;
    setTiemposInicio((prev) => ({
      ...prev,
      [preguntaId]: Date.now(),
    }));
  }, [preguntaActual, testData]);
  useEffect(() => {
    seleccionarImagenAleatoria();
    cargarTestData();
  }, []);
  useEffect(() => {
    if (!testData) return;

    const respuestaExistente = respuestas.find(
      (r) => r.preguntaId === testData.preguntas[preguntaActual].Id
    );

    setValorSeleccionado(
      respuestaExistente ? respuestaExistente.puntajePregId : null
    );
  }, [preguntaActual, respuestas, testData]);

  const manejarCambioRespuesta = (e: any) => {
    const nuevoValor = Number(e.target.value);

    if (!testData) return;

    const preguntaId = testData.preguntas[preguntaActual].Id;
    if (valorSeleccionado !== nuevoValor) {
      setContadorCambios((prev) => ({
        ...prev,
        [preguntaId]: (prev[preguntaId] || 0) + 1,
      }));
    }

    setValorSeleccionado(nuevoValor);
  };

  const enviarRespuesta = async (
    pregunta: Pregunta,
    puntaje: PuntajePreg
  ): Promise<boolean> => {
    if (!testData) return false;
    const respuestaBackend = enviarTestData(
      pregunta,
      puntaje,
      tiemposInicio,
      contadorCambios
    );
    try {
      setSending(true);
      const response = await sendAnswer({
        respuesta: respuestaBackend,
        enlace: enlace || "",
      });

      if (response?.data?.status) {
        setContadorCambios((prev) => ({
          ...prev,
          [pregunta.Id]: 0,
        }));
        return true;
      } else {
        throw new Error(response?.data?.msg || "Error al guardar respuesta");
      }
    } catch (err) {
      message.error(
        err instanceof Error ? err.message : "Error al guardar respuesta"
      );
      return false;
    } finally {
      setSending(false);
    }
  };

  const siguientePregunta = async () => {
    if (valorSeleccionado === null || !testData || sending) return;

    const pregunta = testData.preguntas[preguntaActual];
    const puntajeSeleccionado = pregunta.puntajepregs.find(
      (p) => p.Id === valorSeleccionado
    );

    if (!puntajeSeleccionado) return;
    const enviado = await enviarRespuesta(pregunta, puntajeSeleccionado);

    if (enviado) {
      const nuevasRespuestas = [
        ...respuestas.filter((r) => r.preguntaId !== pregunta.Id),
        {
          preguntaId: pregunta.Id,
          puntajePregId: puntajeSeleccionado.Id,
          valor: puntajeSeleccionado.valor,
        },
      ];
      setRespuestas(nuevasRespuestas);

      if (preguntaActual < testData.preguntas.length - 1) {
        setPreguntaActual(preguntaActual + 1);
        seleccionarImagenAleatoria();
      } else {
        message.success("Test completado con éxito");
        setTestCompleted(true);
      }
    }
  };

  const preguntaAnterior = () => {
    if (preguntaActual > 0 && !sending) {
      setPreguntaActual(preguntaActual - 1);
      seleccionarImagenAleatoria();
    }
  };

  const progreso = testData
    ? Math.round(
        ((preguntaActual + (valorSeleccionado !== null ? 1 : 0)) /
          testData.preguntas.length) *
          100
      )
    : 0;

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
        }}
      >
        <Spin size="large" tip="Cargando test..." />
      </div>
    );
  }

  if (!testData) {
    return (
      <Card style={{ maxWidth: 600, margin: "0 auto", textAlign: "center" }}>
        <Title level={4}>Error al cargar el test</Title>
        <Button type="primary" onClick={cargarTestData}>
          Reintentar
        </Button>
      </Card>
    );
  }
  const reiniciarTest = () => {
    setTestStarted(false);
    setTestCompleted(false);
    setPreguntaActual(0);
    setRespuestas([]);
    setValorSeleccionado(null);
    seleccionarImagenAleatoria();
  };

  if (testCompleted) {
    return <CompletionScreen onReturn={reiniciarTest} />;
  }

  if (!testStarted) {
    return <WelcomeScreen onStartTest={() => setTestStarted(true)} />;
  }

  return (
    <Card
      title={`${testData.nombre} - Pregunta ${preguntaActual + 1} de ${
        testData.preguntas.length
      }`}
      style={{ maxWidth: 600, margin: "0 auto" }}
      headStyle={{
        backgroundColor: "#f0f5ff",
        borderBottom: "1px solid #d9d9d9",
        textAlign: "center",
      }}
    >
      <Progress percent={progreso} status="active" showInfo={false} />

      <Row justify="center" style={{ marginTop: 20 }}>
        <Col span={24} style={{ textAlign: "center" }}>
          <Image
            src={imagenActual}
            alt="Imagen ilustrativa"
            width={200}
            height={150}
            style={{
              borderRadius: 8,
              objectFit: "cover",
              marginBottom: 24,
            }}
            preview={false}
          />
        </Col>
      </Row>

      <QuestionControls
        questionText={testData.preguntas[preguntaActual].pregunta}
        options={testData.preguntas[preguntaActual].puntajepregs}
        selectedValue={valorSeleccionado}
        onAnswerChange={manejarCambioRespuesta}
        onPrevious={preguntaAnterior}
        onNext={siguientePregunta}
        currentQuestion={preguntaActual}
        totalQuestions={testData.preguntas.length}
        isPreviousDisabled={preguntaActual === 0}
        isNextDisabled={valorSeleccionado === null}
        isLoading={sending}
        onHelp={iniciarTour}
      />
    </Card>
  );
};

export default PruebaAutismo;
