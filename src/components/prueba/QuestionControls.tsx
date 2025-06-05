import React from "react";
import { Radio, Button, Space, Row, Col, Typography } from "antd";
import type { PuntajePreg } from "../../types/PruebaTest";

const { Text } = Typography;
interface QuestionControlsProps {
  questionText: string;
  options: PuntajePreg[];
  selectedValue: number | null;
  onAnswerChange: (e: any) => void;
  onPrevious: () => void;
  onNext: () => void;
  currentQuestion: number;
  totalQuestions: number;
  isPreviousDisabled: boolean;
  isNextDisabled: boolean;
  isLoading: boolean;
  onHelp: () => void;
}
export const QuestionControls: React.FC<QuestionControlsProps> = ({
  options,
  selectedValue,
  onAnswerChange,
  onPrevious,
  onNext,
  currentQuestion,
  totalQuestions,
  isPreviousDisabled,
  isNextDisabled,
  isLoading,
  questionText,
  onHelp,
}) => {
  return (
    <>
      <Row justify="center">
        <Col span={24}>
          <Text
            id="pregunta-actual"
            style={{
              fontSize: "18px",
              textAlign: "center",
              marginBottom: 30,
              padding: "0 20px",
              display: "block",
              fontWeight: "bold",
            }}
          >
            {questionText}
          </Text>
        </Col>
      </Row>
      <Row justify="center">
        <Col span={24}>
          <Radio.Group
            id="opciones-respuesta"
            onChange={onAnswerChange}
            value={selectedValue}
            style={{ width: "100%" }}
            disabled={isLoading}
          >
            <Space direction="vertical" size="middle" style={{ width: "100%" }}>
              {options.map((puntaje, index) => (
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
              ))}
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
            <Button
              onClick={onPrevious}
              disabled={isPreviousDisabled || isLoading}
            >
              Anterior
            </Button>
            <Button
              id="btn-siguiente"
              type="primary"
              onClick={onNext}
              disabled={isNextDisabled || isLoading}
              loading={isLoading}
            >
              {currentQuestion === totalQuestions - 1
                ? "Finalizar"
                : "Siguiente"}
            </Button>
          </Space>
        </Col>
      </Row>

      <Row justify="center" style={{ marginTop: 10 }}>
        <Col>
          <Button onClick={onHelp} size="small" type="dashed">
            ¿Necesitas ayuda? Ver tutorial
          </Button>
        </Col>
      </Row>
    </>
  );
};
