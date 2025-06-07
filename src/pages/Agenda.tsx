import { useEffect, useState } from "react";
import Modal from "../components/shared/Moda";
import NewAgenda from "../components/forms/NewAgendaForm";
import { useStore } from "../context/store";
import { getUsers } from "../api/UserModuleApi";
import type { User } from "../types/general";
import { getPacientes } from "../api/PacientesAPI";
import { getAgendas } from "../api/AgendaModuleApi";
import type { Agenda, filtersForAgenda } from "../types";
import AgendaCardView from "../components/common/AgendaCardView";

export default function Agenda() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [especialists, setEspecialists] = useState<User[]>([]);
  const [pacients, setPacients] = useState([]);
  const [agendas, setAgendas] = useState<Agenda[]>([]);
  const [filteredAgendas, setFilteredAgendas] = useState<Agenda[]>([]);

  // Estados para los filtros
  const [filters, setFilters] = useState<filtersForAgenda>({
    especialista: "",
    paciente: "",
    fechaini: "",
    fechafin: "",
  });

  const user = useStore((value) => value.user);

  const loadEspecialists = async () => {
    setLoading(true);
    try {
      const data = await getUsers({ requesterId: user?.id });

      if (data != null) {
        const filteredUsers = data.filter((user: User) => user.rol === 0);
        setEspecialists(filteredUsers);
      }
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadPacients = async () => {
    setLoading(true);
    try {
      const data = await getPacientes({});
      if (data != null) setPacients(data.data.value);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  async function loadAgendas() {
    try {
      // Construir objeto de filtros para la API
      const apiFilters: filtersForAgenda = {
        especialista: filters.especialista || undefined,
        paciente: filters.paciente || undefined,
        // Convertir fechas al formato ISO con timezone si existen
        fechaini: filters.fechaini
          ? `${filters.fechaini}T00:00:00.000Z`
          : undefined,
        fechafin: filters.fechafin
          ? `${filters.fechafin}T23:59:59.999Z`
          : undefined,
        // Los otros parámetros que no usamos los dejamos undefined
        usuarioId: undefined,
        pacienteId: undefined,
      };

      const data = await getAgendas(apiFilters);
      if (data.status) {
        setAgendas(data.value);
        filterTodayAndUpcomingAgendas(data.value);
      }
    } catch (error) {
      console.error(error);
    }
  }

  const filterTodayAndUpcomingAgendas = (agendasList: Agenda[]) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Establecer a inicio del día

    const filtered = agendasList.filter((agenda) => {
      const agendaDate = new Date(agenda.fecha);
      agendaDate.setHours(0, 0, 0, 0); // Ignorar la hora para comparación

      // Mostrar agendas de hoy o futuras
      return agendaDate >= today;
    });

    setFilteredAgendas(filtered);
  };

  useEffect(() => {
    loadAgendas();
    loadEspecialists();
    loadPacients();
  }, [filters]); // Se ejecutará cuando cambien los filtros

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetFilters = () => {
    setFilters({
      especialista: "",
      paciente: "",
      fechaini: "",
      fechafin: "",
    });
  };

  const refreshAgendas = async () => {
    await loadAgendas();
  };

  return (
    <>
      <h1 className="text-4xl font-bold text-sky-500 p-2">Modulo de agenda</h1>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow-md mb-4">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Filtrar agendas
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro por especialista (input text) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Especialista
            </label>
            <input
              type="text"
              name="especialista"
              value={filters.especialista}
              onChange={handleFilterChange}
              placeholder="Buscar por especialista"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Filtro por paciente (input text) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Paciente
            </label>
            <input
              type="text"
              name="paciente"
              value={filters.paciente}
              onChange={handleFilterChange}
              placeholder="Buscar por paciente"
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Filtro por fecha inicial */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha inicial
            </label>
            <input
              type="date"
              name="fechaini"
              value={filters.fechaini}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>

          {/* Filtro por fecha final */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Fecha final
            </label>
            <input
              type="date"
              name="fechafin"
              value={filters.fechafin}
              onChange={handleFilterChange}
              className="w-full p-2 border border-gray-300 rounded-md"
            />
          </div>
        </div>

        <div className="mt-3 flex justify-end space-x-2">
          <button
            onClick={resetFilters}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
          >
            Limpiar filtros
          </button>
        </div>
      </div>

      {/* Botón para agregar nueva agenda */}
      {user!.rol != 0 ? (
        <button
          onClick={handleOpenModal}
          className="text-white bg-sky-500 rounded-lg p-2 my-5 hover:bg-sky-600 hover:scale-110 transition ease-in-out cursor-pointer font-bold"
        >
          Agregar a agenda
        </button>
      ) : null}

      {/* Listado de agendas */}
      <section className="grid grid-cols-2 gap-5">
        {filteredAgendas.length > 0 ? (
          filteredAgendas.map((info) => (
            <AgendaCardView key={info.id} agenda={info} />
          ))
        ) : (
          <div className="col-span-2 text-center py-10 text-gray-500">
            No se encontraron agendas para hoy o próximas
          </div>
        )}
      </section>

      {/* Modal para agregar nueva agenda */}
      <Modal isOpen={isOpen} title="Agregar agenda" onClose={handleOpenModal}>
        <NewAgenda
          especialists={especialists}
          isLoading={loading}
          pacients={pacients}
          requesterId={user!.id}
          onAgendaCreated={refreshAgendas}
        />
      </Modal>
    </>
  );
}
