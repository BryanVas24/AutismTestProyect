import { useState, useEffect } from "react";
import {
  FaUserInjured,
  FaSignOutAlt,
  FaHome,
  FaBars,
  FaTimes,
  FaUserPlus,
  FaDiagnoses,
} from "react-icons/fa";
import { GrUserManager } from "react-icons/gr";
import { NavLink } from "react-router-dom";
import { useStore } from "../../context/store";
import { toast } from "react-toastify";
import { AiOutlineAudit } from "react-icons/ai";
import { TfiAgenda } from "react-icons/tfi";
import { MdDashboard } from "react-icons/md";
import { AiOutlineContainer } from "react-icons/ai";

export default function SideBar() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  const user = useStore((state) => state.user);
  const setUser = useStore((state) => state.setUser);

  const navLinks = [
    { to: "/sistem", icon: <FaHome size={20} />, label: "Inicio" },
    {
      to: "/sistem/usuarios",
      icon: <FaUserPlus size={20} />,
      label: "Usuarios",
    },
    {
      to: "/sistem/paciente",
      icon: <FaUserInjured size={20} />,
      label: "Pacientes",
    },
    {
      to: "/sistem/representante",
      icon: <GrUserManager size={20} />,
      label: "Representantes",
    },
    {
      to: "/sistem/agenda",
      icon: <TfiAgenda size={20} />,
      label: "Agenda",
    },
    {
      to: "/sistem/dashboard",
      icon: <MdDashboard size={20} />,
      label: "Dashboard",
    },
    {
      to: "/sistem/prediagnostico",
      icon: <FaDiagnoses size={20} />,
      label: "Pre-Diagnóstico",
    },
    // ...(user?.rol == 0 || user?.rol == 1
    //   ? [
    //       {
    //         to: "/sistem/prediagnostico",
    //         icon: <FaDiagnoses size={20} />,
    //         label: "Pre-Diagnóstico",
    //       },
    //     ]
    //   : []),
    ...(user?.rol == 2
      ? [
          {
            to: "/sistem/auditoria",
            icon: <AiOutlineAudit size={20} />,
            label: "Auditoría",
          },
          {
            to: "/sistem/tests",
            icon: <AiOutlineContainer size={20} />,
            label: "Tests",
          },
        ]
      : []),
  ];

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 768) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      {/* Botón de fucking menú pa movil */}
      <button
        onClick={toggleSidebar}
        className="md:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-blue-600 text-white"
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {/* Sidebar */}
      <div
        className={`${isOpen ? "translate-x-0" : "-translate-x-full"} 
        md:translate-x-0 fixed md:static w-64 min-h-screen bg-white shadow-md 
        flex flex-col transition-transform duration-300 ease-in-out z-40`}
      >
        {/* esto puede ser el logo */}
        <div className="p-5 border-b border-gray-200">
          <h1 className="text-xl font-bold text-blue-600">DownTec</h1>
          <p className="text-xs text-gray-500">Gestión de Pacientes</p>
        </div>

        {/* Navegación */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === "/sistem"}
                  onClick={() => isMobile && setIsOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center p-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600 font-medium border-l-4 border-blue-500"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <span className="mr-3">{link.icon}</span>
                  <span>{link.label}</span>
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        {/* Pie de página */}
        <div className="p-4 border-t border-gray-200 text-center">
          <h4>
            {user?.nombre} {user?.apellido}
          </h4>
          <button
            onClick={() => {
              setUser(null);
              toast.success("Cerraste la sesión con éxito");
            }}
            className="flex items-center w-full p-3 text-gray-600 rounded-lg hover:bg-red-50 transition-colors hover:cursor-pointer"
          >
            <FaSignOutAlt className="mr-3" />
            <span>Cerrar sesión</span>
          </button>
        </div>
      </div>

      {/* Overlay para móviles */}
      {isOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
