import axios from "axios";
import type { newUserDataType, UserDataToEdit, UserFilters } from "../types";

const API_URL = import.meta.env.VITE_API_URL + "Usuario";

export async function createUser(newUserData: newUserDataType) {
  try {
    const URL = `${API_URL}/register`;
    const { data } = await axios.post(URL, newUserData);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function getUsers(params: UserFilters = {}) {
  try {
    const URL = `${API_URL}/listuser`;
    const { data } = await axios.get(URL, {
      params: {
        ...params,
        nombre: params.nombre || undefined,
        especialidad: params.especialidad || undefined,
        rol: params.rol || undefined,
      },
    });
    console.log(data);
    return data.value;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function editUser(UserDataToEdit: UserDataToEdit) {
  try {
    const URL = `${API_URL}/${UserDataToEdit.id}`;
    const { data } = await axios.patch(URL, UserDataToEdit);
    console.log(data);
    return data;
  } catch (error) {
    console.error(error);
    throw error;
  }
}
