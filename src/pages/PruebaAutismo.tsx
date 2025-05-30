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

interface Pregunta {
  pregunta: string;
  respuesta1: string;
  respuesta2: string;
  respuesta3: string;
  respuesta4: string;
}

const imagenes = [
  "https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/40c29799-f440-4229-91bd-fa98f0f6d754-removebg-preview.png",
  "https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/6d386288-fc44-4e58-b846-653dcee4883b-removebg-preview.png",
  "https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/bac57898-be5b-43be-a5b9-8900659ea318-removebg-preview.png",
  "https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/bca39149-74d2-4342-a1c6-a7fc1fb54503-removebg-preview.png",
  "https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/c61579c0-433a-46a7-aae1-c88e4c7ca00c-removebg-preview.png",
];

const preguntas: Pregunta[] = [
  {
    pregunta: "¿Le gusta jugar con otros niños?",
    respuesta1: "Sí, siempre.",
    respuesta2: "A veces.",
    respuesta3: "Rara vez.",
    respuesta4: "Nunca.",
  },
  {
    pregunta: "¿Muestra interés por las actividades sociales?",
    respuesta1: "Sí, mucho.",
    respuesta2: "Algo.",
    respuesta3: "Poco.",
    respuesta4: "Nada.",
  },
  {
    pregunta: "¿Sigue instrucciones simples?",
    respuesta1: "Siempre.",
    respuesta2: "A menudo.",
    respuesta3: "A veces.",
    respuesta4: "Nunca.",
  },
  {
    pregunta: "¿Reacciona a su nombre cuando lo llaman?",
    respuesta1: "Sí, siempre.",
    respuesta2: "A veces.",
    respuesta3: "Rara vez.",
    respuesta4: "Nunca.",
  },
];

const PruebaAutismo: React.FC<{}> = ({}) => {
  const [respuestas, setRespuestas] = useState<number[]>(
    Array(preguntas.length).fill(-1)
  );
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

  const manejarCambioRespuesta = (e: any) => {
    setValorSeleccionado(e.target.value);
  };

  const siguientePregunta = () => {
    if (valorSeleccionado === null) return;

    const nuevasRespuestas = [...respuestas];
    nuevasRespuestas[preguntaActual] = valorSeleccionado;
    setRespuestas(nuevasRespuestas);

    if (preguntaActual < preguntas.length - 1) {
      setPreguntaActual(preguntaActual + 1);
      setValorSeleccionado(
        respuestas[preguntaActual + 1] !== -1
          ? respuestas[preguntaActual + 1]
          : null
      );
      seleccionarImagenAleatoria();
    } else {
    }
  };

  const preguntaAnterior = () => {
    if (preguntaActual > 0) {
      setPreguntaActual(preguntaActual - 1);
      setValorSeleccionado(respuestas[preguntaActual - 1]);
      seleccionarImagenAleatoria();
    }
  };

  const progreso = Math.round(
    ((preguntaActual + (valorSeleccionado !== null ? 1 : 0)) /
      preguntas.length) *
      100
  );

  return (
    <Card
      title={`Prueba de Autismo - Pregunta ${preguntaActual + 1} de ${
        preguntas.length
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
            {preguntas[preguntaActual].pregunta}
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
              <Radio
                value={1}
                style={{
                  display: "block",
                  padding: "12px 16px",
                  borderRadius: 4,
                }}
              >
                <Text strong>A.</Text> {preguntas[preguntaActual].respuesta1}
              </Radio>
              <Radio
                value={2}
                style={{
                  display: "block",
                  padding: "12px 16px",
                  borderRadius: 4,
                }}
              >
                <Text strong>B.</Text> {preguntas[preguntaActual].respuesta2}
              </Radio>
              <Radio
                value={3}
                style={{
                  display: "block",
                  padding: "12px 16px",
                  borderRadius: 4,
                }}
              >
                <Text strong>C.</Text> {preguntas[preguntaActual].respuesta3}
              </Radio>
              <Radio
                value={4}
                style={{
                  display: "block",
                  padding: "12px 16px",
                  borderRadius: 4,
                }}
              >
                <Text strong>D.</Text> {preguntas[preguntaActual].respuesta4}
              </Radio>
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
              {preguntaActual === preguntas.length - 1
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
