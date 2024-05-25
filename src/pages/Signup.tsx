import { SyntheticEvent, useEffect, useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa6";
import { useDispatch, useSelector } from "react-redux";
import {
  ActionFunctionArgs,
  Link,
  redirect,
  useNavigate,
} from "react-router-dom";
import { useSignupMutation } from "../slices/facultyApiSlice";
import { RootState } from "../store";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";
import logo from "../assets/asdf.jpg";
import brgylogo from "../assets/brgy.jpg";

const Signup = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [signup, { isLoading }] = useSignupMutation();

  const { facultyInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    if (facultyInfo) {
      navigate("/");
    }
  }, [facultyInfo]);

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await signup({
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      navigate("/");
    } catch (err) {
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
        <h1 className="text-2xl font-bold self-center my-1">
          Daycare Management System
        </h1>
        <h1 className="text-2xl font-bold self-center">Create an account</h1>

        <span className="self-center">
          Already have an account? {""}
          <Link to="/login" className="link link-secondary">
            Log In
          </Link>
        </span>

        <div className="flex">
          <div className="w-1/2 mr-4">
            <label className="form-control">
              <input
                type="text"
                placeholder="First Name"
                className="input input-bordered w-full"
                required
                name="firstName"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
          </div>

          <div className="w-1/2">
            <label className="form-control">
              <input
                type="text"
                placeholder="Last Name"
                className="input input-bordered w-full"
                required
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>
        </div>

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
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              className="input input-bordered pr-11 w-full"
              required
              name="password"
              onChange={(e) => setPassword(e.target.value)}
            />
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
          </div>
        </label>

        {/* <div className="form-control">
          <label className="cursor-pointer label self-start gap-2">
            <input type="checkbox" className="checkbox" />
            <span className="label-text">
              I accept the {""}
              <a href="#" className="link link-accent">
                Terms and Conditions
              </a>
            </span>
          </label>
        </div> */}

        <button type="submit" className="btn btn-primary" disabled={isLoading}>
          {isLoading ? (
            <span className="loading loading-spinner"></span>
          ) : (
            "Sign Up"
          )}
        </button>
      </form>
    </div>
  );
};

const signupAction = async ({ request }: ActionFunctionArgs) => {
  // console.log(request);
  const data = await request.formData();

  const submission = {
    first_name: data.get("firstName"),
    last_name: data.get("lastName"),
    email: data.get("email"),
    password: data.get("password"),
  };

  // send post req
  console.log(submission);
  const response = await fetch("http://localhost:8080/faculty", {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(submission),
  });

  if (response.ok) {
    return redirect("/login");
  } else {
    return redirect("/signup");
  }
};

export { Signup as default, signupAction };
