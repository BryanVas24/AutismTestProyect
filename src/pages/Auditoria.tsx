import axios, { type AxiosResponse } from "axios";
import { useEffect, useState } from "react";
import type { IResponse } from "../types/Response";
import { toast } from "react-toastify";
import { FaSync } from "react-icons/fa";

interface IAction {
  id: number;
  accion: string;
  apellido: string;
  email: string;
  fecha_accion: string;
  nombre: string;
  tipo_accion: string;
}

const Auditoria = () => {
  const [audit, setAudit] = useState<IAction[]>([]);
  const [filters, setFilters] = useState({
    nombre: "",
    accion: "",
    fecha: "",
  });
  useEffect(() => {
    const loadAudit = async () => {
      try {
        const response: AxiosResponse<IResponse<IAction[]>> = await axios.get(
          `${import.meta.env.VITE_API_URL}accion?usuario=${
            filters.nombre
          }&accion=${filters.accion}&fecha=${filters.fecha}`
        );
        if (response.data.value) {
          console.log(response);
          setAudit(response.data.value);
        } else {
          toast.error("Error al cargar la auditoría");
        }
      } catch (error) {
        console.error("Error al cargar la auditoría:", error);
      }
    };

    loadAudit();
  }, [filters]);

  const headerTable = [
    "ID",
    "Acción",
    "Tipo",
    "Nombre",
    "Apellido",
    "Email",
    "Fecha",
  ];
  return (
    <div>
      <h1 className="text-4xl font-bold text-sky-500 mb-5">
        Modulo de Auditoria
      </h1>
      <div className="mb-5 flex md:flex-row flex-col gap-2 bg-white shadow rounded-lg p-5">
        <select
          name=""
          id=""
          onChange={(e) => setFilters({ ...filters, accion: e.target.value })}
          value={filters.accion}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        >
          <option value="">Todas las Acciones</option>
          <option value="INSERT">Crear</option>
          <option value="UPDATE">Actualizar</option>
          <option value="DELETE">Eliminar</option>
        </select>

        <input
          type="text"
          value={filters.nombre}
          onChange={(e) => setFilters({ ...filters, nombre: e.target.value })}
          placeholder="Nombre de Usuario"
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        <input
          type="date"
          value={filters.fecha}
          onChange={(e) => setFilters({ ...filters, fecha: e.target.value })}
          className="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent"
        />
        <div className="flex items-end">
          <button
            onClick={() => setFilters({ nombre: "", accion: "", fecha: "" })}
            className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-bold py-2 px-4 rounded-md flex items-center gap-2"
          >
            <FaSync /> Limpiar
          </button>
        </div>
      </div>
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
        <tbody className="bg-white divide-y divide-gray-200 ">
          {audit.length > 0 ? (
            audit.map((user) => (
              <tr key={user.id}>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.id}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {user.accion === "INSERT"
                    ? "Creación"
                    : user.accion === "UPDATE"
                    ? "Actualización"
                    : user.accion === "DELETE"
                    ? "Eliminación"
                    : "Desconocida"}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.tipo_accion}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.nombre}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.apellido}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {user.email}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(user.fecha_accion).toLocaleString("es-ES", {
                    year: "numeric",
                    month: "2-digit",
                    day: "2-digit",
                  })}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={5}
                className="px-6 py-4 text-center text-sm text-gray-500"
              >
                No se encontraron Acciones
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Auditoria;
