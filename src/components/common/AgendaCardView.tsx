import type { Agenda } from "../../types";

interface AgendaCardProps {
  agenda: Agenda;
}

export default function AgendaCardView({ agenda }: AgendaCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-4 col-span-2 lg:col-span-1 border-l-4 border-sky-500 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">
            {agenda.prediagnostico || "Consulta sin prediagnóstico"}
          </h3>
          <p className="text-sm text-gray-600 mt-1">
            <span className="font-medium">Paciente:</span>{" "}
            {agenda.pacienteIniciales}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Especialista:</span>{" "}
            {agenda.especialista}
          </p>
        </div>
        <span className="bg-sky-100 text-sky-800 text-xs px-2 py-1 rounded-full">
          {new Date(agenda.fecha).toLocaleDateString()}
        </span>
      </div>

      {agenda.resumen && (
        <div className="mt-3">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Resumen:</span> {agenda.resumen}
          </p>
        </div>
      )}
    </div>
  );
}
