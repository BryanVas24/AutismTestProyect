import axios from "axios";
import type { newUserDataType } from "../types";

const API_URL = import.meta.env.VITE_API_URL + "/usuario";

export async function createUser(newUserData: newUserDataType) {
  const { passwordConfirm, ...userData } = newUserData;
  console.log(passwordConfirm);
  try {
    const URL = `${API_URL}/Usuario/register`;
    const { data } = await axios.post(URL, userData);
    return data;
  } catch (error) {
    console.error(error);
  }
}
