import { SyntheticEvent, useState } from "react";
import { FaGoogle, FaEye, FaEyeSlash } from "react-icons/fa6";
import { ActionFunctionArgs, Form, Link, redirect } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const togglePassword = (e: SyntheticEvent) => {
    e.preventDefault();
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex justify-center items-center">
      <Form
        method="post"
        action="/login"
        className="flex flex-col gap-3 rounded-box bg-base-200 p-6 max-w-md w-full"
      >
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
            required
            name="email"
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
              required
              name="password"
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
      </Form>
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

  const content = await response.json();
  if (response.ok) {
    return redirect("/");
  } else {
    return redirect("/signup");
  }
};

export { Login as default, loginAction };
