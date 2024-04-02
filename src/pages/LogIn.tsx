import { useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa6";
import { Link } from "react-router-dom";

const LogIn = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-3 rounded-box bg-base-200 p-6 max-w-md w-full">
        <h1 className="text-3xl font-bold self-center">Log in</h1>

        <span className="self-center">
          Don't have an account? {""}
          <Link to="/signup" className="link link-secondary">
            Register
          </Link>
        </span>

        <a href="#" className="btn btn-neutral">
          <FaGoogle className="text-primary" />
          Log in with Google
        </a>

        <div className="divider">OR</div>

        <label className="form-control">
          <input
            type="email"
            placeholder="Email"
            className="input input-bordered"
          />
        </label>

        <label className="form-control w-full">
          <div className="inline-flex items-center relative">
            <button
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
            />
          </div>
        </label>
        <div className="form-control">
          <label className="cursor-pointer label self-start gap-2">
            <input type="checkbox" className="checkbox" />
            <span className="label-text">Remember me</span>
          </label>
        </div>
        <button className="btn btn-primary">Log in</button>
        <div className="form-control self-center">
          <a href="#" className="label-text link link-accent ">
            Forgot password?
          </a>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
