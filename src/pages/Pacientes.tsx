import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Progress,
  Tag,
  Typography,
  Spin,
  message,
  Button,
  Modal,
  Collapse,
  Form,
  Input,
  DatePicker,
  Radio,
  Select,
} from "antd";
import {
  UserOutlined,
  CalendarOutlined,
  PhoneOutlined,
  MailOutlined,
  HomeOutlined,
  ManOutlined,
  WomanOutlined,
  CloseOutlined,
  ArrowLeftOutlined,
  TeamOutlined,
  ExperimentOutlined,
  IdcardOutlined,
  PlusOutlined,
  FilterOutlined,
} from "@ant-design/icons";
import {
  getPacientes,
  getPacienteById,
  guardarPaciente,
  guardarRepresentante,
} from "../api/PacientesAPI";
import dayjs from "dayjs";
import type { filtersPacient } from "../types";

const { Title } = Typography;

interface Paciente {
  id: number;
  iniciales: string;
  sexo: boolean;
  birthdate: string;
  telefono: string;
  correo: string;
  residencia: string;
  representantes: any[];
  psicofactores: any[];
  biofactores: any[];
  agendas: any[];
  requesterId: number | null;
}

interface PacienteDetailModalProps {
  visible: boolean;
  onClose: () => void;
  paciente: Paciente | null;
  loading: boolean;
  calcularEdad: (date: string) => number;
}

// interface ApiResponse {
//   status: boolean;
//   msg: string | null;
//   value: Paciente[];
// }

