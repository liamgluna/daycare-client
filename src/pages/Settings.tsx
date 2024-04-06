import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useLogoutMutation } from "../slices/facultyApiSlice";
import { logout } from "../slices/authSlice";

const Settings = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [logoutApiCall] = useLogoutMutation();

  const logoutHandler = async () => {
    try {
      await logoutApiCall({}).unwrap();
      dispatch(logout({}));
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <label>Dark Mode</label>
      <input type="checkbox" value="dark" className="toggle theme-controller" />
      <button onClick={logoutHandler} className="btn btn-primary">
        Logout
      </button>
    </div>
  );
};

export default Settings;
