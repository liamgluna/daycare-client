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
    <div className="relative flex">
      {facultyInfo && <Sidebar />}

      {navigation.state === "loading" && (
        <div className="absolute inset-0 flex justify-center items-center z-50"> {/* Centered loading icon */}
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}

      <div className="flex-grow">
        {navigation.state !== "loading" && <Outlet />}
      </div>

      <ToastContainer />
    </div>
  );
};

export default MainLayout;
