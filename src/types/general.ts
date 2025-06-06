export type User = {
  apellido: string;
  correo: string;
  especialidad: string;
  id: number;
  nombre: string;
  requesterId: null | number;
  rol: number;
  telefono: string;
};

export type Test = {
  id: number;
  nombre: string;
  descripcion: string;
  sistema_puntaje: string;
  edad_min: number;
  edad_max: number;
  preguntas: Pregunta[];
  requesterId: null | number;
}

export type Pregunta = {
  id: number;
  pregunta: string;
  num_pregunta: string;
  testId: number;
  puntajepregs: PuntajePreg[];
  requesterId: null | number;
}

export type PuntajePreg = {
  id: number;
  nombre: string;
  valor: number;
  preguntaId: number;
  requesterId: null | number;
}
