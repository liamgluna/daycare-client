import { Link, useLoaderData, useNavigate } from "react-router-dom";

const Classes = () => {
  const classes = useLoaderData() as Classes[];
  const navigate = useNavigate();

  const onViewClass = (id: number) => {
    navigate(`/classes/${id}`);
  };
  return (
    <div>
      <Link to="/classes/add" className="btn">
        Add Class
      </Link>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3">
        {classes.map((c) => (
          <div
            key={c.class_id}
            className="card card-compact md:card lg:card bg-base-100 shadow-lg"
          >
            <div className="card-body items-center text-center">
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
        ))}
      </div>
    </div>
  );
};

interface Classes {
  class_id: number;
  faculty_id: number;
  class_name: string;
  term: string;
}

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
