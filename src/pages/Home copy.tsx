import { FaChildren, FaSchoolFlag, FaClipboard } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { useEffect, useState } from "react";
import Time from "../components/Time";

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
    <div className="max-w-full px-4">
      <div className="flex justify-between items-start">
        <div>{/* here */}</div>
        <div className="my-4">
          <Time />
        </div>
      </div>
    </div>
  );
};

export default Home;
