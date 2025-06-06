import { useEffect, useState } from "react";
import Modal from "../components/shared/Moda";
import NewAgenda from "../components/forms/NewAgendaForm";
import { useStore } from "../context/store";
import { getUsers } from "../api/UserModuleApi";
import type { User } from "../types/general";
import { getPacientes } from "../api/PacientesAPI";

export default function Agenda() {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [especialists, setEspecialists] = useState([]);
  const [pacients, setPacients] = useState([]);

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
      const data = await getPacientes();
      if (data != null) setPacients(data.data.value);
    } catch (error) {
      console.error("Error al cargar usuarios:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEspecialists();
    loadPacients();
  }, []);

  const handleOpenModal = () => {
    setIsOpen(!isOpen);
  };
  console.log(especialists);
  return (
    <>
      <h1 className="text-4xl font-bold text-sky-500 p-2">Modulo de agenda</h1>
      <button
        onClick={handleOpenModal}
        className="text-white bg-sky-500 rounded-lg p-2 my-5 hover:bg-sky-600 hover:scale-110 transition ease-in-out cursor-pointer font-bold"
      >
        Agregar a agenda
      </button>

      <Modal isOpen={isOpen} title="Agregar agenda" onClose={handleOpenModal}>
        <NewAgenda
          especialists={especialists}
          isLoading={loading}
          pacients={pacients}
          requesterId={user!.id}
        />
      </Modal>
    </>
  );
}