const Paciente: React.FC = () => {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [selectedPaciente, setSelectedPaciente] = useState<Paciente | null>(
    null
  );
  const [detailLoading, setDetailLoading] = useState<boolean>(false);
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [createModalVisible, setCreateModalVisible] = useState<boolean>(false);
  const [filterModalVisible, setFilterModalVisible] = useState<boolean>(false);
  const [form] = Form.useForm();
  const [filterForm] = Form.useForm();

  useEffect(() => {
    fetchData({});
  }, []);

  const fetchData = async (filters: filtersPacient) => {
    try {
      setLoading(true);
      setProgress(0);
      const response = await getPacientes(filters);

      if (response?.data?.status) {
        setPacientes(response.data.value);
        setProgress(100);
      } else {
        message.error("No se pudieron cargar los pacientes");
      }
    } catch (error) {
      console.error(error);
      message.error("Error al cargar los pacientes");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePaciente = async () => {
    try {
      const values = await form.validateFields();
      const pacienteData = {
        ...values,
        birthdate: values.birthdate.toISOString(),
        sexo: values.sexo === "male",
        requesterId: 1, //CAMBIAR POR EL ID DEL USUARIO ACTUAL
      };

      const response = await guardarPaciente(pacienteData);

      if (response?.data?.status) {
        message.success("Paciente creado exitosamente");
        setCreateModalVisible(false);
        form.resetFields();
        fetchData({});
      } else {
        message.error(response?.data?.msg || "Error al crear el paciente");
      }
    } catch (error) {
      console.error(error);
      message.error("Error al procesar el formulario");
    }
  };

  const handleViewDetails = async (id: number) => {
    try {
      setDetailLoading(true);
      const response = await getPacienteById(id);

      if (response?.data?.status) {
        setSelectedPaciente(response.data.value);
        setModalVisible(true);
      } else {
        message.error("No se pudo cargar la información del paciente");
      }
    } catch (error) {
      console.error(error);
      message.error("Error al cargar los detalles del paciente");
    } finally {
      setDetailLoading(false);
    }
  };

  const handleApplyFilters = async () => {
    try {
      const values = await filterForm.validateFields();
      const filters: filtersPacient = {
        ...values,
        sexo:
          values.sexo === "hombre"
            ? true
            : values.sexo === "mujer"
            ? false
            : null,
        birthdate: values.birthdate
          ? values.birthdate.format("YYYY-MM-DD")
          : undefined,
      };

      await fetchData(filters);
      setFilterModalVisible(false);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };
  const handleResetFilters = () => {
    filterForm.resetFields();
    fetchData({});
    setFilterModalVisible(false);
  };

  const calcularEdad = (fechaNacimiento: string): number => {
    const fechaNac = new Date(fechaNacimiento);
    const hoy = new Date();
    let edad = hoy.getFullYear() - fechaNac.getFullYear();
    const mes = hoy.getMonth() - fechaNac.getMonth();

    if (mes < 0 || (mes === 0 && hoy.getDate() < fechaNac.getDate())) {
      edad--;
    }

    return edad;
  };

  if (loading) {
    return (
      <div className="loading-container">
        <Spin tip="Cargando pacientes..." size="large">
          <Progress percent={progress} status="active" showInfo={false} />
        </Spin>
      </div>
    );
  }

  return (
    <div className="paciente-container">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <Title level={2} style={{ margin: 0 }}>
          Listado de Pacientes
        </Title>
        <Button
          style={{ marginRight: 16 }}
          icon={<FilterOutlined />}
          onClick={() => setFilterModalVisible(true)}
        >
          Filtrar
        </Button>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setCreateModalVisible(true)}
        >
          Agregar Paciente
        </Button>
      </div>

      <Row gutter={[16, 16]} justify="center">
        {pacientes.map((paciente) => (
          <Col key={paciente.id} xs={24} sm={12} md={8} lg={8} xl={6}>
            <PacienteCard
              paciente={paciente}
              calcularEdad={calcularEdad}
              onViewDetails={handleViewDetails}
            />
          </Col>
        ))}
      </Row>

      <PacienteDetailModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        paciente={selectedPaciente}
        loading={detailLoading}
        calcularEdad={calcularEdad}
      />

      <Modal
        title="Agregar Nuevo Paciente"
        open={createModalVisible}
        onOk={handleCreatePaciente}
        onCancel={() => {
          setCreateModalVisible(false);
          form.resetFields();
        }}
        okText="Guardar"
        cancelText="Cancelar"
        width={700}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={{
            sexo: "male",
            requesterId: 0,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="iniciales"
                label="Iniciales"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese las iniciales",
                  },
                ]}
              >
                <Input placeholder="Ej: JPG" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="sexo"
                label="Sexo"
                rules={[
                  { required: true, message: "Por favor seleccione el sexo" },
                ]}
              >
                <Radio.Group>
                  <Radio value="male">Masculino</Radio>
                  <Radio value="female">Femenino</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="birthdate"
                label="Fecha de Nacimiento"
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione la fecha de nacimiento",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="telefono"
                label="Teléfono"
                rules={[
                  { required: true, message: "Por favor ingrese el teléfono" },
                ]}
              >
                <Input placeholder="Ej: 04121234567" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="correo"
                label="Correo Electrónico"
                rules={[
                  { required: true, message: "Por favor ingrese el correo" },
                  { type: "email", message: "Correo no válido" },
                ]}
              >
                <Input placeholder="Ej: paciente@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="residencia"
                label="Residencia"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese la residencia",
                  },
                ]}
              >
                <Input placeholder="Ej: Caracas, Venezuela" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="requesterId" label="ID del Solicitante" hidden>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Filtrar Pacientes"
        open={filterModalVisible}
        onOk={handleApplyFilters}
        onCancel={() => setFilterModalVisible(false)}
        footer={[
          <Button key="reset" onClick={handleResetFilters}>
            Limpiar Filtros
          </Button>,
          <Button key="cancel" onClick={() => setFilterModalVisible(false)}>
            Cancelar
          </Button>,
          <Button key="apply" type="primary" onClick={handleApplyFilters}>
            Aplicar Filtros
          </Button>,
        ]}
        width={700}
      >
        <Form form={filterForm} layout="vertical">
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="iniciales" label="Iniciales">
                <Input placeholder="Filtrar por iniciales" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="sexo" label="Sexo">
                <Select placeholder="Seleccione el sexo">
                  <Select.Option value="hombre">Hombre</Select.Option>
                  <Select.Option value="mujer">Mujer</Select.Option>
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="birthdate" label="Fecha de Nacimiento">
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="telefono" label="Teléfono">
                <Input placeholder="Filtrar por teléfono" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item name="correo" label="Correo Electrónico">
                <Input placeholder="Filtrar por correo" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item name="residencia" label="Residencia">
                <Input placeholder="Filtrar por residencia" />
              </Form.Item>
            </Col>
          </Row>
        </Form>
      </Modal>
    </div>
  );
};

interface PacienteCardProps {
  paciente: Paciente;
  calcularEdad: (date: string) => number;
  onViewDetails: (id: number) => void;
}

