import React from "react";
import { Button, Card, Typography, Image, Row, Col } from "antd";
import { useLocation } from "react-router-dom";

const { Title, Paragraph } = Typography;

interface WelcomeScreenProps {
  onStartTest: () => void;
}

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onStartTest }) => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const testId = queryParams.get("testId");

  return (
    <Card
      style={{
        maxWidth: 800,
        margin: "0 auto",
        textAlign: "center",
        borderRadius: 12,
        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
      }}
      bordered={false}
    >
      <Row gutter={[24, 24]} justify="center" align="middle">
        <Col span={24}>
          <Title level={2} style={{ color: "#1890ff", marginBottom: 8 }}>
            Bienvenido a la Prueba de Autismo
          </Title>
          <Title level={4} type="secondary" style={{ marginTop: 0 }}>
            Evaluación de detección temprana
          </Title>
        </Col>

        <Col xs={24} md={12}>
          <Image
            src="https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/b6450ffa-a33c-42dd-9f9c-97e4939a670c-removebg-preview.png"
            alt="Ilustración sobre autismo"
            preview={false}
            style={{ borderRadius: 8 }}
          />
        </Col>

        <Col xs={24} md={12} style={{ textAlign: "left" }}>
          <Paragraph style={{ fontSize: 16 }}>
            Esta prueba está diseñada para ayudar en la detección temprana de
            características relacionadas con el espectro autista.
          </Paragraph>

          <Paragraph style={{ fontSize: 16 }}>
            Consta de {testId === "1" ? "20" : "30"} preguntas que evaluarán
            diferentes aspectos del desarrollo.
          </Paragraph>

          <Paragraph strong style={{ fontSize: 16 }}>
            Por favor, responda cada pregunta con sinceridad. No hay respuestas
            correctas o incorrectas.
          </Paragraph>

          <Paragraph type="secondary" style={{ fontSize: 14 }}>
            Tiempo estimado: 10-15 minutos
          </Paragraph>
        </Col>

        <Col span={24} style={{ marginTop: 24 }}>
          <Button
            type="primary"
            size="large"
            onClick={onStartTest}
            style={{
              padding: "0 40px",
              height: 48,
              fontSize: 16,
              borderRadius: 8,
            }}
          >
            Comenzar Prueba
          </Button>
        </Col>
      </Row>
    </Card>
  );
};

export default WelcomeScreen;
