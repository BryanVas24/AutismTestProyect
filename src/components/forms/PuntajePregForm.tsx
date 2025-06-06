import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createPuntajePreg, editPuntajePreg } from "../../api/PreguntasApi";
import type { newPuntajePregType } from "../../types";
import { useStore } from "../../context/store";

type PuntajePregFormProps = {
  onClose: () => void;
  puntajeToEdit?: any;
  isEditMode?: boolean;
  preguntaId: number;
};

const INITIAL_DATA: newPuntajePregType = {
  nombre: "",
  valor: 0,
  preguntaId: 0,
  requesterId: 0,
};

export default function PuntajePregForm({
  onClose,
  isEditMode = false,
  puntajeToEdit,
  preguntaId,
}: PuntajePregFormProps) {
  const { user } = useStore();
  const [formData, setFormData] = useState<newPuntajePregType>(INITIAL_DATA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (isEditMode && puntajeToEdit) {
      setFormData({
        nombre: puntajeToEdit.nombre || "",
        valor: puntajeToEdit.valor || 0,
        preguntaId: puntajeToEdit.preguntaId,
        requesterId: user!.id,
      });
    } else {
      setFormData({
        ...INITIAL_DATA,
        preguntaId,
        requesterId: user!.id,
      });
    }
  }, [isEditMode, puntajeToEdit]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name === "valor" ? Number(value) : value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!formData.nombre.trim()) {
      toast.warn("El campo nombre es obligatorio");
      setIsLoading(false);
      return;
    }

    try {
      if (isEditMode) {
        await editPuntajePreg({ ...puntajeToEdit, ...formData });
        toast.success("Puntaje actualizado con éxito");
      } else {
        await createPuntajePreg(formData);
        toast.success("Puntaje creado con éxito");
      }
      onClose();
    } catch (error) {
      toast.error("Error al guardar el puntaje");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-md space-y-6">
      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Nombre</label>
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          className="w-full border border-gray-300 rounded-md p-2 focus:ring-2 focus:ring-sky-500"
        />
      </div>

      <div>
        <label className="block mb-1 text-sm font-medium text-gray-700">Valor</label>
        <input
          type="number"
          name="valor"
          value={formData.valor}
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
