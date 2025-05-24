import { FaFacebookSquare } from "react-icons/fa";
import {
  FaLinkedin,
  FaSquareInstagram,
  FaSquareWhatsapp,
} from "react-icons/fa6";

export default function Footer() {
  //Si quieren meter a la Andrea hay la meten
  const nombres = [
    "Xavier Alexander Avila posada",
    "Bryan Alberto Vásquez Farfán",
    "Oscar Ernesto Portillo Cerón",
    "Kevin Daniel Rodriguez Martinez",
    "José Luis Calderón Córtez",
  ];

  return (
    <footer className="bg-slate-500 p-5 ">
      <section className="flex flex-col lg:flex-row mb-3 justify-between text-white">
        <div>
          <h2 className="text-xl font-bold">Autores:</h2>
          <hr />
          {nombres.map((nombre, i) => (
            <h3 key={i} className="hover:text-sky-500 cursor-default">
              {nombre}
            </h3>
          ))}
        </div>
        <div>
          <h2 className="text-xl font-bold text-center">Nuestras redes:</h2>
          <hr />
          <div className="flex gap-5 my-3">
            <FaSquareInstagram
              className="hover:scale-105 hover:text-sky-500 transition"
              size={45}
            />
            <FaFacebookSquare
              className="hover:scale-105 hover:text-sky-500 transition"
              size={45}
            />
            <FaSquareWhatsapp
              className="hover:scale-105 hover:text-sky-500 transition"
              size={45}
            />
            <FaLinkedin
              className="hover:scale-105 hover:text-sky-500 transition"
              size={45}
            />
          </div>
        </div>
        <div className="text-white">
          <h2 className="text-xl font-bold">Contacto</h2>
          <hr />
          <p>Email: ejemplo@correo.com</p>
          <p>Teléfono: +503 1234-5678</p>
          <p>dirección: ciudad real y metapan</p>
        </div>
      </section>

      <p className="text-center w-full text-sm">creado por nosotros 👍</p>
    </footer>
  );
}
