import React, { useState, useEffect } from "react";
import {
  Card,
  Radio,
  Button,
  Progress,
  Space,
  Typography,
  Image,
  Row,
  Col,
} from "antd";

const { Title, Text } = Typography;

interface PuntajePreg {
  Id: number;
  nombre: string;
  valor: number;
  preguntaId: number;
}

interface Pregunta {
  Id: number;
  pregunta: string;
  num_pregunta: number;
  testId: number;
  puntajepregs: PuntajePreg[];
}

interface TestData {
  Id: number;
  nombre: string;
  descripción: string;
  sistema_puntaje: string;
  edad_min: number;
  edad_max: number;
  preguntas: Pregunta[];
}

const imagenes = [
  "https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/40c29799-f440-4229-91bd-fa98f0f6d754-removebg-preview.png",
  "https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/6d386288-fc44-4e58-b846-653dcee4883b-removebg-preview.png",
  "https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/bac57898-be5b-43be-a5b9-8900659ea318-removebg-preview.png",
  "https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/bca39149-74d2-4342-a1c6-a7fc1fb54503-removebg-preview.png",
  "https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/c61579c0-433a-46a7-aae1-c88e4c7ca00c-removebg-preview.png",
];

const testData: TestData = {
  Id: 1,
  nombre: "Prueba de Autismo",
  descripción: "Evaluación inicial para detección de rasgos autistas",
  sistema_puntaje: "Puntaje acumulativo",
  edad_min: 3,
  edad_max: 12,
  preguntas: [
    {
      Id: 1,
      pregunta: "¿Le gusta jugar con otros niños?",
      num_pregunta: 1,
      testId: 1,
      puntajepregs: [
        { Id: 1, nombre: "Sí, siempre", valor: 0, preguntaId: 1 },
        { Id: 2, nombre: "A veces", valor: 1, preguntaId: 1 },
        { Id: 3, nombre: "Rara vez", valor: 2, preguntaId: 1 },
        { Id: 4, nombre: "Nunca", valor: 3, preguntaId: 1 },
      ],
    },
    {
      Id: 2,
      pregunta: "¿Muestra interés por las actividades sociales?",
      num_pregunta: 2,
      testId: 1,
      puntajepregs: [
        { Id: 5, nombre: "Sí, mucho", valor: 0, preguntaId: 2 },
        { Id: 6, nombre: "Algo", valor: 1, preguntaId: 2 },
        { Id: 7, nombre: "Poco", valor: 2, preguntaId: 2 },
      ],
    },
    {
      Id: 3,
      pregunta: "¿Le resulta fácil hacer nuevos amigos?",
      num_pregunta: 3,
      testId: 1,
      puntajepregs: [
        { Id: 8, nombre: "Sí, con facilidad", valor: 0, preguntaId: 3 },
        { Id: 9, nombre: "A veces", valor: 1, preguntaId: 3 },
        { Id: 10, nombre: "Con dificultad", valor: 2, preguntaId: 3 },
      ],
    },
    {
      Id: 4,
      pregunta: "¿Participa en juegos grupales sin problemas?",
      num_pregunta: 4,
      testId: 1,
      puntajepregs: [
        { Id: 11, nombre: "Sí, siempre", valor: 0, preguntaId: 4 },
        { Id: 12, nombre: "A veces", valor: 1, preguntaId: 4 },
        { Id: 13, nombre: "Rara vez", valor: 2, preguntaId: 4 },
        { Id: 14, nombre: "Nunca", valor: 3, preguntaId: 4 },
      ],
    },
    {
      Id: 5,
      pregunta: "¿Sigue instrucciones cuando se le indican?",
      num_pregunta: 5,
      testId: 1,
      puntajepregs: [
        { Id: 15, nombre: "Sí, siempre", valor: 0, preguntaId: 5 },
        { Id: 16, nombre: "La mayoría de las veces", valor: 1, preguntaId: 5 },
        { Id: 17, nombre: "Pocas veces", valor: 2, preguntaId: 5 },
        { Id: 18, nombre: "Nunca", valor: 3, preguntaId: 5 },
      ],
    },
    {
      Id: 6,
      pregunta: "¿Se muestra cooperativo con adultos y compañeros?",
      num_pregunta: 6,
      testId: 1,
      puntajepregs: [
        { Id: 19, nombre: "Sí, siempre", valor: 0, preguntaId: 6 },
        { Id: 20, nombre: "A veces", valor: 1, preguntaId: 6 },
        { Id: 21, nombre: "Rara vez", valor: 2, preguntaId: 6 },
      ],
    },
    {
      Id: 7,
      pregunta: "¿Manifiesta emociones de forma adecuada?",
      num_pregunta: 7,
      testId: 1,
      puntajepregs: [
        { Id: 22, nombre: "Sí, siempre", valor: 0, preguntaId: 7 },
        { Id: 23, nombre: "A veces", valor: 1, preguntaId: 7 },
        { Id: 24, nombre: "Con dificultad", valor: 2, preguntaId: 7 },
      ],
    },
    {
      Id: 8,
      pregunta: "¿Tolera la frustración cuando algo no sale como espera?",
      num_pregunta: 8,
      testId: 1,
      puntajepregs: [
        { Id: 25, nombre: "Sí, sin problema", valor: 0, preguntaId: 8 },
        { Id: 26, nombre: "A veces", valor: 1, preguntaId: 8 },
        { Id: 27, nombre: "No, le cuesta mucho", valor: 2, preguntaId: 8 },
      ],
    },
    {
      Id: 9,
      pregunta: "¿Respeta turnos para hablar o jugar?",
      num_pregunta: 9,
      testId: 1,
      puntajepregs: [
        { Id: 28, nombre: "Sí, siempre", valor: 0, preguntaId: 9 },
        { Id: 29, nombre: "A veces", valor: 1, preguntaId: 9 },
        { Id: 30, nombre: "Rara vez", valor: 2, preguntaId: 9 },
      ],
    },
    {
      Id: 10,
      pregunta: "¿Comparte sus cosas con otros niños?",
      num_pregunta: 10,
      testId: 1,
      puntajepregs: [
        { Id: 31, nombre: "Sí, con gusto", valor: 0, preguntaId: 10 },
        { Id: 32, nombre: "A veces", valor: 1, preguntaId: 10 },
        { Id: 33, nombre: "Le cuesta mucho", valor: 2, preguntaId: 10 },
      ],
    },
    {
      Id: 11,
      pregunta: "¿Tiene dificultades para concentrarse en una actividad?",
      num_pregunta: 11,
      testId: 1,
      puntajepregs: [
        { Id: 34, nombre: "No, se concentra bien", valor: 0, preguntaId: 11 },
        { Id: 35, nombre: "A veces se distrae", valor: 1, preguntaId: 11 },
        { Id: 36, nombre: "Sí, con frecuencia", valor: 2, preguntaId: 11 },
      ],
    },
    {
      Id: 12,
      pregunta: "¿Reacciona de forma agresiva cuando algo le molesta?",
      num_pregunta: 12,
      testId: 1,
      puntajepregs: [
        { Id: 37, nombre: "No, mantiene la calma", valor: 0, preguntaId: 12 },
        { Id: 38, nombre: "A veces", valor: 1, preguntaId: 12 },
        { Id: 39, nombre: "Sí, con frecuencia", valor: 2, preguntaId: 12 },
      ],
    },
  ],
};

