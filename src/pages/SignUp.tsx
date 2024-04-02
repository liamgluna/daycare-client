import { useState } from "react";
import { FaEye, FaEyeSlash, FaGoogle } from "react-icons/fa6";
import { Link } from "react-router-dom";

const Signup = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <div className="flex justify-center items-center">
      <div className="flex flex-col gap-3 rounded-box bg-base-200 p-6 max-w-md w-full">
        <h1 className="text-3xl font-bold self-center">Create an account</h1>

        <span className="self-center">
          Already have an account? {""}
          <Link to="/login" className="link link-secondary">
            Log In
          </Link>
        </span>

        <a href="#" className="btn btn-neutral">
          <i className="fab fa-google text-primary"></i>
          <FaGoogle className="text-primary" />
          Create with Google
        </a>

        <div className="divider ">OR</div>

        <div className="flex">
          <div className="w-1/2 mr-4">
            <label className="form-control">
              <input
                type="text"
                placeholder="First Name"
                className="input input-bordered w-full"
              />
            </label>
          </div>

          <div className="w-1/2">
            <label className="form-control">
              <input
                type="text"
                placeholder="Last Name"
                className="input input-bordered w-full"
              />
            </label>
          </div>
        </div>

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
              placeholder="New Password"
              className="input input-bordered pr-11 w-full"
            />
          </div>
        </label>

        <div className="form-control">
          <label className="cursor-pointer label self-start gap-2">
            <input type="checkbox" className="checkbox" />
            <span className="label-text">
              I accept the {""}
              <a href="#" className="link link-accent">
                Terms and Conditions
              </a>
            </span>
          </label>
        </div>

        <button className="btn btn-primary">Create</button>
      </div>
    </div>
  );
};

export default Signup;
