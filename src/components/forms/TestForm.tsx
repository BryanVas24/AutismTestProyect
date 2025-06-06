import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { createTest, editTest } from "../../api/TestApi";
import { useStore } from "../../context/store";
import type { newTestDataType } from "../../types";
import type { Test } from "../../types/general";

type TestFormProps = {
  onClose: () => void;
  testToEdit?: Test | null;
  isEditMode?: boolean;
};

const INITIAL_TEST_DATA: newTestDataType = {
  nombre: "",
  descripcion: "",
  sistema_puntaje: "",
  edad_max: 0,
  edad_min: 0,
  requesterId: 0,
};

export default function TestForm({
  onClose,
  isEditMode = false,
  testToEdit,
}: TestFormProps) {
  const { user: currentUser } = useStore();
  const [testFormData, setTestFormData] = useState<newTestDataType>(INITIAL_TEST_DATA);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;

    if (isEditMode && testToEdit) {
      setTestFormData({
        nombre: testToEdit.nombre || "",
        descripcion: testToEdit.descripcion || "",
        sistema_puntaje: testToEdit.sistema_puntaje || "",
        edad_max: testToEdit.edad_max || 100,
        edad_min: testToEdit.edad_min || 0,
        requesterId: currentUser.id,
      });
    } else {
      setTestFormData({ ...INITIAL_TEST_DATA, requesterId: currentUser.id });
    }
  }, [isEditMode, testToEdit, currentUser]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setTestFormData((prev) => ({
      ...prev,
      [name]: ["edad_min", "edad_max"].includes(name) ? Number(value) : value,
    }));
  };

  const validateForm = (): boolean => {
    const hasEmpty = Object.values(testFormData).some((v) =>
      typeof v === "string" ? v.trim() === "" : v === null
    );
    if (hasEmpty) {
      toast.warn("No se permiten campos vacíos");
      return false;
    }

    if (testFormData.edad_min < 0 || testFormData.edad_max > 100) {
      toast.warn("Coloque edades realistas entre 0 y 100");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser) return;

    setIsLoading(true);

    if (!isEditMode && !validateForm()) {
      setIsLoading(false);
      return;
    }

    try {
      const payload = {
        ...testFormData,
        requesterId: currentUser.id,
      };

      if (isEditMode && testToEdit) {
        await editTest({ ...payload, id: testToEdit.id });
        toast.success("Test actualizado con éxito");
      } else {
        await createTest(payload);
        toast.success("Test creado con éxito");
      }

      setTestFormData(INITIAL_TEST_DATA);
      onClose();
    } catch (error) {
      console.error(error);
      toast.error("Error al guardar el test");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200"
    >
      <h2 className="text-xl font-semibold mb-6 text-gray-800">
        {isEditMode ? "Editar Test" : "Crear Test"}
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nombre */}
        <div>
          <label htmlFor="nombre" className="block text-sm font-medium text-gray-700 mb-1">
            Nombre
          </label>
          <input
            type="text"
            name="nombre"
            id="nombre"
            value={testFormData.nombre}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Descripción */}
        <div>
          <label htmlFor="descripcion" className="block text-sm font-medium text-gray-700 mb-1">
            Descripción
          </label>
          <input
            type="text"
            name="descripcion"
            id="descripcion"
            value={testFormData.descripcion}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Sistema de Puntaje */}
        {!isEditMode && (
          <div className="md:col-span-2">
            <label htmlFor="sistema_puntaje" className="block text-sm font-medium text-gray-700 mb-1">
              Sistema de Puntaje
            </label>
            <input
              type="text"
              name="sistema_puntaje"
              id="sistema_puntaje"
              value={testFormData.sistema_puntaje}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500"
            />
          </div>
        )}

        {/* Edad mínima */}
        <div>
          <label htmlFor="edad_min" className="block text-sm font-medium text-gray-700 mb-1">
            Edad mínima
          </label>
          <input
            type="number"
            name="edad_min"
            id="edad_min"
            value={testFormData.edad_min}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500"
          />
        </div>

        {/* Edad máxima */}
        <div>
          <label htmlFor="edad_max" className="block text-sm font-medium text-gray-700 mb-1">
            Edad máxima
          </label>
          <input
            type="number"
            name="edad_max"
            id="edad_max"
            value={testFormData.edad_max}
            onChange={handleChange}
            className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-sky-500"
          />
        </div>
      </div>

      {/* Botones */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={onClose}
          className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-400 transition"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isLoading}
          className="bg-sky-600 text-white px-6 py-2 rounded-md hover:bg-sky-700 disabled:bg-gray-400 transition"
        >
          {isLoading ? "Guardando..." : isEditMode ? "Actualizar" : "Crear"}
        </button>
      </div>
    </form>
  );
}


