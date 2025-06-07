import { Modal } from "antd";
import { CloseOutlined } from "@ant-design/icons";
import type { FormEvent } from "react";

export type agendaProps = {
  open: boolean;
  onClose: () => void;
  tipe: string;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
};

const ModalCrearFactor = ({
  open,
  onClose,
  tipe,
  handleSubmit,
}: agendaProps) => {
  const inputs = [
    { label: "Nombre", type: "text", name: "factor" },
    { label: "Descripcion", type: "text", name: "descripcion" },
    { label: "Fecha", type: "date", name: "fecha" },
  ];

  return (
    <Modal
      title={`Crear ${tipe}`}
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
      <form
        onSubmit={handleSubmit}
        className="space-y-4 p-6 bg-white rounded-lg shadow-md"
      >
        {inputs.map((input) => (
          <div key={input.name} className="flex flex-col">
            <label className="text-sm font-medium text-gray-700 mb-2">
              {input.label}
            </label>
            <input
              type={input.type}
              name={input.name}
              required
              className="border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Crear {tipe}
        </button>
      </form>
    </Modal>
  );
};

export default ModalCrearFactor;
