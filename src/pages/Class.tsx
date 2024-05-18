import { useEffect, useState } from "react";
import { LoaderFunctionArgs, useLoaderData } from "react-router-dom";

interface Guardian {
  first_name: string;
  last_name: string;
  gender: string;
  relationship: string;
  occupation: string;
  contact: string;
}

interface Student {
  student_id: number;
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  guardian_name: string;
  guardian_contact: string;
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
  const classID = useLoaderData() as Classes;
  const [students, setStudents] = useState<Student[] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
  });

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

  const handleEdit = (id: number) => {
    console.log(`Edit student with id: ${id}`);
  };

  const handleDelete = async (student_id: number) => {
    try {
      const res = await fetch(
        `http://localhost:8080/classes/${classID.class_id}/students/${student_id}`,
        {
          method: "DELETE",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
        }
      );
      if (res.ok) {
        // Update the state to remove the deleted student
        setStudents((prevStudents) =>
          prevStudents
            ? prevStudents.filter(
                (student) => student.student_id !== student_id
              )
            : null
        );
      } else {
        throw new Error("Failed to delete student");
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  const handleAddStudent = async () => {
    try {
      const res = await fetch(
        `http://localhost:8080/classes/${classID.class_id}/students`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(newStudent),
        }
      );
      if (res.ok) {
        const addedStudent = await res.json();
        setStudents((prevStudents) =>
          prevStudents ? [...prevStudents, addedStudent] : [addedStudent]
        );
        setIsModalOpen(false);
        setNewStudent({
          first_name: "",
          last_name: "",
          gender: "",
          date_of_birth: "",
        });
      } else {
        throw new Error("Failed to add student");
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <div className="container mx-auto p-4 my-4">
      <h1 className="text-2xl font-bold mb-4">Class Information</h1>
      <div className="mb-4">
        <h2 className="text-xl">ID: {classID.class_id}</h2>
        <h2 className="text-xl">Name: {classID.class_name}</h2>
        <h2 className="text-xl">Term: {classID.term}</h2>
      </div>
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Students</h1>
        <button
          className="btn btn-primary"
          onClick={() => setIsModalOpen(true)}
        >
          Add Student
        </button>
      </div>
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
                  <th>Actions</th>
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
                    <td>{student.guardian_name}</td>
                    <td>{student.guardian_contact}</td>
                    <td>
                      <button
                        className="btn btn-primary btn-sm mr-2"
                        onClick={() => handleEdit(student.student_id)}
                      >
                        Edit
                      </button>
                      <button
                        className="btn btn-error btn-sm"
                        onClick={() => handleDelete(student.student_id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>No students found</p>
        )
      ) : (
        <p>No students found</p>
      )}
      {isModalOpen && (
        <div className="modal modal-open">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Add Student</h3>
            <div className="form-control">
              <label className="label">
                <span className="label-text">First Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={newStudent.first_name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, first_name: e.target.value })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Last Name</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={newStudent.last_name}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, last_name: e.target.value })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Gender</span>
              </label>
              <input
                type="text"
                className="input input-bordered"
                value={newStudent.gender}
                onChange={(e) =>
                  setNewStudent({ ...newStudent, gender: e.target.value })
                }
              />
            </div>
            <div className="form-control">
              <label className="label">
                <span className="label-text">Date of Birth</span>
              </label>
              <input
                type="date"
                className="input input-bordered"
                value={newStudent.date_of_birth}
                onChange={(e) =>
                  setNewStudent({
                    ...newStudent,
                    date_of_birth: e.target.value,
                  })
                }
              />
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" onClick={handleAddStudent}>
                Add
              </button>
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
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