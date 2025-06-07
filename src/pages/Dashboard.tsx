import React, { useEffect, useState } from "react";
import {
  CalendarOutlined,
  UserOutlined,
  IdcardOutlined,
  TeamOutlined,
  FileTextOutlined,
} from "@ant-design/icons";
import { getAgendas } from "../api/AgendaModuleApi";
import ModalAgenda from "../components/ModalAgenda";

export type AgendaItem = {
  id: number;
  fecha: string;
  resumen: string;
  usuarioId: number;
  pacienteId: number;
  prediagnostico: any;
  especialista: string;
  pacienteIniciales: string;
  requesterId: number | null;
};

type filtersForAgenda = {
  fechaini?: string;
  fechafin?: string;
  usuarioId?: number;
  pacienteId?: number;
  especialista?: string;
  paciente?: string;
};

const Agenda: React.FC = () => {
  const [agendas, setAgendas] = useState<AgendaItem[]>([]);
  const [agenda, setAgenda] = useState<AgendaItem | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [ismodalOpen, setModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const fetchAgendas = async () => {
      try {
        setLoading(true);
        const filters: filtersForAgenda = {
          // usuarioId: 2,
        };

        const response = await getAgendas(filters);
        if (response.status && response.value) {
          setAgendas(response.value);
        } else {
          setError(response.msg || "Error al cargar las agendas");
        }
      } catch (err) {
        console.error("Error fetching agendas:", err);
        setError("Error al conectarse al servidor");
      } finally {
        setLoading(false);
      }
    };

    fetchAgendas();
  }, []);

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    const optionsDate: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
    };
    const optionsTime: Intl.DateTimeFormatOptions = {
      hour: "2-digit",
      minute: "2-digit",
    };

    return {
      date: date.toLocaleDateString("es-ES", optionsDate),
      time: date.toLocaleTimeString("es-ES", optionsTime),
    };
  };

  if (loading)
    return <div className="text-center py-8">Cargando agendas...</div>;
  if (error)
    return <div className="text-center py-8 text-red-500">{error}</div>;
  if (agendas.length === 0)
    return <div className="text-center py-8">No hay agendas programadas</div>;

  return (
    <div className="container mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Agenda Médica</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agendas.map((agenda) => (
          <AgendaCard
            key={agenda.id}
            agenda={agenda}
            formatDateTime={formatDateTime}
            setAgenda={setAgenda}
            setModalOpen={setModalOpen}
          />
        ))}
      </div>
      {agenda && (
        <ModalAgenda
          open={ismodalOpen}
          onClose={() => setModalOpen(false)}
          agenda={agenda}
        />
      )}
    </div>
  );
};

const AgendaCard: React.FC<{
  agenda: AgendaItem;
  formatDateTime: (dateString: string) => { date: string; time: string };
  setAgenda: (ag: AgendaItem) => void;
  setModalOpen: (open: boolean) => void;
}> = ({ agenda, formatDateTime, setAgenda, setModalOpen }) => {
  const { date, time } = formatDateTime(agenda.fecha);
  const parsedEspecialista = agenda.especialista.split(" (");
  const nombreEspecialista = parsedEspecialista[0];
  const especialidad =
    parsedEspecialista[1]?.replace(")", "") || "Especialidad no especificada";

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <UserOutlined className="text-lg text-blue-500" />
          </div>
          <div>
            <h3 className="font-medium text-gray-800">
              {agenda.pacienteIniciales}
            </h3>
            <p className="text-xs text-gray-500">ID: {agenda.pacienteId}</p>
          </div>
        </div>
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {agenda.resumen}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="p-2 rounded-lg bg-blue-100">
            <CalendarOutlined className="text-lg text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Fecha y Hora</p>
            <p className="font-medium text-gray-800">
              {date} - {time}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div className="p-2 rounded-lg bg-blue-100">
            <TeamOutlined className="text-lg text-blue-600" />
          </div>
          <div>
            <p className="text-xs text-gray-500">Especialista</p>
            <p className="font-medium text-gray-800">{nombreEspecialista}</p>
            <p className="text-xs text-gray-500">{especialidad}</p>
          </div>
        </div>

        {agenda.prediagnostico && (
          <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
            <div className="p-2 rounded-lg bg-blue-100">
              <FileTextOutlined className="text-lg text-blue-600" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Prediagnóstico</p>
              <p className="font-medium text-gray-800">
                {agenda.prediagnostico.prediagnostico}
              </p>
            </div>
          </div>
        )}
      </div>

      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200 flex justify-end">
        <button
          onClick={() => {
            setAgenda(agenda);
            setModalOpen(true);
          }}
          className="flex items-center space-x-1 px-3 py-1 rounded-lg text-sm font-medium transition-colors bg-blue-100 text-blue-700 hover:bg-blue-200"
        >
          <IdcardOutlined />
          <span>Detalles</span>
        </button>
      </div>
    </div>
  );
};

export default Agenda;
