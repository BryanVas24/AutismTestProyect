import axios from "axios";
import type { newUserDataType } from "../types";

const API_URL = import.meta.env.VITE_API_URL + "/Usuario";

export async function createUser(newUserData: newUserDataType) {
  try {
    const URL = `${API_URL}/register`;
    const { data } = await axios.post(URL, newUserData);
    return data;
  } catch (error) {
    console.error(error);
  }
}
