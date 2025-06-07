import axios from "axios";
import type { createAgendaData, filtersForAgenda } from "../types";

const API_URL = import.meta.env.VITE_API_URL + "Agenda";

export async function createAgenda(newAgenda: createAgendaData) {
  try {
    console.log(newAgenda);
    const URL = `${API_URL}/CrearAgenda`;
    const { data } = await axios.post(URL, newAgenda);
    console.log(data);
    return data;
  } catch (error) {
    console.log(error);
  }
}

export async function getAgendas(filters: filtersForAgenda) {
  try {
    const URL = `${API_URL}/SelectAgenda`;
    const { data } = await axios.post(URL, filters);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function getAgendaById(id: number) {
  try {
    const URL = `${API_URL}/SelectOneAgenda/${id}`;
    const { data } = await axios.get(URL);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
