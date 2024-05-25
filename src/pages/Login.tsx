import { SyntheticEvent, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import logo from "../assets/asdf.jpg";
import brgylogo from "../assets/brgy.jpg";
import {
  ActionFunctionArgs,
  Link,
  redirect,
  useNavigate,
} from "react-router-dom";
import { useLoginMutation } from "../slices/facultyApiSlice";
import { RootState } from "../store";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [login, { isLoading }] = useLoginMutation();

  const { facultyInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (facultyInfo) {
      navigate("/");
    }
  }, [facultyInfo]);

  const togglePassword = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await login({ email, password }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err: any) {
      toast.error("Invalid email or password");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={submit}
        className="flex flex-col gap-3 rounded-box bg-base-200 p-6 max-w-md w-full my-44 shadow-lg"
      >
        <div className="flex justify-center items-center gap-4">
          <img src={brgylogo} alt="" className="w-32 h-32" />{" "}
          <img src={logo} alt="" className="w-32 h-32" />{" "}
        </div>
        <h1 className="text-2xl font-bold self-center my-1">Daycare Management System</h1>
        <h1 className="text-2xl font-bold self-center">Log In</h1>

        <span className="self-center">
          Don't have an account?{" "}
          <Link to="/signup" className="link link-secondary">
            Register
          </Link>
        </span>

        <label className="form-control">
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered"
            required
            name="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="form-control w-full">
          <div className="inline-flex items-center relative">
            <button
              type="button"
              className="btn btn-ghost btn-sm btn-circle absolute right-0 mr-2"
              onClick={togglePassword}
            >
              {showPassword ? (
                <FaEye className="text-lg" />
              ) : (
                <FaEyeSlash className="text-lg" />
              )}
            </button>

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="input input-bordered pr-11 w-full"
              required
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </label>
        {/* <div className="form-control">
      <label className="cursor-pointer label self-start gap-2">
        <input type="checkbox" className="checkbox" />
        <span className="label-text">Remember me</span>
      </label>
    </div> */}
        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Log in"
          )}
        </button>
        <div className="form-control self-center">
          {/* <a href="#" className="label-text link link-accent ">
        Forgot password?
      </a> */}
        </div>
      </form>
    </div>
  );
};

const loginAction = async ({ request }: ActionFunctionArgs) => {
  // console.log(request);
  const data = await request.formData();

  const submission = {
    email: data.get("email"),
    password: data.get("password"),
  };

  // send post req
  console.log(submission);
  const response = await fetch("http://localhost:8080/faculty/login", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });

  if (response.ok) {
    return redirect("/");
  } else {
    return redirect("/signup");
  }
};

export { Login as default, loginAction };
