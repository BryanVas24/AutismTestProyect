import CardForInformation from "../components/common/CardForInformation";
import medicos from "/headerHomeimage.jpg";
import medicaExamen from "/sectionHomeimage.jpg";
import { autismMedicalData } from "../data/CardInformationInfo";
import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="relative">
      {/*Vaya majes esto es lo de la puta imagen */}
      <header className="flex justify-center p-5">
        <img className="lg:w-4/5 lg:h-[70vh]" src={medicos} alt="doctores" />
      </header>

      {/*esto es lo de las fucking cards */}
      <section className="flex flex-col lg:flex-row justify-evenly w-11/12 gap-5 mx-auto -mt-20 mb-10 ">
        {autismMedicalData.map((autismData) => (
          <CardForInformation
            key={autismData.title}
            title={autismData.title}
            description={autismData.description}
            icon={autismData.icon}
          />
        ))}
      </section>
      {/*esto es lo fucking demas */}
      <section className="container mx-auto bg-gray-50 p-5 rounded-md flex flex-col lg:flex-row justify-between mb-10 shadow-xl">
        <div className="lg:w-1/2">
          <h2 className="text-4xl font-bold text-sky-500">
            Haz tu prueba de autismo con nosotros
          </h2>
          <p className="p-5">
            Si sospechas que tú o alguien cercano podría estar en el espectro
            autista, acércate a nosotros. Realizamos evaluaciones profesionales,
            confidenciales y con un enfoque comprensivo. Obtén claridad,
            orientación y apoyo personalizado. ¡El primer paso hacia el
            entendimiento empieza aquí!
          </p>
          <p className="p-5 shadow">
            <strong>El autismo no es una etiqueta</strong>, sino una forma
            diferente de experimentar el mundo. Si buscas respuestas, en nuestro
            equipo encontrarás una evaluación profesional, sin juicios y
            adaptada a tus necesidades. Conoce más sobre ti con apoyo
            especializado.
          </p>
          <button className="my-10 hover:scale-105 transition ease-in-out hover:shadow-xl ">
            <Link
              className=" bg-sky-500 text-xl  hover:bg-sky-600 text-white p-2 rounded-md"
              to={"/dashboard"}
            >
              Más información acá
            </Link>
          </button>
        </div>
        <div>
          <img
            className="rounded-md "
            src={medicaExamen}
            alt="imagen que indica que hagas el examen con nosotros"
          />
        </div>
      </section>
    </main>
  );
}
