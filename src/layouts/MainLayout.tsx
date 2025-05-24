import { Outlet } from "react-router-dom";
import NavBar from "../components/ui/NavBar";
import Footer from "../components/ui/Footer";

export default function MainLayout() {
  return (
    <>
      <NavBar />
      <Outlet />
      <Footer />
    </>
  );
}
