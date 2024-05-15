import { Link, useLoaderData, useNavigate } from "react-router-dom";

const Classes = () => {
  const classes = useLoaderData() as Classes[];
  const navigate = useNavigate();

  const onViewClass = (id: number) => {
    navigate(`/classes/${id}`);
  };
  return (
    <div className="max-w-md">
      <div className="flex justify-between items-center my-6 px-4">
        <h1 className="text-2xl font-bold">Classes</h1>
        <Link to="/classes/add" className="btn">
          Add Class
        </Link>
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
