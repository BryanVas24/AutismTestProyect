//User Module perro
export type newUserDataType = {
  nombre: string;
  apellido: string;
  especialidad: string;
  correo: string;
  telefono: string;
  rol: number;
  password: string;
  passwordConfirm: string;
  requesterId: number;
};
export type UserDataToEdit = {
  id: number;
  nombre: string;
  apellido: string;
  especialidad: string;
  correo: string;
  telefono: string;
  rol: number;
  requesterId: number;
};

export interface UserFilters {
  requesterId?: number;
  nombre?: string;
  especialidad?: string;
  rol?: string;
}
//Para agenda perro
export type Agenda = {
  id: number;
  especialista: string;
  fecha: string;
  pacienteId: number;
  pacienteIniciales: string;
  prediagnostico: string | null;
  requesterId: number | null;
  resumen: string;
  usuarioId: number;
};

export interface createAgendaData {
  fecha: string;
  usuarioId: number;
  pacienteId: number;
  requesterId: number;
}
export type filtersForAgenda = {
  fechaini?: string;
  fechafin?: string;
  usuarioId?: number;
  pacienteId?: number;
  especialista?: string;
  paciente?: string;
};

//Test Module madafaka
export type newTestDataType = {
  nombre: string;
  descripcion: string;
  sistema_puntaje: string;
  edad_min: number;
  edad_max: number;
  requesterId: number;
}

export type TestDataToEdit = {
  id: number;
  nombre: string;
  descripcion: string;
  sistema_puntaje: string;
  edad_min: number;
  edad_max: number;
  requesterId: number;
}
//Para preguntas mmwebo
export type newPreguntaDataType = {
  pregunta: string;
  num_pregunta: string;
  testId: number;
  requesterId: number;
}

export type PreguDataToEdit = {
  id: number;
  nombre: string;
  descripcion: string;
  sistema_puntaje: string;
  edad_min: number;
  edad_max: number;
  requesterId: number;
}

//Para Puntajes Preguntas caracara
export type newPuntajePregType = {
  nombre: string;
  valor: number;
  preguntaId: number;
  requesterId: number;
}

export type PuntajePregToEdit = {
  id: number;
  nombre: string;
  valor: number;
  preguntaId: number;
  requesterId: number;
}