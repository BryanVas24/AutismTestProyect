import axios from "axios";
import type { createAgendaData } from "../types";

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
