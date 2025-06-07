import { Button, Modal } from "antd";
import {
  CalendarOutlined,
  CloseOutlined,
  ExperimentOutlined,
  HomeOutlined,
  MailOutlined,
  PhoneOutlined,
  PlusOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import type { AgendaItem } from "../pages/Dashboard";
import { useEffect, useState, type FormEvent } from "react";
import { getPacienteById } from "../api/PacientesAPI";
import type { AxiosResponse } from "axios";
import type { IResponse } from "../types/Response";
import { toast } from "react-toastify";
import type Paciente from "../pages/Pacientes";
import { formatDate } from "../utils/formatDate";
import ModalCrearFactor from "./ModalCrearFactor";
import { useStore } from "../context/store";
import {
  creataPsicoFactor,
  createBioFactor,
  deleteBioFactor,
  deletePsicoFactor,
} from "../api/FactorApi";

export type agendaProps = {
  open: boolean;
  onClose: () => void;
  agenda: AgendaItem;
};

const ModalAgenda = ({ open, onClose, agenda }: agendaProps) => {
  const { user } = useStore();
  const [paciente, setPaciente] = useState<Paciente | null>(null);
  const [factor, setFactor] = useState<{
    modal: boolean;
    tipe: string;
    handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  }>({ modal: false, tipe: "", handleSubmit: () => {} });

  const getPaciente = async () => {
    const response: AxiosResponse<IResponse<Paciente>> | undefined =
      await getPacienteById(agenda.pacienteId);
    if (response?.data.status) {
      setPaciente(response.data.value ?? null);
    } else {
      toast.error(response?.data.msg);
    }
  };
  useEffect(() => {
    getPaciente();
  }, [agenda, factor]);
  return (
    <Modal
      open={open}
      onCancel={onClose}
      footer={null}
      width={1000}
      centered
      closeIcon={
        <CloseOutlined className="text-gray-500 hover:text-gray-700 transition-colors" />
      }
      className="rounded-2xl overflow-hidden shadow-xl"
    >
      <div className="flex flex-col h-full">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 flex items-center space-x-4 border-b border-gray-200">
          <div className="flex-1">
            <div className="flex items-center space-x-3">
              <h3 className="text-xl font-semibold text-gray-800">
                Detalles del Paciente: {agenda?.pacienteIniciales}
              </h3>
            </div>
          </div>
        </div>
        <div>
          <div className="p-6 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <h4 className="font-medium text-gray-500 mb-3">
                  Información personal
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2">
                    <CalendarOutlined className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Fecha Nacimiento</p>
                      <p className="text-gray-700">
                        {formatDate(paciente?.birthdate ?? "")}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <PhoneOutlined className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Teléfono</p>
                      <p className="text-gray-700">{paciente?.telefono}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MailOutlined className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Correo</p>
                      <p className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                        {paciente?.correo}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <HomeOutlined className="text-gray-400" />
                    <div>
                      <p className="text-xs text-gray-500">Residencia</p>
                      <p className="text-gray-700">{paciente?.residencia}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-end">
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        setFactor({
                          modal: true,
                          tipe: "Factor Psicológico",
                          handleSubmit: handleCreatePsicoFactor,
                        })
                      }
                    >
                      Agregar Factor Psicológico
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-500">
                      Factores Psicológicos ({paciente?.psicofactores.length})
                    </h4>
                  </div>
                  {paciente?.psicofactores.length > 0 ? (
                    <div className="space-y-3 max-h-24 overflow-y-auto">
                      {paciente?.psicofactores.map((factor) => (
                        <div
                          key={factor.id}
                          className="p-2 bg-purple-50 rounded-lg"
                        >
                          <p className="font-medium text-purple-800">
                            {factor.factor}
                          </p>
                          <p className="text-sm text-gray-600">
                            {factor.descripcion}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(factor.fecha)}
                          </p>
                          <button
                            onClick={async () => {
                              const response = await deletePsicoFactor(
                                factor.id,
                                user?.id ?? 0
                              );
                              if (response.data.status) {
                                toast.success(
                                  "Factor psicológico eliminado exitosamente"
                                );
                                getPaciente();
                              } else {
                                toast.error(
                                  respone.data.msg ||
                                    "Error al eliminar el factor psicológico"
                                );
                              }
                            }}
                          >
                            <span className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                              Eliminar
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                      <TeamOutlined className="text-2xl mb-2" />
                      <p>No registra factores psicológicos</p>
                    </div>
                  )}
                </div>

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <div className="flex justify-end">
                    <Button
                      type="primary"
                      size="small"
                      icon={<PlusOutlined />}
                      onClick={() =>
                        setFactor({
                          modal: true,
                          tipe: "Factor Biológico",
                          handleSubmit: handleCreateBioFactor,
                        })
                      }
                    >
                      Agregar Factor Biológico
                    </Button>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="font-medium text-gray-500">
                      Factores Biológicos ({paciente?.biofactores.length})
                    </h4>
                  </div>
                  {paciente?.biofactores.length > 0 ? (
                    <div className="space-y-3 max-h-24 overflow-y-auto">
                      {paciente?.biofactores.map((factor) => (
                        <div
                          key={factor.id}
                          className="p-2 bg-cyan-50 rounded-lg"
                        >
                          <p className="font-medium text-cyan-800">
                            {factor.factor}
                          </p>
                          <p className="text-sm text-gray-600">
                            {factor.descripcion}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {formatDate(factor.fecha)}
                          </p>
                          <button
                            onClick={async () => {
                              const response = await deleteBioFactor(
                                factor.id,
                                user?.id ?? 0
                              );
                              if (response.data.status) {
                                toast.success(
                                  "Factor biológico eliminado exitosamente"
                                );
                                getPaciente();
                              } else {
                                toast.error(
                                  respone.data.msg ||
                                    "Error al eliminar el factor biológico"
                                );
                              }
                            }}
                          >
                            <span className="text-red-500 hover:text-red-700 transition-colors cursor-pointer">
                              Eliminar
                            </span>
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center py-4 text-gray-400">
                      <ExperimentOutlined className="text-2xl mb-2" />
                      <p>No registra factores biológicos</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 p-4 border-t border-gray-200 flex flex-col justify-end space-y-2">
          <div className="">
            <div>
              <p className="text-xs text-gray-500">Resumen</p>
              <p className="text-gray-700">{agenda?.resumen}</p>
            </div>
          </div>
          <div className="">
            <div>
              <p className="text-xs text-gray-500">Prediagnóstico</p>
              <span className="text-gray-700">
                {agenda?.prediagnostico ? (
                  agenda?.prediagnostico
                ) : (
                  <a
                    href={`/sistem/prediagnostico/${agenda.id}`}
                    className="text-blue-600 hover:underline"
                  >
                    Iniciar Prediagnóstico
                  </a>
                )}
              </span>
            </div>
          </div>
          <div className="">
            <div>
              <p className="text-xs text-gray-500">Fecha</p>
              <p className="text-gray-700">{formatDate(agenda?.fecha)}</p>
            </div>
          </div>
        </div>
      </div>
      <ModalCrearFactor
        open={factor.modal}
        handleSubmit={factor.handleSubmit}
        onClose={() => setFactor({ ...factor, modal: false })}
        tipe={factor.tipe}
      />
    </Modal>
  );

  async function handleCreateBioFactor(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newfactor = formData.get("factor") as string;
    const descripcion = formData.get("descripcion") as string;
    const fecha = formData.get("fecha") as string;
    if (!factor || !descripcion || !fecha) {
      toast.error("Por favor, completa todos los campos");
      return;
    }
    if (
      newfactor.trim().length == 0 ||
      descripcion.trim().length == 0 ||
      fecha.trim().length == 0
    ) {
      toast.error("Por favor, completa todos los campos");
      return;
    }
    const obj = {
      factor: newfactor,
      descripcion,
      fecha: new Date(fecha).toISOString(),
      pacienteId: agenda.pacienteId,
      requesterId: user?.id,
    };
    // Aquí deberías hacer la llamada a la API para crear el factor biológico
    // Por ejemplo:
    const response = await createBioFactor(obj);
    if (response.data.status) {
      setFactor({ ...factor, modal: false });
      toast.success("Factor biológico creado exitosamente");
    } else {
      toast.error(response.data.msg || "Error al crear el factor biológico");
    }
  }

  async function handleCreatePsicoFactor(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newfactor = formData.get("factor") as string;
    const descripcion = formData.get("descripcion") as string;
    const fecha = formData.get("fecha") as string;
    if (!factor || !descripcion || !fecha) {
      toast.error("Por favor, completa todos los campos");
      return;
    }
    if (
      newfactor.trim().length == 0 ||
      descripcion.trim().length == 0 ||
      fecha.trim().length == 0
    ) {
      toast.error("Por favor, completa todos los campos");
      return;
    }
    const obj = {
      factor: newfactor,
      descripcion,
      fecha: new Date(fecha).toISOString(),
      pacienteId: agenda.pacienteId,
      requesterId: user?.id,
    };
    // Aquí deberías hacer la llamada a la API para crear el factor psicológico
    // Por ejemplo:
    console.log(obj);
    const response = await creataPsicoFactor(obj);
    if (response.data.status) {
      setFactor({ ...factor, modal: false });
      toast.success("Factor psicológico creado exitosamente");
    } else {
      toast.error(response.data.msg || "Error al crear el factor psicológico");
    }
  }
};

export default ModalAgenda;
