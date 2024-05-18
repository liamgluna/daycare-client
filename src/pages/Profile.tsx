import { SyntheticEvent, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useUpdateFacultyMutation } from "../slices/facultyApiSlice";
import { RootState } from "../store";
import { setCredentials } from "../slices/authSlice";
import { toast } from "react-toastify";

const Profile = () => {
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");
  const [contact, setContact] = useState<string>("");
  const [position, setPosition] = useState<string>("");

  const dispatch = useDispatch();

  const [updateFaculty, { isLoading }] = useUpdateFacultyMutation();

  const { facultyInfo } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    setFirstName(facultyInfo?.first_name);
    setLastName(facultyInfo?.last_name);
    setContact(facultyInfo?.contact);
    setPosition(facultyInfo?.position);
  }, [facultyInfo]);

  const submit = async (e: SyntheticEvent) => {
    e.preventDefault();
    try {
      const res = await updateFaculty({
        first_name: firstName,
        last_name: lastName,
        contact,
        position,
      }).unwrap();
      dispatch(setCredentials({ ...res }));
      toast.success("Profile updated successfully");
    } catch (err) {
      toast.error("Failed to update profile");
    }
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={submit}
        className="flex flex-col gap-3 rounded-box bg-base-200 p-6 max-w-md w-full my-44 shadow-lg"
      >
        <h1 className="text-3xl font-bold self-center">Update Profile</h1>

        <div className="flex">
          <div className="w-1/2 mr-4">
            <label className="form-control">
              <div className="label">
                <span className="label-text">First Name</span>
              </div>
              <input
                type="text"
                placeholder="First Name"
                value={firstName}
                className="input input-bordered w-full"
                required
                name="firstName"
                onChange={(e) => setFirstName(e.target.value)}
              />
            </label>
          </div>

          <div className="w-1/2">
            <label className="form-control">
              <div className="label">
                <span className="label-text">Last Name</span>
              </div>
              <input
                type="text"
                placeholder="Last Name"
                value={lastName}
                className="input input-bordered w-full"
                required
                name="lastName"
                onChange={(e) => setLastName(e.target.value)}
              />
            </label>
          </div>
        </div>

        <label className="form-control">
          <div className="label">
            <span className="label-text">Contact</span>
          </div>
          <input
            type="text"
            placeholder="Contact"
            className="input input-bordered"
            required
            name="contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          />
        </label>

        <label className="form-control">
          <div className="label">
            <span className="label-text">Position</span>
          </div>
          <input
            type="text"
            placeholder="Position"
            className="input input-bordered"
            required
            name="position"
            value={position}
            onChange={(e) => setPosition(e.target.value)}
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
              "Update"
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

const profileLoader = async () => {
  const response = await fetch("http://localhost:8080/faculty/profile", {
    method: "GET",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
  });

  const data = await response.json();
  return data.faculty;
};

export { Profile as default, profileLoader };
