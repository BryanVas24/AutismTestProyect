import { useState, type ChangeEvent, type FormEvent } from "react";
import type { User } from "../../types/general";
import type { createAgendaData } from "../../types";
import { toast } from "react-toastify";
import { createAgenda } from "../../api/AgendaModuleApi";

type NewAgendaFormProps = {
  especialists: User[];
  isLoading: boolean;
  pacients: any;
  requesterId: number;
};

export default function NewAgendaForm({
  especialists,
  isLoading,
  pacients,
  requesterId,
}: NewAgendaFormProps) {
  const AGENDA_DATA: createAgendaData = {
    fecha: "",
    pacienteId: 0,
    usuarioId: 0,
    requesterId,
  };

  const [newAgendaData, setNewAgendaData] = useState(AGENDA_DATA);
  const [isSubmiting, setIsSubmiting] = useState(false);
  const [dateInputValue, setDateInputValue] = useState(""); // Estado adicional para el input date

  const handleAgendaDataChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    if (name === "fecha") {
      setDateInputValue(value); // Guardamos el valor para el input
      const date = new Date(value);
      if (!isNaN(date.getTime())) {
        // Establecemos hora específica (14:00:00.000 por ejemplo)
        date.setHours(14, 0, 0, 0);
        const isoString = date.toISOString();
        setNewAgendaData({
          ...newAgendaData,
          [name]: isoString,
        });
        return;
      }
    }

    setNewAgendaData({
      ...newAgendaData,
      [name]: name === "fecha" ? value : Number(value),
    });
  };

  const resetForm = () => {
    setNewAgendaData(AGENDA_DATA);
    setDateInputValue(""); // Limpiamos también el valor del input date
  };

  const handleAgendaSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmiting(true);

    const hasEmptyValues = Object.values(newAgendaData).some((value) => {
      if (typeof value === "string") {
        return value.trim() === "";
      }
      return value === 0;
    });

    if (hasEmptyValues) {
      toast.warn("Todos los campos son obligatorios");
      setIsSubmiting(false);
      return;
    }

    try {
      await createAgenda(newAgendaData);
      toast.success("Agenda creada con éxito");
      resetForm(); // Limpiamos el formulario
    } catch (error) {
      console.error(error);
      toast.error("No se pudo agendar la cita");
    } finally {
      setIsSubmiting(false);
    }
  };

  return (
    <form
      onSubmit={handleAgendaSubmit}
      className="grid grid-cols-1 md:grid-cols-2 gap-6"
    >
      {/*fecha */}
      <div className="col-span-2">
        <label
          htmlFor="date"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          selecciona la Fecha
        </label>
        <input
          type="date"
          id="date"
          name="fecha"
          value={dateInputValue} // Usamos el estado separado para el input
          onChange={handleAgendaDataChange}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
      </div>
      {/*lo del medico y el paciente */}
      {isLoading ? (
        "cargando..."
      ) : especialists.length > 0 ? (
        <div>
          <label
            htmlFor="especialist"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            selecciona el especialista
          </label>
          <select
            className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            name="usuarioId"
            id="especialist"
            value={newAgendaData.usuarioId}
            onChange={handleAgendaDataChange}
          >
            <option value="">Selecciona especialista</option>
            {especialists.map((esp) => (
              <option key={esp.id} value={esp.id}>
                {esp.nombre} {esp.apellido}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-gray-600 font-bold">
          No hay especialistas dentro del sistema
        </p>
      )}

      {isLoading ? (
        "cargando..."
      ) : pacients.length > 0 ? (
        <div>
          <label
            htmlFor="pacient"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            selecciona al paciente
          </label>
          <select
            className="w-full py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            name="pacienteId"
            id="pacient"
            value={newAgendaData.pacienteId}
            onChange={handleAgendaDataChange}
          >
            <option value="">Selecciona paciente</option>
            {pacients.map((pac) => (
              <option key={pac.id} value={pac.id}>
                {pac.iniciales}
              </option>
            ))}
          </select>
        </div>
      ) : (
        <p className="text-gray-600 font-bold">
          No hay pacientes dentro del sistema
        </p>
      )}
      <button
        disabled={isSubmiting}
        type="submit"
        className="col-span-2 cursor-pointer bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 disabled:bg-gray-600"
      >
        {!isSubmiting ? "Crear agenda" : "Creando..."}
      </button>
    </form>
  );
}
