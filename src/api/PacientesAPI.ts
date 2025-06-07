import axios from "axios";
import type { filtersPacient } from "../types";

const API_URL = import.meta.env.VITE_API_URL;

export async function getPacientes(filters: filtersPacient) {
  try {
    const response = await axios.post(
      `${API_URL}Paciente/SelectPacientes`,
      filters
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function guardarPaciente(data: any) {
  try {
    const response = await axios.post(`${API_URL}Paciente/CrearPaciente`, data);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function guardarRepresentante(data: any) {
  try {
    const response = await axios.post(`${API_URL}Representante/crear`, data);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function getPacienteById(id: number) {
  try {
    const response = await axios.get(
      `${API_URL}Paciente/SelectOnePaciente/${id}`
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}
