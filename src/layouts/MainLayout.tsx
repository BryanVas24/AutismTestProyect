import { Outlet } from "react-router-dom";
import SideBar from "../components/ui/SideBar";
import Footer from "../components/ui/Footer";

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <SideBar />
      <div className="flex-1 flex flex-col transition-all duration-300">
        <main className="flex-1 p-4 md:p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  );
}
