import { useEffect, useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import "tailwindcss/tailwind.css";
import "daisyui/dist/full.css";

import { useSelector } from "react-redux";
import { RootState } from "../store";


interface Classes {
  class_id: number;
  faculty_id: number;
  class_name: string;
  term: string;
  schedule: string;
}

const Attendance = () => {
  const classes = useLoaderData() as Classes[];
  const navigate = useNavigate();


  const [facultyId, setFacultyId] = useState<number | undefined>(undefined);

  const { facultyInfo } = useSelector((state: RootState) => state.auth);


  useEffect(() => {
    setFacultyId(facultyInfo?.faculty_id);
  }, [facultyInfo]);


  const onViewClass = (id: number) => {
    navigate(`/attendance/${id}`);
  };

  const onCheckAttendance = (id: number) => {
    navigate(`/attendance/${id}/check`);
  }


  return (
    <div className="max-w-md my-8">
      <div className="flex justify-between items-center my-6 px-4">
        <h1 className="text-2xl font-bold">Classes</h1>
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
                <p>Schedule: {c.schedule}</p>
                <div className="card-actions">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => onViewClass(c.class_id)}
                  >
                    Take Attendance
                  </button>
                  <button
                    className="btn btn-warning btn-sm"
                    onClick={() => onCheckAttendance(c.class_id)}
                  >
                    View Attendance
                  </button>

                </div>
              </div>
            </div>
          ))
        ) : (
          <div>No classes found</div>
        )}
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

export default Attendance;
