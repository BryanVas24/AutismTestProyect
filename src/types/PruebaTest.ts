export interface PuntajePreg {
  Id: number;
  nombre: string;
  valor: number;
  preguntaId: number;
}

export interface Pregunta {
  Id: number;
  pregunta: string;
  num_pregunta: number;
  testId: number;
  puntajepregs: PuntajePreg[];
}

export interface TestData {
  Id: number;
  nombre: string;
  descripción: string;
  sistema_puntaje: string;
  edad_min: number;
  edad_max: number;
  preguntas: Pregunta[];
}

export interface RespuestaGuardada {
  preguntaId: number;
  puntajePregId: number;
  valor: number;
}

export interface RespuestaBackend {
  numPregunta: number;
  pregunta: string;
  nombre: string;
  valor: number;
  tiempoRespuesta: number;
  cambios: number;
}