const PacienteCard: React.FC<PacienteCardProps> = ({
  paciente,
  calcularEdad,
  onViewDetails,
}) => {
  const genero = paciente.sexo ? "Masculino" : "Femenino";
  const edad = calcularEdad(paciente.birthdate);
  const GenderIcon = paciente.sexo ? ManOutlined : WomanOutlined;

  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1 border border-gray-100">
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="bg-white p-2 rounded-full shadow-sm">
            <UserOutlined
              className={`text-lg ${
                paciente.sexo ? "text-blue-500" : "text-pink-500"
              }`}
            />
          </div>
          <h3 className="font-medium text-gray-800">{paciente.iniciales}</h3>
        </div>
        <span
          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            paciente.sexo
              ? "bg-blue-100 text-blue-800"
              : "bg-pink-100 text-pink-800"
          }`}
        >
          <GenderIcon className="mr-1" />
          {genero}
        </span>
      </div>

      <div className="p-4 space-y-3">
        <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div
            className={`p-2 rounded-lg ${
              paciente.sexo ? "bg-blue-100" : "bg-pink-100"
            }`}
          >
            <CalendarOutlined
              className={`text-lg ${
                paciente.sexo ? "text-blue-600" : "text-pink-600"
              }`}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500">Edad</p>
            <p className="font-medium text-gray-800">{edad} años</p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div
            className={`p-2 rounded-lg ${
              paciente.sexo ? "bg-blue-100" : "bg-pink-100"
            }`}
          >
            <MailOutlined
              className={`text-lg ${
                paciente.sexo ? "text-blue-600" : "text-pink-600"
              }`}
            />
          </div>
          <div className="overflow-hidden">
            <p className="text-xs text-gray-500">Correo</p>
            <p className="font-medium text-gray-800 truncate">
              {paciente.correo}
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-3 p-2 hover:bg-gray-50 rounded-lg transition-colors">
          <div
            className={`p-2 rounded-lg ${
              paciente.sexo ? "bg-blue-100" : "bg-pink-100"
            }`}
          >
            <PhoneOutlined
              className={`text-lg ${
                paciente.sexo ? "text-blue-600" : "text-pink-600"
              }`}
            />
          </div>
          <div>
            <p className="text-xs text-gray-500">Teléfono</p>
            <p className="font-medium text-gray-800">{paciente.telefono}</p>
          </div>
        </div>
      </div>
      <div className="px-4 py-3 bg-gray-50 border-t border-gray-200">
        <button
          onClick={() => onViewDetails(paciente.id)}
          className={`w-full flex items-center justify-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            paciente.sexo
              ? "bg-blue-100 text-blue-700 hover:bg-blue-200"
              : "bg-pink-100 text-pink-700 hover:bg-pink-200"
          }`}
        >
          <IdcardOutlined />
          <span>Ver detalles</span>
        </button>
      </div>
    </div>
  );
};

interface PacienteDetailModalProps {
  visible: boolean;
  onClose: () => void;
  paciente: Paciente | null;
  loading: boolean;
  calcularEdad: (date: string) => number;
}

const PacienteDetailModal: React.FC<PacienteDetailModalProps> = ({
  visible,
  onClose,
  paciente,
  loading,
  calcularEdad,
}) => {
  const [representanteModalVisible, setRepresentanteModalVisible] =
    useState(false);
  const [representanteForm] = Form.useForm();
  const [refreshData, setRefreshData] = useState(false);

  const GenderIcon = paciente?.sexo ? ManOutlined : WomanOutlined;
  const genero = paciente?.sexo ? "Masculino" : "Femenino";
  const edad = paciente ? calcularEdad(paciente.birthdate) : 0;
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString("es-ES", options);
  };

  const handleAddRepresentante = async () => {
    try {
      const values = await representanteForm.validateFields();
      const representanteData = {
        ...values,
        birthdate: values.birthdate.toISOString(),
        sexo: values.sexo === "male",
        pacienteId: paciente?.id,
        requesterId: 1, // Cambiar por el ID
      };

      const response = await guardarRepresentante(representanteData);
      message.success("Representante creado exitosamente");
      setRepresentanteModalVisible(false);
      representanteForm.resetFields();
      setRefreshData(!refreshData);
      onClose();
    } catch (error) {
      console.error(error);
      message.error("Error al procesar el formulario");
    }
  };

  return (
    <>
      <Modal
        open={visible}
        onCancel={onClose}
        footer={null}
        width={1000}
        centered
        closeIcon={
          <CloseOutlined className="text-gray-500 hover:text-gray-700 transition-colors" />
        }
        className="rounded-2xl overflow-hidden shadow-xl"
        bodyStyle={{ padding: 0 }}
      >
        <Spin spinning={loading}>
          {paciente && (
            <div className="flex flex-col h-full">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-6 flex items-center space-x-4 border-b border-gray-200">
                <div className="bg-white p-3 rounded-full shadow-sm">
                  <UserOutlined className="text-2xl text-blue-500" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h3 className="text-xl font-semibold text-gray-800">
                      Detalles del Paciente: {paciente.iniciales}
                    </h3>
                    <span
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        paciente.sexo
                          ? "bg-blue-100 text-blue-800"
                          : "bg-pink-100 text-pink-800"
                      }`}
                    >
                      <GenderIcon className="mr-1" />
                      {genero}
                    </span>
                  </div>
                  <p className="text-gray-600 mt-1">ID: {paciente.id}</p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="font-medium text-gray-500 mb-3">
                      Información personal
                    </h4>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2">
                        <CalendarOutlined className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Edad</p>
                          <p className="text-gray-700">{edad} años</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <CalendarOutlined className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">
                            Fecha Nacimiento
                          </p>
                          <p className="text-gray-700">
                            {formatDate(paciente.birthdate)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <PhoneOutlined className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Teléfono</p>
                          <p className="text-gray-700">{paciente.telefono}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <MailOutlined className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Correo</p>
                          <p className="text-gray-700 hover:text-blue-600 transition-colors cursor-pointer">
                            {paciente.correo}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <HomeOutlined className="text-gray-400" />
                        <div>
                          <p className="text-xs text-gray-500">Residencia</p>
                          <p className="text-gray-700">{paciente.residencia}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <h4 className="font-medium text-gray-500 mb-3">
                      Representantes ({paciente.representantes.length})
                    </h4>
                    {paciente.representantes.length === 0 && (
                      <Button
                        type="primary"
                        size="small"
                        icon={<PlusOutlined />}
                        onClick={() => setRepresentanteModalVisible(true)}
                      >
                        Agregar Representante
                      </Button>
                    )}
                    {paciente.representantes.length > 0 ? (
                      <div className="space-y-3 max-h-64 overflow-y-auto">
                        {paciente.representantes.map((rep) => (
                          <div
                            key={rep.id}
                            className="p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                          >
                            <div className="flex items-center space-x-2 mb-1">
                              <UserOutlined className="text-gray-400" />
                              <p className="font-medium text-gray-800">
                                {rep.nombre} {rep.apellido}
                              </p>
                              <Tag
                                color={rep.sexo ? "blue" : "pink"}
                                className="text-xs"
                              >
                                {rep.sexo ? "Hombre" : "Mujer"}
                              </Tag>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <p className="text-xs text-gray-500">
                                  Teléfono
                                </p>
                                <p>{rep.telefono}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Correo</p>
                                <p className="truncate">{rep.correo}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Afinidad
                                </p>
                                <p>{rep.afinidad}</p>
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">
                                  Nacimiento
                                </p>
                                <p>{formatDate(rep.birthdate)}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-400">
                        No tiene representantes registrados
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-500">
                          Factores Psicológicos ({paciente.psicofactores.length}
                          )
                        </h4>
                      </div>
                      {paciente.psicofactores.length > 0 ? (
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {paciente.psicofactores.map((factor) => (
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
                      <div className="flex items-center justify-between mb-3">
                        <h4 className="font-medium text-gray-500">
                          Factores Biológicos ({paciente.biofactores.length})
                        </h4>
                      </div>
                      {paciente.biofactores.length > 0 ? (
                        <div className="space-y-3 max-h-48 overflow-y-auto">
                          {paciente.biofactores.map((factor) => (
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

                <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                  <h4 className="font-medium text-gray-500 mb-3">
                    Historial de Citas ({paciente.agendas.length})
                  </h4>
                  {paciente.agendas.length > 0 ? (
                    <div className="space-y-4">
                      {paciente.agendas.map((agenda) => (
                        <div
                          key={agenda.id}
                          className="p-4 bg-gray-50 rounded-lg"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <div>
                              <p className="font-medium text-gray-800">
                                {formatDate(agenda.fecha)}
                              </p>
                              <p className="text-sm text-gray-600">
                                Especialista: {agenda.especialista}
                              </p>
                            </div>
                            <Tag color="blue">Cita #{agenda.id}</Tag>
                          </div>

                          <p className="text-sm mb-3">{agenda.resumen}</p>

                          {agenda.prediagnostico && (
                            <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                              <h5 className="font-medium text-blue-800 mb-2">
                                Prediagnóstico
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <p className="text-sm font-medium">
                                    Veredicto:
                                  </p>
                                  <p className="text-sm">
                                    {agenda.prediagnostico.veredicto}
                                  </p>
                                </div>
                                <div>
                                  <p className="text-sm font-medium">
                                    Test aplicado:
                                  </p>
                                  <p className="text-sm">
                                    {agenda.prediagnostico.test?.nombre}
                                  </p>
                                </div>
                              </div>

                              {agenda.prediagnostico.test && (
                                <div className="mt-3">
                                  <Collapse ghost>
                                    <Collapse.Panel
                                      header="Ver detalles del test"
                                      key="1"
                                      className="text-sm"
                                    >
                                      <p className="mb-2">
                                        {agenda.prediagnostico.test.descripcion}
                                      </p>
                                      <p className="text-xs text-gray-500 mb-3">
                                        Sistema de puntaje:{" "}
                                        {
                                          agenda.prediagnostico.test
                                            .sistema_puntaje
                                        }
                                      </p>

                                      <h6 className="font-medium mb-2">
                                        Preguntas:
                                      </h6>
                                      <div className="space-y-3">
                                        {agenda.prediagnostico.test.preguntas.map(
                                          (pregunta: any) => (
                                            <div
                                              key={pregunta.id}
                                              className="p-2 bg-white rounded border"
                                            >
                                              <p className="font-medium text-sm">
                                                {pregunta.num_pregunta}.{" "}
                                                {pregunta.pregunta}
                                              </p>
                                              <div className="mt-1">
                                                {pregunta.puntajepregs.map(
                                                  (puntaje: any) => (
                                                    <Tag
                                                      key={puntaje.id}
                                                      className="m-1"
                                                    >
                                                      {puntaje.nombre}:{" "}
                                                      {puntaje.valor}
                                                    </Tag>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )
                                        )}
                                      </div>
                                    </Collapse.Panel>
                                  </Collapse>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 text-gray-400">
                      No tiene citas registradas
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
                <button
                  onClick={onClose}
                  className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-full text-gray-700 hover:bg-gray-100 transition-colors shadow-sm"
                >
                  <ArrowLeftOutlined />
                  <span>Volver al listado</span>
                </button>
              </div>
            </div>
          )}
        </Spin>
      </Modal>
      <Modal
        title="Agregar Nuevo Representante"
        open={representanteModalVisible}
        onOk={handleAddRepresentante}
        onCancel={() => {
          setRepresentanteModalVisible(false);
          representanteForm.resetFields();
        }}
        okText="Guardar"
        cancelText="Cancelar"
        width={700}
      >
        <Form
          form={representanteForm}
          layout="vertical"
          initialValues={{
            sexo: "male",
            pacienteId: paciente?.id,
            requesterId: 1,
          }}
        >
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="nombre"
                label="Nombre"
                rules={[
                  { required: true, message: "Por favor ingrese el nombre" },
                ]}
              >
                <Input placeholder="Ej: Juan" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="apellido"
                label="Apellido"
                rules={[
                  { required: true, message: "Por favor ingrese el apellido" },
                ]}
              >
                <Input placeholder="Ej: Pérez" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="sexo"
                label="Sexo"
                rules={[
                  { required: true, message: "Por favor seleccione el sexo" },
                ]}
              >
                <Radio.Group>
                  <Radio value="male">Masculino</Radio>
                  <Radio value="female">Femenino</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="afinidad"
                label="Afinidad"
                rules={[
                  { required: true, message: "Por favor ingrese la afinidad" },
                ]}
              >
                <Input placeholder="Ej: Padre/Madre/Tutor" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="birthdate"
                label="Fecha de Nacimiento"
                rules={[
                  {
                    required: true,
                    message: "Por favor seleccione la fecha de nacimiento",
                  },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="YYYY-MM-DD"
                  disabledDate={(current) =>
                    current && current > dayjs().endOf("day")
                  }
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="telefono"
                label="Teléfono"
                rules={[
                  { required: true, message: "Por favor ingrese el teléfono" },
                ]}
              >
                <Input placeholder="Ej: 04121234567" />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="correo"
                label="Correo Electrónico"
                rules={[
                  { required: true, message: "Por favor ingrese el correo" },
                  { type: "email", message: "Correo no válido" },
                ]}
              >
                <Input placeholder="Ej: representante@example.com" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                name="residencia"
                label="Residencia"
                rules={[
                  {
                    required: true,
                    message: "Por favor ingrese la residencia",
                  },
                ]}
              >
                <Input placeholder="Ej: Caracas, Venezuela" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item name="pacienteId" hidden>
            <Input type="number" />
          </Form.Item>
          <Form.Item name="requesterId" hidden>
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Paciente;
