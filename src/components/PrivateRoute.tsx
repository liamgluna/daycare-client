import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";
import { RootState } from "../store";

const PrivateRoute = () => {
  const { facultyInfo } = useSelector((state: RootState) => state.auth);
  return facultyInfo ? <Outlet /> : <Navigate to="/login" replace />;
};
export default PrivateRoute;
