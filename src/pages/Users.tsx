import { useState } from "react";
import { FaPlusCircle } from "react-icons/fa";
import Modal from "../components/shared/Moda";
import UserForm from "../components/forms/UserForm";

export default function Users() {
  const [isOpen, setIsOpen] = useState(false);

  const openModal = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between p-5 ">
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

      <Modal isOpen={isOpen} onClose={openModal} title="Agregar usuario">
        <div>
          <UserForm onClose={openModal} />
        </div>
      </Modal>
    </>
  );
}
