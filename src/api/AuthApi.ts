import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL + "/usuario";

export async function Login({
  correo,
  password,
}: {
  correo: string;
  password: string;
}) {
  try {
    const login = await axios.post(`${API_URL}/login`, { correo, password });
    return login.data;
  } catch (error) {
    console.error(error);
  }
}
