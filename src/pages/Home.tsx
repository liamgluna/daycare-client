import { FaChildren, FaSchoolFlag, FaClipboard } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useState } from "react";

const Home = () => {
  const { facultyInfo } = useSelector((state: RootState) => state.auth);
  const faculty_id = facultyInfo?.faculty_id;

  const [numClasses, setNumClasses] = useState(0);
  const [numStudents, setNumStudents] = useState(0);
  const [numAttendance, setNumAttendance] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (facultyInfo) {
      setIsLoading(true);

      fetch(`http://localhost:8080/faculty/${faculty_id}/classes`)
        .then((response) => response.json())
        .then((data) => {
          setNumClasses(data.count); // Assuming data is an array of classes
          setIsLoading(false);
        })
        .catch((error) => console.error("Error fetching classes:", error));

      fetch(`http://localhost:8080/faculty/${faculty_id}/classes/students`)
        .then((response) => response.json())
        .then((data) => {
          setNumStudents(data.count); // Assuming data is an array of students
          setIsLoading(false);
        })
        .catch((error) => console.error("Error fetching students:", error));

      fetch(`http://localhost:8080/faculty/${faculty_id}/classes/attendance`)
        .then((response) => response.json())
        .then((data) => {
          setNumAttendance(data.count); // Assuming data.total contains total attendance
          setIsLoading(false);
        })
        .catch((error) => console.error("Error fetching attendance:", error));
    }
  }, [faculty_id]);

  return (
    <div className="max-w-md px-4">
      <div className="my-6">
        <h1 className="text-2xl font-bold px-2">Dashboard</h1>
      </div>
      <div className="p-4 rounded-lg shadow-lg flex items-center justify-between w-3/4 my-6">
        <div>
          <h2 className="card-title text-xl font-bold">Classes</h2>
          <p className="text-xl text-gray-900 font-semibold">
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              numClasses
            )}
          </p>
        </div>
        <FaChildren className="text-blue-500 text-5xl" />
      </div>

      <div className="p-4 rounded-lg shadow-lg flex items-center justify-between w-3/4 my-6">
        <div>
          <h2 className="card-title text-xl font-bold">Students</h2>
          <p className="text-xl text-gray-900 font-semibold">
            {" "}
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              numStudents
            )}
          </p>
        </div>
        <FaSchoolFlag className="text-yellow-500 text-5xl" />
      </div>

      <div className="p-4 rounded-lg shadow-lg flex items-center justify-between w-3/4 my-6">
        <div>
          <h2 className="card-title text-xl font-bold">
            Total Student Attendance
          </h2>
          <p className="text-xl text-gray-900 font-semibold">
            {isLoading ? (
              <span className="loading loading-spinner"></span>
            ) : (
              numAttendance
            )}
          </p>
        </div>
        <FaClipboard className="text-violet-500 text-5xl" />
      </div>
    </div>
  );
};

export default Home;
