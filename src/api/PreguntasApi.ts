import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function listPregunta(query:any){
    try{
        const response = await axios.post(`${API_URL}Pregunta/SelectPregunta`, query);
        console.log(response);
        return response;
    } catch (error){
        console.error(error);
    }  
}

export async function createPregunta(pregunta:any){
    try{
        const response = await axios.post(`${API_URL}Pregunta/CrearPregunta`, pregunta);
        console.log(response);
        return response;
    } catch (error){
        console.error(error);
    }
}

export async function editPregunta(pregunta:any) {
  try{
    const response = await axios.patch(`${API_URL}Pregunta/ActualizarPregunta`, pregunta);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function eliminarPregunta(pregunta: any) {
  try {
    console.log(pregunta);
    const response = await axios.delete(`${API_URL}Pregunta/EliminarPregunta`, {
      data: pregunta, 
      headers: {
        'Content-Type': 'application/json', 
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getPregunta({ id }: { id: string }) {
  try {
    const pregunta = await axios.get(`${API_URL}Pregunta/SelectOnePregunta/${id}`);
    console.log(pregunta);
    return pregunta;
  } catch (error) {
    console.error(error);
  }
}
export async function listPuntajePreg(query:any){
    try{
        const response = await axios.post(`${API_URL}PuntajePreg/SelectPuntajesPreg`, query);
        console.log(response);
        return response;
    } catch (error){
        console.error(error);
    }  
}

export async function createPuntajePreg(puntaje:any){
    try{
        const response = await axios.post(`${API_URL}PuntajePreg/CrearPuntajePreg`, puntaje);
        console.log(response);
        return response;
    } catch (error){
        console.error(error);
    }
}

export async function editPuntajePreg(puntaje:any) {
  try{
    const response = await axios.patch(`${API_URL}PuntajePreg/ActualizarPuntajePreg`, puntaje);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function eliminarPuntajePreg(puntaje: any) {
  try {
    const response = await axios.delete(`${API_URL}PuntajePreg/EliminarPuntajePreg`, {
      data: puntaje,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
export async function getPuntajePreg({ id }: { id: string }) {
  try {
    const puntaje = await axios.get(`${API_URL}PuntajePreg/SelectOnePuntajesPreg/${id}`);
    console.log(puntaje);
    return puntaje;
  } catch (error) {
    console.error(error);
  }
}

