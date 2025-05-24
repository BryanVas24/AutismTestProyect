import LoginForm from "../components/forms/LoginForm";
import loginImage1 from "/loginImage.avif";
import loginImage2 from "/loginImage2.jpg";
export default function Login() {
  return (
    <main className="flex flex-col lg:flex-row">
      <section className="lg:w-1/2 p-5 relative lg:mb-10">
        <img
          className="rounded-md"
          src={loginImage1}
          alt="imagen de un medico"
        />
        <div className=" hidden lg:flex justify-end">
          <img
            className="rounded-md -m-10"
            src={loginImage2}
            alt="imagen de más medicos"
          />
        </div>
      </section>
      <section className="lg:w-1/2  px-5 lg:py-10 flex flex-col justify-center">
        <h1 className="text-center text-4xl text-sky-500 font-bold">
          Inicia sesión
        </h1>
        <p className="text-gray-700 text-center text-lg">
          Introduce tus credenciales para poder acceder al sistema
        </p>
        {/*Acá esta el fucking forumlario, lo separe porque si */}
        <LoginForm />
      </section>
    </main>
  );
}
