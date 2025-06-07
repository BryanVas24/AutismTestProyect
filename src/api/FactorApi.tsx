import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function createBioFactor(factor: any) {
  try {
    const response = await axios.post(`${API_URL}Factor/CrearBio`, factor);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function creataPsicoFactor(factor: any) {
  try {
    const response = await axios.post(`${API_URL}Factor/CrearPsico`, factor);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function deletePsicoFactor(id: number, userId: number) {
  try {
    const response = await axios.delete(
      `${API_URL}Factor/EliminarPsico/${id}/${userId}`
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteBioFactor(id: number, userId: number) {
  try {
    const response = await axios.delete(
      `${API_URL}Factor/EliminarBio/${id}/${userId}`
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}
