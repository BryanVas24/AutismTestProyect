import { useState } from "react";
import type { newUserDataType } from "../../types";
import { toast } from "react-toastify";
import { createUser } from "../../api/UserModuleApi";

type UserformProps = {
  onClose: () => void;
};

const INITIAL_USER_DATA: newUserDataType = {
  nombre: "",
  apellido: "",
  correo: "",
  especialidad: "",
  password: "",
  passwordConfirm: "",
  rol: 0,
  telefono: "",
};

export default function UserForm({ onClose }: UserformProps) {
  const [userFormData, setUserFormData] =
    useState<newUserDataType>(INITIAL_USER_DATA);

  const [isLoading, setIsLoading] = useState(false);

  //handle perros
  const handleChangeUserForm = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setUserFormData({
      ...userFormData,
      [name]: name === "rol" ? Number(value) : value,
    });
  };

  //submit perros
  const handleSubmitUserForm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    //Esto es lo que revisa los campos vacios majes
    const hasEmptyValues = Object.values(userFormData).some((value) =>
      typeof value === "string" ? value.trim() === "" : value === null
    );

    if (hasEmptyValues) {
      toast.warn("No se permiten campos vacios");
      setIsLoading(false);
      return;
    }

    if (userFormData.password !== userFormData.passwordConfirm) {
      toast.warn("Las contraseñas no coinciden");
      setIsLoading(false);
      return;
    }

    try {
      const createUserCall = async () => {
        await createUser(userFormData);

        toast.success("Usuario creado con exito");
        setUserFormData(INITIAL_USER_DATA);
        onClose();
      };
      createUserCall();
    } catch (error) {
      toast.error("Error inesperado");
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <form
      onSubmit={handleSubmitUserForm}
      className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md"
    >
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label
              htmlFor="nombre"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Nombre
            </label>
            <input
              onChange={handleChangeUserForm}
              type="text"
              id="nombre"
              name="nombre"
              value={userFormData.nombre}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Correo electrónico */}
          <div>
            <label
              htmlFor="correo"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Correo electrónico
            </label>
            <input
              onChange={handleChangeUserForm}
              type="email"
              id="correo"
              name="correo"
              value={userFormData.correo}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Contraseña */}
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Contraseña
            </label>
            <input
              onChange={handleChangeUserForm}
              type="password"
              id="password"
              name="password"
              value={userFormData.password}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Rol */}
          <div>
            <label
              htmlFor="rol"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rol
            </label>
            <select
              onChange={handleChangeUserForm}
              id="rol"
              name="rol"
              value={userFormData.rol}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            >
              <option value={0}>Especialista</option>
              <option value={1}>Tecnico</option>
              <option value={2}>Administrador</option>
            </select>
          </div>
        </div>

        <div className="space-y-4">
          {/* Apellido */}
          <div>
            <label
              htmlFor="apellido"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Apellido
            </label>
            <input
              onChange={handleChangeUserForm}
              type="text"
              id="apellido"
              name="apellido"
              value={userFormData.apellido}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Especialidad */}
          <div>
            <label
              htmlFor="especialidad"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Especialidad
            </label>
            <input
              onChange={handleChangeUserForm}
              type="text"
              id="especialidad"
              name="especialidad"
              value={userFormData.especialidad}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Confirmar Contraseña */}
          <div>
            <label
              htmlFor="passwordConfirm"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Confirmar Contraseña
            </label>
            <input
              onChange={handleChangeUserForm}
              type="password"
              id="passwordConfirm"
              name="passwordConfirm"
              value={userFormData.passwordConfirm}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>

          {/* Teléfono */}
          <div>
            <label
              htmlFor="telefono"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Teléfono
            </label>
            <input
              onChange={handleChangeUserForm}
              type="tel"
              id="telefono"
              name="telefono"
              value={userFormData.telefono}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      {/* Botón de fucking enviar*/}
      <div className="mt-8">
        <button
          disabled={isLoading}
          type="submit"
          className="w-full bg-sky-500 text-white py-2 px-4 rounded-md hover:bg-sky-600 transition duration-200 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 disabled:bg-gray-600"
        >
          {!isLoading ? "Enviar" : "Enviando..."}
        </button>
      </div>
    </form>
  );
}
