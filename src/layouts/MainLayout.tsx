import { Outlet, useNavigation } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import Sidebar from "../components/Sidebar";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const MainLayout = () => {
  const navigation = useNavigation();
  const { facultyInfo } = useSelector((state: RootState) => state.auth);

  return (
    <div className="flex">
      {facultyInfo && <Sidebar />}

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
