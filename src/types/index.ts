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
export interface createAgendaData {
  fecha: string;
  usuarioId: number;
  pacienteId: number;
  requesterId: number;
}
