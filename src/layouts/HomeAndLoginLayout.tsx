import { Outlet } from "react-router-dom";
import Footer from "../components/ui/Footer";

export default function HomeAndLoginLayout() {
  return (
    <>
      <Outlet />
      <Footer />
    </>
  );
}
