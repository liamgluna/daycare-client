import { toast } from "react-toastify";

const Home = () => {
  const onClick = () => {
    toast.success("Hello, world!");
  };
  return (
    <>
      <div className="p-10">
        <button onClick={onClick} className="btn btn-lg btn-primary">
          Click me
        </button>
      </div>
    </>
  );
};

export default Home;
