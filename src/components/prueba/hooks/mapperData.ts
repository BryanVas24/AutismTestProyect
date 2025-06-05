import type {
  TestData,
  Pregunta,
  PuntajePreg,
} from "../../../types/PruebaTest";

export const mapTestData = (data: any): TestData => {
  return {
    Id: data.data.value.id,
    nombre: data.data.value.nombre,
    descripción: data.data.value.descripcion,
    sistema_puntaje: data.data.value.sistema_puntaje,
    edad_min: data.data.value.edad_min,
    edad_max: data.data.value.edad_max,
    preguntas: data.data.value.preguntas.map((pregunta: any) => ({
      Id: pregunta.id,
      pregunta: pregunta.pregunta,
      num_pregunta: pregunta.num_pregunta,
      testId: pregunta.testId,
      puntajepregs: pregunta.puntajepregs.map((puntaje: any) => ({
        Id: puntaje.id,
        nombre: puntaje.nombre,
        valor: puntaje.valor,
        preguntaId: puntaje.preguntaId,
      })),
    })),
  };
};

export const enviarTestData = (
  pregunta: Pregunta,
  puntaje: PuntajePreg,
  tiemposInicio: any,
  contadorCambios: any
): any => {
  const tiempoFin = Date.now();
  const tiempoInicio = tiemposInicio[pregunta.Id] || tiempoFin;
  const cambios = contadorCambios[pregunta.Id] || 0;

  return {
    numPregunta: pregunta.num_pregunta,
    pregunta: pregunta.pregunta,
    nombre: puntaje.nombre,
    valor: puntaje.valor,
    tiempoRespuesta: Math.round((tiempoFin - tiempoInicio) / 1000),
    cambios: cambios,
  };
};
