import { Link, LoaderFunctionArgs, useLoaderData } from "react-router-dom";

const Class = () => {
  const classF = useLoaderData() as string;

  return (
    <div>
      <h1>id: {classF}</h1>
      <Link to="/">Add student</Link>
    </div>
  );
};

export const ClassLoader = async ({ params }: LoaderFunctionArgs) => {
  //   const res = await fetch(`http://localhost:8080/classes/${params.id}`, {
  //     headers: { "Content-Type": "application/json" },
  //     credentials: "include",
  //   });
  //   const data = await res.json();
  return params.id;
};

export default Class;
