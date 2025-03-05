import { Outlet } from "react-router-dom";
import Navbar from "../Components/Navbar/Navbar";
import Footer from "../Components/Footer/Footer";

const Main = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
     
      <main className="flex-grow p-4">
        <Outlet />
      </main>

      <Footer />
    </div>
  );
};

export default Main;
