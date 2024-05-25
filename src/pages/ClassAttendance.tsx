import { useEffect, useState } from "react";
import { FaCloud } from "react-icons/fa";
import { FaSun } from "react-icons/fa6";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../store";
import { useSelector } from "react-redux";

interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  guardian_id: number;
  guardian_first_name: string;
  guardian_last_name: string;
  guardian_gender: string;
  guardian_rel: string;
  guardian_occ: string;
  guardian_contact: string;
}

interface Classes {
  class_id: number;
  faculty_id: number;
  class_name: string;
  term: string;
  schedule: string;
}

const calculateAge = (dob: string) => {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDifference = today.getMonth() - birthDate.getMonth();
  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }
  return age;
};

const Class = () => {
  const { facultyInfo } = useSelector((state: RootState) => state.auth);

  const navigate = useNavigate();
  const classID = useLoaderData() as Classes;
  const [students, setStudents] = useState<Student[] | null>(null);
  const [attendance, setAttendance] = useState<{ [key: number]: boolean }>({});
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const res = await fetch(
          `http://localhost:8080/classes/${classID.class_id}/students`,
          {
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          }
        );
        if (res.ok) {
          const data = await res.json();
          setStudents(data);
          // Initialize attendance state
          const initialAttendance: { [key: number]: boolean } = {};
          data.forEach((student: Student) => {
            initialAttendance[student.student_id] = false;
          });
          setAttendance(initialAttendance);
        } else {
          throw new Error("Failed to fetch students");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, [classID.class_id]);

  const handleCheckboxChange = (student_id: number) => {
    setAttendance((prev) => ({
      ...prev,
      [student_id]: !prev[student_id],
    }));
  };

  const handleSubmitAttendance = async () => {
    setIsLoading(true);
    try {
      const promises = Object.keys(attendance).map(async (student_id) => {
        const isPresent = attendance[parseInt(student_id)];
        const res = await fetch(
          `http://localhost:8080/classes/${classID.class_id}/attendance/${student_id}`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ present: isPresent }),
          }
        );
        if (!res.ok) {
          throw new Error(
            `Failed to submit attendance for student ${student_id}`
          );
        }
      });
      await Promise.all(promises);
      toast.success("Attendance submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit attendance");
    }
    setIsLoading(false);
  };

  return (
    <div className="container mx-auto p-4 my-4">
       <div className="card w-2/5 bg-base-100 border ">
        <div className="card-body">
          <h1 className="card-title text-2xl font-bold">Class Information</h1>

          <div className="flex">
            <div className="flex-1 mr-8">
              <h2 className="text-xl ">Class ID: {classID.class_id}</h2>
              <h2 className="text-xl ">Name: {classID.class_name}</h2>
            </div>
            <div  className="flex-1">
              <div className="flex flex-col ">
                <div className="flex gap-2 items-center">
                  <h2 className="text-xl">
                    Schedule: {classID.schedule === "morning" ? "AM" : "PM"}
                  </h2>
                  {classID.schedule === "morning" ? (
                    <FaSun className="text-lg" />
                  ) : (
                    <FaCloud className="text-lg" />
                  )}
                </div>
              </div>
              <h2 className="text-xl">
                Faculty: {facultyInfo.first_name} {facultyInfo.last_name}
              </h2>
            </div>
          </div>
        </div>
      </div>
      <h1 className="text-2xl font-bold mb-4 ml-8 mt-4">Students</h1>
      {students !== null ? (
        students.length > 0 ? (
          <div className="table-auto w-full border-collapse">
            <table className="table w-full">
              <thead>
                <tr className="bg-gray-200">
                  <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">ID</th>
                  <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">Name</th>
                  <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">Age</th>
                  <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">Gender</th>
                  <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">Date of Birth</th>
                  <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">Guardian</th>
                  <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">Contact</th>
                  <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">Attendance</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id}>
                    <td className="p-2 border">{student.student_id}</td>
                    <td className="p-2 border">{`${student.first_name} ${student.last_name}`}</td>
                    <td className="p-2 border">{calculateAge(student.date_of_birth)}</td>
                    <td className="p-2 border">{student.gender}</td>
                    <td className="p-2 border">{student.date_of_birth}</td>
                    <td className="p-2 border">{`${student.guardian_first_name} ${student.guardian_last_name}`}</td>
                    <td className="p-2 border">{student.guardian_contact}</td>
                    <td className="p-2 border">
                      <input
                        type="checkbox"
                        checked={attendance[student.student_id] || false}
                        onChange={() =>
                          handleCheckboxChange(student.student_id)
                        }
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 px-4 py-2 btn btn-primary mx-4"
              onClick={handleSubmitAttendance}
            >
              {isLoading ? (
                <span className="loading loading-spinner"></span>
              ) : (
                "Submit Attendance"
              )}
            </button>
          </div>
        ) : (
          <p className="text-center text-gray-500">No students found</p>

        )
      ) : (
        <p className="text-center text-gray-500">No students found</p>

      )}
    </div>
  );
};

export const ClassLoader = async ({ params }: LoaderFunctionArgs) => {
  const res = await fetch(`http://localhost:8080/classes/${params.id}`, {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });
  const data: Classes = await res.json();
  return data;
};

export default Class;
