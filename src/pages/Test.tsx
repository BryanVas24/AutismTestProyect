import { useEffect, useState } from "react";
import { FaPlusCircle, FaSync, FaTrashAlt, FaEdit } from "react-icons/fa";
import Modal from "../components/shared/Moda";
import TestForm from "../components/forms/TestForm";
import { eliminarTest, listTest } from "../api/TestApi";
import { useNavigate } from "react-router-dom";
import { Popconfirm, message } from "antd";
import { useStore } from "../context/store";

interface Test {
  id: string;
  nombre: string;
  edad_min: number;
  edad_max: number;
}

export default function Tests() {
  const [tests, setTests] = useState<Test[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    nombre: "",
    edad_min: "",
    edad_max: "",
  });
  const { user: currentUser } = useStore();
  const navigate = useNavigate();

  const handleLoadTests = async () => {
    setLoading(true);
    try {
      const data = await listTest(
        filters.nombre,
        filters.edad_min ? parseInt(filters.edad_min) : undefined,
        filters.edad_max ? parseInt(filters.edad_max) : undefined
      );
      if (data?.data.value) setTests(data.data.value);
    } catch (err) {
      console.error("Error cargando tests", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    handleLoadTests();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const deletePayload = {
            id: +id,
            requesterId: currentUser!.id,
        };
      console.log(deletePayload)
      await eliminarTest(deletePayload);
      message.success("Test eliminado correctamente");
      handleLoadTests();
    } catch (error) {
      console.error("Error eliminando test:", error);
      message.error("Error al eliminar el test");
    }
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const resetFilters = () => {
    setFilters({ nombre: "", edad_min: "", edad_max: "" });
    handleLoadTests();
  };

  return (
    <>
      <div className="flex justify-between items-center p-5">
        <h1 className="text-3xl font-bold text-sky-600">Gestión de Tests</h1>
        <button
          onClick={() => setIsOpen(true)}
          className="flex items-center gap-2 bg-sky-500 text-white py-2 px-4 rounded hover:bg-sky-600 transition"
        >
          <FaPlusCircle /> Crear Test
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white shadow rounded p-5 mx-5 mb-4 grid grid-cols-1 md:grid-cols-4 gap-4">
        <input
          type="text"
          name="nombre"
          value={filters.nombre}
          onChange={handleFilterChange}
          placeholder="Nombre del test"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="edad_min"
          value={filters.edad_min}
          onChange={handleFilterChange}
          placeholder="Edad mínima"
          className="border p-2 rounded w-full"
        />
        <input
          type="number"
          name="edad_max"
          value={filters.edad_max}
          onChange={handleFilterChange}
          placeholder="Edad máxima"
          className="border p-2 rounded w-full"
        />
        <button
          onClick={resetFilters}
          className="flex items-center justify-center gap-2 bg-gray-200 text-gray-700 font-bold py-2 rounded hover:bg-gray-300"
        >
          <FaSync /> Limpiar
        </button>
      </div>

      {/* Tabla */}
      <div className="bg-white shadow rounded p-5 mx-5">
        {loading ? (
          <div className="text-center">Cargando tests...</div>
        ) : tests.length === 0 ? (
          <div className="text-center">No hay tests registrados</div>
        ) : (
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-sky-50">
                <th className="text-left p-3">ID</th>
                <th className="text-left p-3">Nombre</th>
                <th className="text-left p-3">Edad</th>
                <th className="text-left p-3">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {tests.map((test) => (
                <tr key={test.id} className="border-t">
                  <td className="p-3">{test.id}</td>
                  <td className="p-3">{test.nombre}</td>
                  <td className="p-3">{test.edad_min} - {test.edad_max}</td>
                  <td className="p-3 flex gap-3">
                    <button
                      onClick={() => navigate(`/sistem/tests/${test.id}`)}
                      className="text-blue-600 hover:text-blue-800 flex items-center gap-1"
                    >
                      <FaEdit /> Editar
                    </button>
                    <Popconfirm
                      title="¿Eliminar este test?"
                      description="Esta acción no se puede deshacer"
                      onConfirm={() => handleDelete(test.id)}
                      okText="Sí"
                      cancelText="No"
                    >
                      <button className="text-red-600 hover:text-red-800 flex items-center gap-1">
                        <FaTrashAlt /> Eliminar
                      </button>
                    </Popconfirm>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal de creación */}
      <Modal
        isOpen={isOpen}
        onClose={() => {
          setIsOpen(false);
          handleLoadTests();
        }}
        title="Crear nuevo Test"
      >
        <TestForm
          onClose={() => {
            setIsOpen(false);
            handleLoadTests();
          }}
        />
      </Modal>
    </>
  );
}