interface RespuestaGuardada {
  preguntaId: number;
  puntajePregId: number;
  valor: number;
}

const PruebaAutismo: React.FC<{}> = ({}) => {
  const [respuestas, setRespuestas] = useState<RespuestaGuardada[]>([]);
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [valorSeleccionado, setValorSeleccionado] = useState<number | null>(
    null
  );
  const [imagenActual, setImagenActual] = useState<string>("");

  const seleccionarImagenAleatoria = () => {
    const indiceAleatorio = Math.floor(Math.random() * imagenes.length);
    setImagenActual(imagenes[indiceAleatorio]);
  };

  useEffect(() => {
    seleccionarImagenAleatoria();
  }, []);

  useEffect(() => {
    const respuestaExistente = respuestas.find(
      (r) => r.preguntaId === testData.preguntas[preguntaActual].Id
    );
    setValorSeleccionado(
      respuestaExistente ? respuestaExistente.puntajePregId : null
    );
  }, [preguntaActual, respuestas]);

  const manejarCambioRespuesta = (e: any) => {
    setValorSeleccionado(Number(e.target.value));
  };

  const siguientePregunta = () => {
    if (valorSeleccionado === null) return;

    const pregunta = testData.preguntas[preguntaActual];
    const puntajeSeleccionado = pregunta.puntajepregs.find(
      (p) => p.Id === valorSeleccionado
    );

    if (!puntajeSeleccionado) return;

    const nuevasRespuestas = respuestas.filter(
      (r) => r.preguntaId !== pregunta.Id
    );

    nuevasRespuestas.push({
      preguntaId: pregunta.Id,
      puntajePregId: puntajeSeleccionado.Id,
      valor: puntajeSeleccionado.valor,
    });

    setRespuestas(nuevasRespuestas);

    if (preguntaActual < testData.preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
      seleccionarImagenAleatoria();
    } else {
      console.log("Test completado. Respuestas:", nuevasRespuestas);
      const puntajeTotal = nuevasRespuestas.reduce(
        (sum, respuesta) => sum + respuesta.valor,
        0
      );
      console.log("Puntaje total:", puntajeTotal);
    }
  };

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
      seleccionarImagenAleatoria();
    }
  };

  const progreso = Math.round(
    ((preguntaActual + (valorSeleccionado !== null ? 1 : 0)) /
      testData.preguntas.length) *
      100
  );

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

      <Row justify="center">
        <Col span={24}>
          <Title
            level={4}
            style={{
              textAlign: "center",
              marginBottom: 30,
              padding: "0 20px",
            }}
          >
            {testData.preguntas[preguntaActual].pregunta}
          </Title>
        </Col>
      </Row>

      <Row justify="center">
        <Col span={24}>
          <Radio.Group
            onChange={manejarCambioRespuesta}
            value={valorSeleccionado}
            style={{ width: "100%" }}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {testData.preguntas[preguntaActual].puntajepregs.map(
                (puntaje, index) => (
                  <Radio
                    key={puntaje.Id}
                    value={puntaje.Id}
                    style={{
                      display: "block",
                      padding: "12px 16px",
                      borderRadius: 4,
                    }}
                  >
                    <Text strong>{String.fromCharCode(65 + index)}.</Text>{" "}
                    {puntaje.nombre}
                  </Radio>
                )
              )}
            </Space>
          </Radio.Group>
        </Col>
      </Row>

      <Row justify="center" style={{ marginTop: 30 }}>
        <Col span={24}>
          <Space
            style={{
              display: "flex",
              justifyContent: "center",
              gap: 16,
            }}
          >
            <Button onClick={preguntaAnterior} disabled={preguntaActual === 0}>
              Anterior
            </Button>
            <Button
              type="primary"
              onClick={siguientePregunta}
              disabled={valorSeleccionado === null}
            >
              {preguntaActual === testData.preguntas.length - 1
                ? "Finalizar"
                : "Siguiente"}
            </Button>
          </Space>
        </Col>
      </Row>
    </Card>
  );
};

export default PruebaAutismo;
