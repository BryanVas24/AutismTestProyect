import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createPregunta, editPregunta } from "../../api/PreguntasApi";
import type { newPreguntaDataType } from "../../types";
import { useStore } from "../../context/store";

type PreguntaFormProps = {
  onClose: () => void;
  preguntaToEdit?: any;
  isEditMode?: boolean;
  testId: number;
};

const INITIAL_DATA: newPreguntaDataType = {
  pregunta: "",
  num_pregunta: "",
  testId: 0,
  requesterId: 0,
};

export default function PreguntaForm({
  onClose,
  isEditMode = false,
  preguntaToEdit,
  testId,
}: PreguntaFormProps) {
  const { user } = useStore();
  const [formData, setFormData] = useState<newPreguntaDataType>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!testId || !user?.id) {
      toast.error("Error al obtener testId o usuario");
      return;
    }

    if (isEditMode && preguntaToEdit) {
      setFormData({
        pregunta: preguntaToEdit.pregunta || "",
        num_pregunta: preguntaToEdit.num_pregunta || "",
        testId: testId,
        requesterId: user.id,
      });
    } else {
      setFormData({
        ...INITIAL_DATA,
        testId,
        requesterId: user.id,
      });
    }
  }, [isEditMode, preguntaToEdit, testId, user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    const { pregunta, num_pregunta, testId } = formData;

    if (!pregunta.trim() || !num_pregunta.trim()) {
      toast.warn("Todos los campos son obligatorios");
      setIsLoading(false);
      return;
    }

    if (!testId || !user?.id) {
      toast.error("Faltan datos necesarios para enviar");
      setIsLoading(false);
      return;
    }

    try {
      if (isEditMode && preguntaToEdit) {
        await editPregunta({ ...preguntaToEdit, ...formData });
        toast.success("Pregunta actualizada con éxito");
      } else {
        await createPregunta(formData);
        toast.success("Pregunta creada con éxito");
      }
      onClose();
    } catch (error) {
      toast.error("Error al guardar la pregunta");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Texto de la pregunta</label>
        <input
          type="text"
          name="pregunta"
          value={formData.pregunta}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Número de pregunta</label>
        <input
          type="text"
          name="num_pregunta"
          value={formData.num_pregunta}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className="w-full bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600 disabled:bg-gray-400 transition"
      >
        {isLoading ? "Guardando..." : isEditMode ? "Actualizar" : "Crear"}
      </button>
    </form>
  );
}
