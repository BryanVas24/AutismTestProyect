import React from "react";
import { Button, Card, Typography, Image, Row, Col, Result } from "antd";
import { useNavigate } from "react-router-dom";

const { Title, Paragraph } = Typography;

interface CompletionScreenProps {
  score?: number;
  onReturn?: () => void;
}

const CompletionScreen: React.FC<CompletionScreenProps> = ({ onReturn }) => {
  const navigate = useNavigate();

  return (
    <Card
      style={{
        maxWidth: 800,
        margin: "0 auto",
        textAlign: "center",
        border: "none",
        boxShadow: "none",
      }}
    >
      <Result
        status="success"
        title="¡Prueba Completada con Éxito!"
        subTitle="Gracias por responder todas las preguntas"
        extra={[
          <Button
            type="primary"
            key="return"
            onClick={onReturn ? onReturn : () => navigate("/")}
            size="large"
          >
            Volver al inicio
          </Button>,
        ]}
      />

      <Row gutter={[24, 24]} justify="center" style={{ marginTop: 40 }}>
        <Col span={24}>
          <Title level={4} style={{ color: "#1890ff" }}>
            Tu información está segura con nosotros
          </Title>
        </Col>

        <Col xs={24} md={12}>
          <Image
            src="https://pub-9f0368832e6a4e0bbadc67f565e4228f.r2.dev/5b678b1b-4213-4ae6-b430-92515eb427be-removebg-preview.png"
            alt="Seguridad de datos"
            preview={false}
            style={{ borderRadius: 8, maxHeight: 250, objectFit: "cover" }}
          />
        </Col>

        <Col xs={24} md={12} style={{ textAlign: "left" }}>
          <Paragraph style={{ fontSize: 16 }}>
            Los datos proporcionados serán utilizados únicamente con fines de
            evaluación y diagnóstico preliminar.
          </Paragraph>

          <Paragraph style={{ fontSize: 16 }}>
            Mantenemos estrictos protocolos de seguridad para proteger tu
            privacidad y la confidencialidad de tu información.
          </Paragraph>

          <Paragraph type="secondary" style={{ marginTop: 24, fontSize: 14 }}>
            Si deseas una evaluación más detallada, te recomendamos consultar
            con un especialista en el área.
          </Paragraph>
        </Col>
      </Row>
    </Card>
  );
};

export default CompletionScreen;
