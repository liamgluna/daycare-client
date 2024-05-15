import { useEffect, useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";

interface Guardian {
  first_name: string;
  last_name: string;
  gender: string;
  relationship: string;
  ocupation: string;
  contact: string;
}

interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
}

interface StudentData {
  student: Student;
  guardians: Guardian[];
}

interface Classes {
  class_id: number;
  faculty_id: number;
  class_name: string;
  term: string;
}

const Class = () => {
  const classID = useLoaderData() as Classes;
  const [students, setStudents] = useState<Student[]>([]);

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
        // Handle error
      }
    };

    fetchStudents();

    // Cleanup function if needed
    // return () => {};
  }, [classID.class_id]); // Dependency array to run effect when classID changes

  return (
    <div>
      <h1>id: {classID.class_id}</h1>
      <h1>name: {classID.class_name}</h1>
      <h1>term: {classID.term}</h1>
      <h1>Students:</h1>
      {/* {
        <ul>
          {students.map((student, index) => (
            <li key={index}>
              {student.first_name} {student.last_name}
            </li>
          ))}
        </ul>
      } */}
     {/*  check if students is null:*/}
      {students ? (
        <ul>
          {students.map((student, index) => (
            <li key={index}>
              {student.first_name} {student.last_name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No students found</p>
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
  console.log(data);
  return data;
};

export default Class;
