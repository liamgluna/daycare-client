import { SyntheticEvent, useEffect, useState } from "react";
import {
  LoaderFunctionArgs,
  useLoaderData,
  useNavigate,
} from "react-router-dom";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import {
  FaSun,
  FaCloud,
  FaPenToSquare,
  FaRegTrashCan,
  FaChild,
} from "react-icons/fa6";
import Time from "../components/Time";
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
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newStudent, setNewStudent] = useState({
    first_name: "",
    last_name: "",
    gender: "",
    date_of_birth: "",
    guardian: {
      first_name: "",
      last_name: "",
      gender: "",
      relationship: "",
      occupation: "",
      contact: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

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

  const handleEdit = (student: Student) => {
    setSelectedStudent(student);
    setIsEditModalOpen(true);
  };

  const handleDelete = async (student_id: number) => {
    setIsLoading(true);
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
    setIsLoading(false);
  };

  const handleAddStudent = async (e: SyntheticEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Create student and guardian
      const createRes = await fetch(`http://localhost:8080/students`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          student: {
            first_name: newStudent.first_name,
            last_name: newStudent.last_name,
            gender: newStudent.gender,
            date_of_birth: newStudent.date_of_birth,
          },
          guardian: {
            first_name: newStudent.guardian.first_name,
            last_name: newStudent.guardian.last_name,
            gender: newStudent.guardian.gender,
            relationship: newStudent.guardian.relationship,
            occupation: newStudent.guardian.occupation,
            contact: newStudent.guardian.contact,
          },
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to create student and guardian");
      }

      const createdStudent = await createRes.json();

      // Add student to the class
      const addRes = await fetch(
        `http://localhost:8080/classes/${classID.class_id}/students`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ student_id: createdStudent.student_id }),
        }
      );

      if (!addRes.ok) {
        throw new Error("Failed to add student to class");
      }

      // Update the state to include the new student
      setStudents((prevStudents) =>
        prevStudents ? [...prevStudents, createdStudent] : [createdStudent]
      );

      setIsModalOpen(false);
      setNewStudent({
        first_name: "",
        last_name: "",
        gender: "",
        date_of_birth: "",
        guardian: {
          first_name: "",
          last_name: "",
          gender: "",
          relationship: "",
          occupation: "",
          contact: "",
        },
      });
    } catch (error) {
      console.error(error);
      // Handle error
    }

    toast.success("Student added successfully");
    navigate("/classes/" + classID.class_id);
  };

  return (
    <div className="container mx-auto">
      <div className="w-full px-4 mx-2">
        <div className="flex justify-between items-start">
          <div className="card w-2/5 bg-base-100 border my-8">
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
          <div className="my-4">
            <Time />
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between mb-4 ">
        <h1 className="text-2xl font-bold ml-8">Students</h1>
        <button
          className="btn btn-primary flex items-center gap-2 mr-8"
          onClick={() => setIsModalOpen(true)}
        >
          <FaChild className="text-lg" />
          Add Student
        </button>
      </div>
      {students !== null ? (
        students.length > 0 ? (
          <div className="table-auto w-full border-collapse px-4">
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
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.student_id} className="hover:bg-gray-100">
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
                    <td className="p-2 border">{student.guardian_contact}</td>
                    <td className="p-2 border flex gap-2">
                      {isLoading ? (
                        <button className="btn btn-sm loading">Loading</button>
                      ) : (
                        <>
                          <button
                            className="btn btn-warning btn-sm flex items-center gap-1"
                            onClick={() => handleEdit(student)}
                          >
                            <FaPenToSquare />
                            Edit
                          </button>
                          <button
                            className="btn btn-error btn-sm flex items-center gap-1"
                            onClick={() => handleDelete(student.student_id)}
                          >
                            <FaRegTrashCan />
                            Delete
                          </button>
                        </>
                      )}
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
      {isModalOpen && (
        <div className="modal modal-open ">
          <form
            onSubmit={handleAddStudent}
            className="modal-box w-full max-w-4xl"
          >
            <h3 className="font-bold text-2xl">Add Student</h3>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <h4 className="font-bold text-xl">Student Information</h4>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={newStudent.first_name}
                    required
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        first_name: e.target.value,
                      })
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
                    required
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        last_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    className="select select-bordered"
                    required
                    value={newStudent.gender}
                    onChange={(e) =>
                      setNewStudent({ ...newStudent, gender: e.target.value })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    required
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
              </div>
              <div className="w-1/2">
                <h4 className="font-bold text-xl">Guardian Information</h4>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input input-bordered"
                    value={newStudent.guardian.first_name}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        guardian: {
                          ...newStudent.guardian,
                          first_name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Last Name</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input input-bordered"
                    value={newStudent.guardian.last_name}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        guardian: {
                          ...newStudent.guardian,
                          last_name: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    className="select select-bordered"
                    required
                    value={newStudent.guardian.gender}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        guardian: {
                          ...newStudent.guardian,
                          gender: e.target.value,
                        },
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Relationship</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input input-bordered"
                    value={newStudent.guardian.relationship}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        guardian: {
                          ...newStudent.guardian,
                          relationship: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Occupation</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input input-bordered"
                    value={newStudent.guardian.occupation}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        guardian: {
                          ...newStudent.guardian,
                          occupation: e.target.value,
                        },
                      })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Contact</span>
                  </label>
                  <input
                    type="text"
                    required
                    className="input input-bordered"
                    value={newStudent.guardian.contact}
                    onChange={(e) =>
                      setNewStudent({
                        ...newStudent,
                        guardian: {
                          ...newStudent.guardian,
                          contact: e.target.value,
                        },
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button className="btn btn-primary" type="submit">
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Add Student"
                )}
              </button>
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
      {isEditModalOpen && selectedStudent && (
        <div className="modal modal-open">
          <div className="modal-box w-full max-w-4xl">
            <h3 className="font-bold text-lg">Edit Student</h3>
            <div className="flex space-x-4">
              <div className="w-1/2">
                <h4 className="font-bold">Student Information</h4>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={selectedStudent.first_name}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        first_name: e.target.value,
                      })
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
                    value={selectedStudent.last_name}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        last_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={selectedStudent.gender}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        gender: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Date of Birth</span>
                  </label>
                  <input
                    type="date"
                    className="input input-bordered"
                    value={selectedStudent.date_of_birth}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        date_of_birth: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
              <div className="w-1/2">
                <h4 className="font-bold">Guardian Information</h4>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">First Name</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={selectedStudent.guardian_first_name}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        guardian_first_name: e.target.value,
                      })
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
                    value={selectedStudent.guardian_last_name}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        guardian_last_name: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Gender</span>
                  </label>
                  <select
                    className="select select-bordered"
                    value={selectedStudent.guardian_gender}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        guardian_gender: e.target.value,
                      })
                    }
                  >
                    <option value="">Select</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Relationship</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={selectedStudent.guardian_rel}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        guardian_rel: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Occupation</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={selectedStudent.guardian_occ}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        guardian_occ: e.target.value,
                      })
                    }
                  />
                </div>
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Contact</span>
                  </label>
                  <input
                    type="text"
                    className="input input-bordered"
                    value={selectedStudent.guardian_contact}
                    onChange={(e) =>
                      setSelectedStudent({
                        ...selectedStudent,
                        guardian_contact: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>
            <div className="modal-action">
              <button
                className="btn btn-primary"
                onClick={async () => {
                  setIsLoading(true);
                  try {
                    const res = await fetch(
                      `http://localhost:8080/students/${selectedStudent.student_id}/guardian`,
                      {
                        method: "PATCH",
                        headers: { "Content-Type": "application/json" },
                        credentials: "include",
                        body: JSON.stringify({
                          student: {
                            first_name: selectedStudent.first_name,
                            last_name: selectedStudent.last_name,
                            gender: selectedStudent.gender,
                            date_of_birth: selectedStudent.date_of_birth,
                          },
                          guardian: {
                            first_name: selectedStudent.guardian_first_name,
                            last_name: selectedStudent.guardian_last_name,
                            gender: selectedStudent.guardian_gender,
                            relationship: selectedStudent.guardian_rel,
                            occupation: selectedStudent.guardian_occ,
                            contact: selectedStudent.guardian_contact,
                          },
                        }),
                      }
                    );

                    if (!res.ok) {
                      throw new Error("Failed to update student and guardian");
                    }

                    const updatedStudent = await res.json();

                    setStudents((prevStudents) =>
                      prevStudents
                        ? prevStudents.map((student) =>
                            student.student_id === updatedStudent.student_id
                              ? updatedStudent
                              : student
                          )
                        : [updatedStudent]
                    );

                    setIsEditModalOpen(false);
                    navigate("/classes/" + classID.class_id);
                  } catch (error) {
                    console.error(error);
                    // Handle error
                  }
                }}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Save Changes"
                )}
              </button>
              <button className="btn" onClick={() => setIsEditModalOpen(false)}>
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
