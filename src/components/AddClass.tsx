import { SyntheticEvent, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAddClassMutation } from "../slices/facultyApiSlice"; // Importing add class mutation hook
import { RootState } from "../store";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const AddClass = () => {
  const [facultyId, setFacultyId] = useState<number | undefined>(undefined); // State for faculty ID
  const [className, setClassName] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const navigate = useNavigate();

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
      // Dispatch any necessary actions based on response
      toast.success("Class added successfully");
      navigate("/classes");
    } catch (err) {
      toast.error("Failed to add class");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={submit}
        className="flex flex-col gap-3 rounded-box bg-base-200 p-6 max-w-md w-full"
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

        <div>
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
        </div>
      </form>
    </div>
  );
};

export default AddClass;
