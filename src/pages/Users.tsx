import { useState, useEffect } from "react";
import { FaPlusCircle, FaSync } from "react-icons/fa";
import Modal from "../components/shared/Moda";
import UserForm from "../components/forms/UserForm";
import { getUsers } from "../api/UserModuleApi";
import { useStore } from "../context/store";
import type { User } from "../types/general";
import type { UserFilters } from "../types";
import { getRolName } from "../helpers";

export default function Users() {
  const [isOpen, setIsOpen] = useState(false);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUserToEdit, setCurrentUserToEdit] = useState<User | null>(null);
  const [filters, setFilters] = useState<Omit<UserFilters, "requesterId">>({
    nombre: "",
    especialidad: "",
    rol: "",
  });

  const headerTable = ["ID", "Nombre", "Especialidad", "Rol", "Acciones"];
  const { user: currentUser } = useStore();

  const handleEditUser = (user: User) => {
    setCurrentUserToEdit(user);
    setIsEditMode(true);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setIsOpen(false);
    setIsEditMode(false);
    setCurrentUserToEdit(null);
    loadUsers();
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const params: UserFilters = {
        ...filters,
        requesterId: currentUser?.id,
      };

      // Eliminar propiedades vacías
      Object.keys(params).forEach((key) => {
        if (params[key as keyof UserFilters] === "") {
          delete params[key as keyof UserFilters];
        }
      });

      const data = await getUsers(params);
      if (data != null) setUsers(data);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (currentUser?.id) {
      loadUsers();
    }
  }, [filters, currentUser?.id]);

  const openModal = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      nombre: "",
      especialidad: "",
      rol: "",
    });
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between p-5">
        <h1 className="text-4xl font-bold text-sky-500 mb-5">
          Modulo de Usuarios
        </h1>
        <button
          onClick={openModal}
          className="bg-sky-500 text-white font-bold rounded-lg lg:p-3 p-2 hover:bg-sky-600 transition hover:cursor-pointer hover:scale-105 flex justify-center items-center gap-5 lg:mr-34"
        >
          Agregar <FaPlusCircle size={25} />
        </button>
      </div>
      {/* Filtros */}
      <div className="bg-white shadow rounded-lg p-5 mx-5 mb-5">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre
            </label>
            <input
              type="text"
              name="nombre"
              value={filters.nombre}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Filtrar por nombre"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialidad
            </label>
            <input
              type="text"
              name="especialidad"
              value={filters.especialidad}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
              placeholder="Filtrar por especialidad"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Rol
            </label>
            <select
              name="rol"
              value={filters.rol}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md cursor-pointer"
            >
              <option value="">Todos los roles</option>
              <option value="1">Especialista</option>
              <option value="2">Tecnico</option>
              <option value="3">Administrador</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={resetFilters}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md flex items-center gap-2"
            >
              <FaSync /> Limpiar
            </button>
          </div>
        </div>
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white shadow rounded-lg p-5 mx-5">
        {loading ? (
          <div className="text-center py-10">Cargando usuarios...</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-sky-50">
                <tr>
                  {headerTable.map((info, i) => (
                    <th
                      key={i}
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      {info}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.length > 0 ? (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.id}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {user.nombre}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {user.especialidad || "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getRolName(user.rol as number)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => handleEditUser(user)}
                          className="text-indigo-600 hover:text-indigo-900 mr-3 underline cursor-pointer"
                        >
                          Editar
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={5}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No se encontraron usuarios o no tienes permisos para
                      verlos
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal
        isOpen={isOpen}
        onClose={handleCloseModal}
        title={isEditMode ? "Editar usuario" : "Agregar usuario"}
      >
        <div>
          <UserForm
            onClose={handleCloseModal}
            userToEdit={isEditMode ? currentUserToEdit : null}
            isEditMode={isEditMode}
          />
        </div>
      </Modal>
    </>
  );
}
