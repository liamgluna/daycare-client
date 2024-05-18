import { SyntheticEvent, useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import "daisyui/dist/full.css";
import { useAddClassMutation } from "../slices/facultyApiSlice";
import { useSelector } from "react-redux";
import { RootState } from "../store";
import { toast } from "react-toastify";

interface Classes {
  class_id: number;
  faculty_id: number;
  class_name: string;
  term: string;
}

const Classes = () => {
  const classes = useLoaderData() as Classes[];
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newClass, setNewClass] = useState({
    class_name: "",
    term: "",
  });

  //add class
  const [facultyId, setFacultyId] = useState<number | undefined>(undefined); // State for faculty ID
  const [className, setClassName] = useState<string>("");
  const [term, setTerm] = useState<string>("");

  const [addClass, { isLoading }] = useAddClassMutation(); // Mutation hook for adding a class

  const { facultyInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setFacultyId(facultyInfo?.faculty_id); // Set faculty ID when facultyInfo changes
  }, [facultyInfo]);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      await addClass({
        faculty_id: facultyId,
        class_name: className,
        term,
      }).unwrap();
      toast.success("Class added successfully");
      navigate("/classes");
    } catch (err) {
      toast.error("Failed to add class");
    }
  };

  const onViewClass = (id: number) => {
    navigate(`/classes/${id}`);
  };

  const handleAddClass = async () => {
    try {
      const res = await fetch("http://localhost:8080/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(newClass),
      });
      if (res.ok) {
        // Fetch updated list of classes or update state to include the new class
        window.location.reload();
      } else {
        throw new Error("Failed to add class");
      }
    } catch (error) {
      console.error(error);
      // Handle error
    }
  };

  return (
    <div className="max-w-md">
      <div className="flex justify-between items-center my-6 px-4">
        <h1 className="text-2xl font-bold">Classes</h1>
        <button className="btn" onClick={() => setIsModalOpen(true)}>
          Add Class
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
                  {c.class_name} - {c.term}
                </h2>
                <div className="card-actions">
                  <button
                    className="btn btn-primary"
                    onClick={() => onViewClass(c.class_id)}
                  >
                    View Class
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No classes found</div>
        )}
      </div>
      {isModalOpen && (
        <div className="flex justify-center items-center modal modal-open">
          <form
            onSubmit={submit}
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
                value={className}
                className="input input-bordered"
                required
                name="className"
                onChange={(e) => setClassName(e.target.value)}
              />
            </label>

            <label className="form-control">
              <div className="label">
                <span className="label-text">Term</span>
              </div>
              <input
                type="text"
                placeholder="Term"
                value={term}
                className="input input-bordered"
                required
                name="term"
                onChange={(e) => setTerm(e.target.value)}
              />
            </label>

            <div className="modal-action">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span className="loading loading-spinner"></span>
                ) : (
                  "Add Class"
                )}
              </button>
              <button className="btn" onClick={() => setIsModalOpen(false)}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}
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
