import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Modal, Popconfirm, message } from "antd";
import { FaTrash, FaChevronDown, FaChevronRight, FaTrashAlt } from "react-icons/fa";
import { getTest } from "../api/TestApi";
import { useStore } from "../context/store";
import {
  listPregunta,
  listPuntajePreg,
  eliminarPregunta,
  eliminarPuntajePreg,
} from "../api/PreguntasApi";
import PreguntaForm from "../components/forms/PreguntaForm";
import PuntajeForm from "../components/forms/PuntajePregForm";

export default function TestDetail() {
  const { id } = useParams();
  const [test, setTest] = useState<any>(null);
  const [preguntas, setPreguntas] = useState<any[]>([]);
  const [puntajes, setPuntajes] = useState<any[]>([]);
  const [filterByPreguntaId, setFilterByPreguntaId] = useState<Record<number, string>>({});
  const [collapsedPreguntas, setCollapsedPreguntas] = useState<Record<number, boolean>>({});
  const [preguntaSearch, setPreguntaSearch] = useState('');
  const { user: currentUser } = useStore();

  const loadData = async () => {
    if (!id) return;
    const t = await getTest({ id });
    const preg = await listPregunta({ testId: id });
    const punt = await listPuntajePreg({ testId: id });

    setTest(t?.data.value);
    setPreguntas(preg?.data.value || []);
    setPuntajes(punt?.data.value || []);
  };

  useEffect(() => {
    loadData();
  }, [id]);

  const handleFilterChange = (preguntaId: number, value: string) => {
    setFilterByPreguntaId((prev) => ({ ...prev, [preguntaId]: value }));
  };

  const handleDeletePregunta = async (preguntaId: number) => {
    try {
      await eliminarPregunta({ id: preguntaId, requesterId: currentUser!.id });
      message.success("Pregunta eliminada");
      loadData();
    } catch (error) {
      console.error("Error eliminando pregunta:", error);
      message.error("Error al eliminar la pregunta");
    }
  };

  const handleDeletePuntaje = async (puntajeId: number) => {
    try {
      await eliminarPuntajePreg({ id: puntajeId, requesterId: currentUser!.id });
      message.success("Puntaje eliminado");
      loadData();
    } catch (error) {
      console.error("Error eliminando puntaje:", error);
      message.error("Error al eliminar el puntaje");
    }
  };

  const toggleCollapse = (preguntaId: number) => {
    setCollapsedPreguntas(prev => ({
      ...prev,
      [preguntaId]: !prev[preguntaId],
    }));
  };

  if (!test) return <div className="p-5">Cargando test...</div>;

  const preguntasFiltradas = preguntas.filter((pregunta) => {
    const search = preguntaSearch.toLowerCase();
    return (
      pregunta.pregunta.toLowerCase().includes(search) ||
      String(pregunta.num_pregunta).includes(search)
    );
  });

  return (
    <div className="p-5 space-y-10">
      <h1 className="text-3xl font-bold text-sky-600">Editar Test: {test.nombre}</h1>

      <div className="bg-white shadow-md rounded-lg p-4 text-gray-700">
        <p><strong>Descripción:</strong> {test.descripcion}</p>
        <p><strong>Sistema de Puntaje:</strong> {test.sistema_puntaje}</p>
        <p><strong>Edad Mínima:</strong> {test.edad_minima}</p>
        <p><strong>Edad Máxima:</strong> {test.edad_maxima}</p>
      </div>

      <div>
        <input
          type="text"
          placeholder="Filtrar preguntas por nombre o número..."
          value={preguntaSearch}
          onChange={(e) => setPreguntaSearch(e.target.value)}
          className="w-full p-2 border rounded-md mb-6"
        />
      </div>

      <div className="space-y-6">
        {preguntasFiltradas.map((pregunta) => {
          const puntajesDePregunta = puntajes.filter(p => p.preguntaId === pregunta.id);
          const filtro = filterByPreguntaId[pregunta.id] || "";
          const puntajesFiltrados = puntajesDePregunta.filter(p =>
            p.nombre.toLowerCase().includes(filtro.toLowerCase())
          );

          const isCollapsed = collapsedPreguntas[pregunta.id] ?? false;

          return (
            <div key={pregunta.id} className="bg-white shadow-lg rounded-xl p-6">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-sky-700">
                  Pregunta #{pregunta.num_pregunta}: {pregunta.pregunta}
                </h2>
                <div className="flex gap-3">
                  <button onClick={() => toggleCollapse(pregunta.id)} title="Mostrar/Ocultar puntajes">
                    {isCollapsed ? <FaChevronRight /> : <FaChevronDown />}
                  </button>
                  <Popconfirm
                    title="¿Eliminar esta pregunta?"
                    description="Esta acción no se puede deshacer"
                    onConfirm={() => handleDeletePregunta(pregunta.id)}
                    okText="Sí"
                    cancelText="No"
                  >
                    <button className="text-red-600 hover:text-red-800 flex items-center gap-1">
                      <FaTrashAlt /> Eliminar
                    </button>
                  </Popconfirm>
                </div>
              </div>

              <div className="my-4">
                <PreguntaForm
                  preguntaToEdit={pregunta}
                  isEditMode={true}
                  testId={Number(id)}
                  onClose={loadData}
                />
              </div>

              {!isCollapsed && (
                <div className="border-t pt-4 mt-4">
                  <h3 className="text-lg font-medium mb-2 text-gray-800">Puntajes</h3>

                  <input
                    type="text"
                    placeholder="Filtrar puntajes por nombre..."
                    value={filtro}
                    onChange={(e) => handleFilterChange(pregunta.id, e.target.value)}
                    className="w-full p-2 border rounded-md mb-4"
                  />

                  <div className="grid gap-4">
                    {puntajesFiltrados.map((p) => (
                      <div key={p.id} className="bg-gray-100 p-3 rounded-md relative">
                        <div className="absolute top-2 right-2">
                          <Popconfirm
                            title="¿Eliminar este puntaje?"
                            description="Esta acción no se puede deshacer"
                            onConfirm={() => handleDeletePuntaje(p.id)}
                            okText="Sí"
                            cancelText="No"
                          >
                            <button className="text-red-600 hover:text-red-800 flex items-center gap-1">
                              <FaTrashAlt /> Eliminar
                            </button>
                          </Popconfirm>
                        </div>
                        <PuntajeForm
                          puntajeToEdit={p}
                          isEditMode={true}
                          preguntaId={pregunta.id}
                          onClose={loadData}
                        />
                      </div>
                    ))}
                  </div>

                  <div className="mt-4">
                    <PuntajeForm
                      isEditMode={false}
                      preguntaId={pregunta.id}
                      onClose={loadData}
                    />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="mt-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Agregar nueva pregunta</h2>
        <PreguntaForm isEditMode={false} testId={Number(id)} onClose={loadData} />
      </div>
    </div>
  );
}