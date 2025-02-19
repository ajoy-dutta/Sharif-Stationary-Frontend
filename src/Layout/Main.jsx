import { Outlet} from "react-router-dom";
// import Navbar from "../Components/Navbar/Navbar";\
import Footer from "../Components/Footer/Footer";
import Navbar from "../Pages/DashboardPage/Dashboard";

const Main=() => {
    return (
        <div>
            <Navbar></Navbar>
            <Outlet></Outlet>
            <Footer></Footer>
        </div>
    )
}

export default Main;
