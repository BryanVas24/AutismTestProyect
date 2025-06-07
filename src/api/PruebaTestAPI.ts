import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function createPrueba(tests: any) {
  try {
    const { data } = await axios.post(`${API_URL}test/crear`, tests);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
  }
}
