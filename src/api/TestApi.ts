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
