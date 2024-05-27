import { SyntheticEvent, useEffect, useState } from "react";
import { FaCloud, FaSun } from "react-icons/fa6";
import { useSelector } from "react-redux";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import { RootState } from "../store";

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

interface Attendance {
  student_id: number;
  class_id: number;
  class_date: string;
  present: boolean;
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

const CheckAttendance = () => {
  const navigate = useNavigate();
  const classID = useLoaderData() as Classes;
  const [students, setStudents] = useState<Student[] | null>(null);
  const [attendance, setAttendance] = useState<Attendance[] | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [date, setDate] = useState<string>("");

  const printAttendance = (): void => {
    const printArea: HTMLTableElement | null = document.getElementById(
      "student-table"
    ) as HTMLTableElement;

    if (printArea) {
      const originalContent: string = document.body.innerHTML;
      document.body.innerHTML = printArea.outerHTML;
      window.print();
      document.body.innerHTML = originalContent;
    } else {
      console.error("Element with ID 'student-table' not found");
    }
  };

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await fetch(
        `http://localhost:8080/classes/${classID.class_id}/attendance?date=${date}`,
        {
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (res.ok) {
        const data: Attendance[] = await res.json();
        setAttendance(data);
      } else {
        throw new Error("Failed to fetch attendance");
      }
    } catch (error) {
      toast.error("Failed to fetch attendance");
    } finally {
      setIsLoading(false);
      setIsViewAttendanceModalOpen(false);
    }
  };

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
        } else {
          throw new Error("Failed to fetch students");
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchStudents();
  }, [classID.class_id]);

  const getAttendanceStatus = (studentId: number) => {
    const record = attendance?.find((a) => a.student_id === studentId);
    return record ? (
      record.present ? (
        <p className="text-green-500">Present</p>
      ) : (
        <p className="text-red-500">Absent</p>
      )
    ) : (
      <p className="text-yellow-500">Unknown</p>
    );
  };
  const { facultyInfo } = useSelector((state: RootState) => state.auth);

  const [isViewAttendanceModalOpen, setIsViewAttendanceModalOpen] =
    useState(false);

  return (
    <div className="container mx-auto p-4 my-4">
      <div className="flex justify-start items-start">
        <div>
          <form
            onSubmit={submit}
            className="flex flex-col gap-3 rounded-box bg-base-100 p-6 max-w-md w-96 mb-4 border mr-12 ml-2"
          >
            <h1 className="text-2xl font-bold mt-2">View Class Attendance</h1>

            <div className="flex">
              <div className="w-1/2 mr-4">
                <label className="form-control">
                  <div className="label">
                    <span className="label-text text-gray-500">
                      Select Date
                    </span>
                  </div>
                  <input
                    type="date"
                    value={date}
                    className="input input-bordered w-full"
                    required
                    name="date"
                    onChange={(e) => {
                      setDate(e.target.value);
                      setAttendance(null); // Clear attendance when date changes
                    }}
                  />
                </label>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "View Attendance"
                )}
              </button>
            </div>
          </form>
        </div>
        <div>
          <div className="card w-full bg-base-100 border ">
            <div className="card-body">
              <h1 className="card-title text-2xl font-bold">
                Class Information
              </h1>

              <div className="flex">
                <div className="flex-1 mr-8">
                  <h2 className="text-xl ">Class ID: {classID.class_id}</h2>
                  <h2 className="text-xl ">Name: {classID.class_name}</h2>
                </div>
                <div className="flex-1">
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
        </div>
      </div>
      {attendance && (
        <>
          <h1 className="text-2xl font-bold mt-6 ml-4 ">Students</h1>
          <h1 className="text-lg font-bold ml-4 mb-2 text-gray-600">
            Class Date: {date}
          </h1>

          {students !== null ? (
            students.length > 0 ? (
              <div
                className="table-auto w-full border-collapse mt-2"
                id="student-table"
              >
                <table className="table w-full">
                  <thead>
                    <tr className="bg-gray-200">
                      <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">
                        ID
                      </th>
                      <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">
                        Name
                      </th>
                      <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">
                        Age
                      </th>
                      <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">
                        Gender
                      </th>
                      <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">
                        Date of Birth
                      </th>
                      <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">
                        Guardian
                      </th>
                      <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">
                        Relationship
                      </th>
                      <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">
                        Occupation
                      </th>
                      <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">
                        Contact
                      </th>
                      <th className="px-4 py-2 text-left text-md  text-gray-500 uppercase tracking-wider border">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.student_id}>
                        <td className="p-2 border">{student.student_id}</td>
                        <td className="p-2 border">{`${student.first_name} ${student.last_name}`}</td>
                        <td className="p-2 border">
                          {calculateAge(student.date_of_birth)}
                        </td>
                        <td className="p-2 border">{student.gender}</td>
                        <td className="p-2 border">{student.date_of_birth}</td>
                        <td className="p-2 border">{`${student.guardian_first_name} ${student.guardian_last_name}`}</td>
                        <td className="p-2 border">{student.guardian_rel}</td>
                        <td className="p-2 border">{student.guardian_occ}</td>
                        <td className="p-2 border">
                          {student.guardian_contact}
                        </td>
                        <td className="p-2 border">
                          {getAttendanceStatus(student.student_id)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p className="text-center text-gray-500">No students found</p>
            )
          ) : (
            <p className="text-center text-gray-500">No students found</p>
          )}
        </>
      )}
      {/* <button onClick={printAttendance} className="btn btn-primary my-4">
        Print Attendance
      </button> */}
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

export default CheckAttendance;
