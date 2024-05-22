import { SyntheticEvent, useEffect, useState } from "react";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";

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
    const printArea: HTMLTableElement | null = document.getElementById("student-table") as HTMLTableElement;
  
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
    return record ? (record.present ? <p className="text-green-500">Present</p> : <p className="text-red-500">Absent</p>) : "Unknown";
  };

  return (
    <div className="container mx-auto p-4 my-4">
      <form
        onSubmit={submit}
        className="flex flex-col gap-3 rounded-box bg-base-100 p-6 max-w-md w-full mb-12 shadow-md"
      >
        <h1 className="text-3xl font-bold self-center">View Class Attendance</h1>

        <div className="flex">
          <div className="w-1/2 mr-4">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Select Date</span>
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
      <h1 className="text-2xl font-bold mb-4">Class Information</h1>
      <div className="mb-4">
        <h2 className="text-xl">ID: {classID.class_id}</h2>
        <h2 className="text-xl">Name: {classID.class_name}</h2>
        <h2 className="text-xl">Term: {classID.term}</h2>
        <h2 className="text-xl">Schedule: {classID.schedule}</h2>
      </div>
      {attendance && (
        <>
          <h1 className="text-2xl font-bold">Students</h1>
          {students !== null ? (
            students.length > 0 ? (
              <div className="overflow-x-auto" id="student-table">
                <table className="table w-full">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Name</th>
                      <th>Age</th>
                      <th>Gender</th>
                      <th>Date of Birth</th>
                      <th>Guardian</th>
                      <th>Contact</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {students.map((student) => (
                      <tr key={student.student_id}>
                        <td>{student.student_id}</td>
                        <td>{`${student.first_name} ${student.last_name}`}</td>
                        <td>{calculateAge(student.date_of_birth)}</td>
                        <td>{student.gender}</td>
                        <td>{student.date_of_birth}</td>
                        <td>{`${student.guardian_first_name} ${student.guardian_last_name}`}</td>
                        <td>{student.guardian_contact}</td>
                        <td>{getAttendanceStatus(student.student_id)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No students found</p>
            )
          ) : (
            <p>Loading students...</p>
          )}
        </>
      )}
      <button onClick={printAttendance} className="btn btn-primary">Print Attendance</button>
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
