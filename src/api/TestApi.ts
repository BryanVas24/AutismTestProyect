import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export async function getTest({ id }: { id: string }) {
  try {
    const test = await axios.get(`${API_URL}Test/SelectOneTest/${id}`);
    console.log(test);
    return test;
  } catch (error) {
    console.error(error);
  }
}

export async function createTest(test: any) {
  try {
    const response = await axios.post(`${API_URL}Test/CrearTest`, test);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function editTest(test: any) {
  try {
    const response = await axios.patch(`${API_URL}Test/ActualizarTest`, test);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function eliminarTest(test: any) {
  try {
    const response = await axios.delete(`${API_URL}Test/EliminarTest`, {
      data: test,
      headers: {
        "Content-Type": "application/json",
      },
    });
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

export async function listTest(
  nombre?: string,
  edad_min?: number,
  edad_max?: number
) {
  try {
    const params = new URLSearchParams();

    if (nombre && nombre.trim() !== "") {
      params.append("nombre", nombre);
    }

    if (typeof edad_min === "number") {
      params.append("edad_min", edad_min.toString());
    }

    if (typeof edad_max === "number") {
      params.append("edad_max", edad_max.toString());
    }

    const url = `${API_URL}Test/SelectTest?${params.toString()}`;

    const { data } = await axios.post(url);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function sendAnswer({
  respuesta,
  enlace,
}: {
  respuesta: any;
  enlace: string;
}) {
  try {
    const response = await axios.post(
      `${API_URL}test/responder?enlace=${enlace}`,
      respuesta
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function startTest(formatoinicio: any) {
  try {
    const response = await axios.post(`${API_URL}test/crear`, formatoinicio);
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}

export async function viewTest(enlace: string) {
  try {
    const { data } = await axios.get(`${API_URL}test/${enlace}`);
    return data;
  } catch (error) {
    console.error(error);
  }
}

export async function closeTest({
  diagnostico,
  enlace,
}: {
  diagnostico: any;
  enlace: string;
}) {
  try {
    const response = await axios.post(
      `${API_URL}test/cerrar?enlace=${enlace}`,
      diagnostico
    );
    console.log(response);
    return response;
  } catch (error) {
    console.error(error);
  }
}
