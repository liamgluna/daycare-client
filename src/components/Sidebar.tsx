import { NavLink } from "react-router-dom";
import {
  FaSchoolFlag,
  FaChildren,
  FaListUl,
  FaUser,
  FaDoorOpen,
} from "react-icons/fa6";
import logo from "../assets/asdf.jpg";
import brgylogo from "../assets/brgy.jpg";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/facultyApiSlice";
import { logout } from "../slices/authSlice";
const Sidebar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall({}).unwrap();
      dispatch(logout());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };
  return (
    <aside className="h-screen sticky top-0 overflow-y-auto w-72 py-6 px-4 bg-base-200">
      <div className="flex justify-center items-center gap-4">
        <img src={brgylogo} alt="" className="w-24 h-24" />{" "}
        <img src={logo} alt="" className="w-24 h-24" />{" "}
      </div>
      <NavLink to="/" className="btn btn-ghost font-bold text-xl">
        Brgy. Tabid Daycare
      </NavLink>

      <ul className="menu px-0">
        <li className="menu-title">Dashboard</li>
        <li>
          <NavLink to="/profile">
            <FaUser className="text-lg" />
            Profile
          </NavLink>
        </li>
        <li>
          <NavLink to="/classes">
            <FaSchoolFlag className="text-lg" />
            Classes
          </NavLink>
        </li>
        <li>
          <NavLink to="/students">
            <FaChildren className="text-lg" />
            Students
          </NavLink>
        </li>
        <li>
          <NavLink to="/attendance">
            <FaListUl className="text-lg" />
            Attendance
          </NavLink>
        </li>
        {/* <li>
          <NavLink to="/settings">
            <FaGear className="text-lg" />
            Settings
          </NavLink>
        </li> */}
        <li>
          <button onClick={logoutHandler}>
            <FaDoorOpen className="text-lg" />
            Logout
          </button>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
