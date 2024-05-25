import { MdPeople } from "react-icons/md";
const Home = () => {
  return (
    <div className="max-w-md px-4">
      <div className="my-6">
        <h1 className="text-2xl font-bold px-2">Dashboard</h1>
      </div>

      <div className="p-4 rounded-lg shadow-lg flex items-center justify-between w-3/4 my-6">
        <div>
          <h2 className="card-title text-xl font-bold">Classes</h2>
          <p className="text-xl text-gray-900 font-semibold">5</p>
        </div>
        <MdPeople className="text-blue-500 text-5xl" />
      </div>

      <div className="p-4 rounded-lg shadow-lg flex items-center justify-between w-3/4 my-6">
        <div>
          <h2 className="card-title text-xl font-bold">Students</h2>
          <p className="text-xl text-gray-900 font-semibold">5</p>
        </div>
        <MdPeople className="text-blue-500 text-5xl" />
      </div>

      <div className="p-4 rounded-lg shadow-lg flex items-center justify-between w-3/4 my-6">
        <div>
          <h2 className="card-title text-xl font-bold">Total Student Attendance</h2>
          <p className="text-xl text-gray-900 font-semibold">5</p>
        </div>
        <MdPeople className="text-blue-500 text-5xl" />
      </div>
    </div>
  );
};

export default Home;
