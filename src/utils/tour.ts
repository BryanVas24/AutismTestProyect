import { driver } from "driver.js";
import "driver.js/dist/driver.css";

export const iniciarTour = () => {
  const driverObj = driver({
    showProgress: true,
    steps: [
      {
        element: "#pregunta-actual",
        popover: {
          title: "Pregunta",
          description: "Aquí se muestra la pregunta actual del test.",
        },
      },
      {
        element: "#opciones-respuesta",
        popover: {
          title: "Opciones",
          description: "Selecciona una de las respuestas disponibles.",
        },
      },
      {
        element: "#botones-navegacion",
        popover: {
          title: "Navegación",
          description:
            "Usa estos botones para avanzar o retroceder en el test.",
        },
      },
    ],
  });

  driverObj.drive();
};
