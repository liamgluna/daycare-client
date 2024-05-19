import { useEffect, useState } from "react";
import { LoaderFunctionArgs, useLoaderData, useNavigate } from "react-router-dom";
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
  const navigate = useNavigate();
  const classID = useLoaderData() as Classes;
  const [students, setStudents] = useState<Student[] | null>(null);
  const [attendance, setAttendance] = useState<{ [key: number]: boolean }>({});

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

  const handleCheckboxChange = (student_id: number) => {
    setAttendance((prev) => ({
      ...prev,
      [student_id]: !prev[student_id],
    }));
  };

  const handleSubmitAttendance = async () => {
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
          throw new Error(`Failed to submit attendance for student ${student_id}`);
        }
      });
      await Promise.all(promises);
      toast.success("Attendance submitted successfully!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to submit attendance");
    }
  };

  return (
    <div className="container mx-auto p-4 my-4">
      <h1 className="text-2xl font-bold mb-4">Class Information</h1>
      <div className="mb-4">
        <h2 className="text-xl">ID: {classID.class_id}</h2>
        <h2 className="text-xl">Name: {classID.class_name}</h2>
        <h2 className="text-xl">Term: {classID.term}</h2>
        <h2 className="text-xl">Schedule: {classID.schedule}</h2>
      </div>
      <h1 className="text-2xl font-bold">Students</h1>
      {students !== null ? (
        students.length > 0 ? (
          <div className="overflow-x-auto">
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
                  <th>Attendance</th>
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
                    <td>
                      <input
                        type="checkbox"
                        checked={attendance[student.student_id] || false}
                        onChange={() => handleCheckboxChange(student.student_id)}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button
              className="mt-4 px-4 py-2 btn btn-primary"
              onClick={handleSubmitAttendance}
            >
              Submit Attendance
            </button>
          </div>
        ) : (
          <p>No students found</p>
        )
      ) : (
        <p>Loading students...</p>
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
