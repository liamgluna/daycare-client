import { SyntheticEvent, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import "daisyui/dist/full.css";
import { useAddClassMutation } from "../slices/facultyApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { toast } from "react-toastify";
import { FaPenToSquare, FaRegTrashCan, FaCloud, FaSun } from "react-icons/fa6";
import Time from "../components/Time";

interface Classes {
  class_id: number;
  faculty_id: number;
  class_name: string;
  term: string;
  schedule: string;
}

const Classes = () => {
  const classes = useLoaderData() as Classes[];
  const navigate = useNavigate();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    class_name: "",
    term: "",
    schedule: "",
  });
  const [editClass, setEditClass] = useState({
    class_name: "",
    term: "",
    schedule: "",
  });
  const [currentClass, setCurrentClass] = useState<Classes | null>(null);

  const [facultyId, setFacultyId] = useState<number | undefined>(undefined);
  const [addClass, { isLoading: isAdding }] = useAddClassMutation();
  const { facultyInfo } = useSelector((state: RootState) => state.auth);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [classToDelete, setClassToDelete] = useState<Classes | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const onDeleteClass = (c: Classes) => {
    setClassToDelete(c);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://localhost:8080/classes/${classToDelete?.class_id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        toast.success("Class deleted successfully");
        navigate("/classes");
      } else {
        throw new Error("Failed to delete class");
      }
    } catch (err) {
      toast.error("Failed to delete class");
    } finally {
      setIsDeleteModalOpen(false);
      setClassToDelete(null);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    setFacultyId(facultyInfo?.faculty_id);
  }, [facultyInfo]);

  const submitAdd = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await addClass({
        faculty_id: facultyId,
        class_name: newClass.class_name,
        term: newClass.term,
        schedule: newClass.schedule,
      }).unwrap();
      toast.success("Class added successfully");
      navigate("/classes");
    } catch (err) {
      toast.error("Failed to add class");
    }
  };

  const submitEdit = async (e: SyntheticEvent) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const response = await fetch(
        `http://localhost:8080/classes/${currentClass?.class_id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            class_name: editClass.class_name,
            term: editClass.term,
            schedule: editClass.schedule,
          }),
        }
      );

      if (response.ok) {
        toast.success("Class updated successfully");
        navigate("/classes");
      } else {
        throw new Error("Failed to update class");
      }
    } catch (err) {
      toast.error("Failed to update class");
    }
    setIsLoading(false);
  };

  const onViewClass = (id: number) => {
    navigate(`/classes/${id}`);
  };

  const onEditClass = (c: Classes) => {
    setCurrentClass(c);
    setEditClass({
      class_name: c.class_name,
      term: c.term,
      schedule: c.schedule,
    });
    setIsEditModalOpen(true);
  };

  return (
    <div className="max-w-full px-2">
      <div className="flex justify-between items-start">
        <div>
          <div className="max-w-md">
            <div className="flex justify-between items-center my-6 px-4">
              <h1 className="text-2xl font-bold mr-28">Classes</h1>
              <button
                className="btn btn-primary "
                onClick={() => setIsAddModalOpen(true)}
              >
                Create Class
              </button>
            </div>
            <div className="px-4">
              {classes ? (
                classes.map((c) => (
                  <div
                    key={c.class_id}
                    className="card card-compact bg-base-100 shadow-lg my-6"
                  >
                    <div className="card-body">
                      <h2 className="card-title text-xl font-bold">
                        {c.class_name}
                      </h2>
                      <div className="form-control flex flex-col">
                        <div className="flex gap-4">
                          {c.schedule === "morning" ? (
                            <div className="flex items-center gap-1">
                              <p className="">Schedule: AM</p>
                              <FaSun />
                            </div>
                          ) : (
                            <div className="flex items-center gap-1">
                              Schedule: PM
                              <FaCloud />
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="card-actions">
                        <button
                          className="btn btn-neutral btn-sm"
                          onClick={() => onViewClass(c.class_id)}
                        >
                          View Class
                        </button>
                        <button
                          className="btn btn-warning btn-sm"
                          onClick={() => onEditClass(c)}
                        >
                          <FaPenToSquare />
                          Edit
                        </button>
                        <button
                          className="btn btn-error btn-sm"
                          onClick={() => onDeleteClass(c)}
                        >
                          <FaRegTrashCan />
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-gray-500 mr-6">
                  No classes found
                </div>
              )}
            </div>
            {isAddModalOpen && (
              <div className="flex justify-center items-center modal modal-open">
                <form
                  onSubmit={submitAdd}
                  className="flex flex-col gap-3 rounded-box bg-base-100 p-6 max-w-md w-full my-24 modal-box"
                >
                  <h1 className="text-3xl font-bold self-center">Add Class</h1>

                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Class Name</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Class Name"
                      value={newClass.class_name}
                      className="input input-bordered"
                      required
                      name="className"
                      onChange={(e) =>
                        setNewClass({ ...newClass, class_name: e.target.value })
                      }
                    />
                  </label>

                  <div className="form-control flex flex-col">
                    <label className="label">
                      <span className="label-text">Schedule</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          value="morning"
                          required
                          name="schedule"
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              schedule: e.target.value,
                            })
                          }
                          type="radio"
                          className="radio radio-secondary"
                          checked={newClass.schedule === "morning"}
                        />
                        AM <FaSun className="" />
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          className="radio radio-secondary"
                          value="afternoon"
                          required
                          name="schedule"
                          onChange={(e) =>
                            setNewClass({
                              ...newClass,
                              schedule: e.target.value,
                            })
                          }
                          checked={newClass.schedule === "afternoon"}
                        />
                        PM <FaCloud />
                      </label>
                    </div>
                  </div>
                  <div className="modal-action">
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={isAdding}
                    >
                      {isAdding ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Add Class"
                      )}
                    </button>
                    <button
                      className="btn"
                      onClick={() => setIsAddModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            {isEditModalOpen && (
              <div className="flex justify-center items-center modal modal-open">
                <form
                  onSubmit={submitEdit}
                  className="flex flex-col gap-3 rounded-box bg-base-100 p-6 max-w-md w-full my-24 modal-box"
                >
                  <h1 className="text-3xl font-bold self-center">Edit Class</h1>

                  <label className="form-control">
                    <div className="label">
                      <span className="label-text">Class Name</span>
                    </div>
                    <input
                      type="text"
                      placeholder="Class Name"
                      value={editClass.class_name}
                      className="input input-bordered"
                      required
                      name="className"
                      onChange={(e) =>
                        setEditClass({
                          ...editClass,
                          class_name: e.target.value,
                        })
                      }
                    />
                  </label>

                  <div className="form-control flex flex-col">
                    <label className="label">
                      <span className="label-text">Schedule</span>
                    </label>
                    <div className="flex gap-4">
                      <label className="flex items-center gap-2">
                        <input
                          value="morning"
                          required
                          name="schedule"
                          onChange={(e) =>
                            setEditClass({
                              ...editClass,
                              schedule: e.target.value,
                            })
                          }
                          type="radio"
                          className="radio radio-secondary"
                          checked={editClass.schedule === "morning"}
                        />
                        AM <FaSun />
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          className="radio radio-secondary"
                          value="afternoon"
                          required
                          name="schedule"
                          onChange={(e) =>
                            setEditClass({
                              ...editClass,
                              schedule: e.target.value,
                            })
                          }
                          checked={editClass.schedule === "afternoon"}
                        />
                        PM <FaCloud />
                      </label>
                    </div>
                  </div>
                  <div className="modal-action">
                    <button type="submit" className="btn btn-primary">
                      {isLoading ? (
                        <span className="loading loading-spinner"></span>
                      ) : (
                        "Edit Class"
                      )}
                    </button>
                    <button
                      className="btn"
                      onClick={() => setIsEditModalOpen(false)}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}
            {isDeleteModalOpen && (
              <div className="flex justify-center items-center modal modal-open">
                <div className="modal-box">
                  <h3 className="font-bold text-lg">Are you sure?</h3>
                  <p className="py-4">
                    Do you really want to delete the class "
                    {classToDelete?.class_name}"?
                  </p>
                  <div className="modal-action">
                    {isLoading ? (
                      <span className="loading loading-spinner"></span>
                    ) : (
                      <>
                        <button
                          className="btn btn-neutral"
                          onClick={confirmDelete}
                        >
                          Yes
                        </button>
                        <button
                          className="btn"
                          onClick={() => setIsDeleteModalOpen(false)}
                        >
                          No
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="my-4">
          <Time />
        </div>
      </div>
    </div>
  );
};

export const ClassesLoader = async () => {
  const res = await fetch("http://localhost:8080/classes", {
    headers: { "Content-Type": "application/json" },
    credentials: "include",
  });

  const data: Classes[] = await res.json();
  console.log(data);
  return data;
};

export default Classes;
