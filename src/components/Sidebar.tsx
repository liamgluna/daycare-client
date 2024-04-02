import { NavLink } from "react-router-dom";
import {
  FaSchoolFlag,
  FaChildren,
  FaListUl,
  FaUser,
  FaGear,
} from "react-icons/fa6";
const Sidebar = () => {
  return (
    <aside className="h-screen sticky top-0 overflow-y-auto w-72 py-6 px-4 bg-base-200">
      <NavLink to="/" className="btn btn-ghost font-bold text-xl">
        🌞Brgy. Tabid Daycare
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
        <li>
          <NavLink to="/settings">
            <FaGear className="text-lg" />
            Settings
          </NavLink>
        </li>
      </ul>
    </aside>
  );
};

export default Sidebar;
