import { FaExclamationCircle } from "react-icons/fa";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <section className="flex flex-col  items-center m-24">
      <FaExclamationCircle className="text-red-500 text-8xl mb-4" />
      <h1>404 - Not Found!</h1>
      <Link className="link link-accent" to="/">
        Go Home
      </Link>
    </section>
  );
};

export default NotFound;
