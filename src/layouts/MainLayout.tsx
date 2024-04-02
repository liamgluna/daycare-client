import { Outlet, useNavigation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";

const MainLayout = () => {
  const navigation = useNavigation();
  return (
    <div className="flex">
      <Sidebar />
      {navigation.state === "loading" && (
        <span className="loading loading-spinner loading-md"></span>
      )}
      <div className="flex-grow">
        {navigation.state !== "loading" && <Outlet />}
      </div>

      <ToastContainer />
    </div>
  );
};

export default MainLayout;
