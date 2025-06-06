// Función para convertir el número de rol a su nombre correspondiente
export const getRolName = (rolNumber: number): string => {
  switch (rolNumber) {
    case 0:
      return "Especialista";
    case 1:
      return "Tecnico";
    case 2:
      return "Administrador";
    default:
      return "-";
  }
};
