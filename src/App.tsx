import "./App.css";
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import NotFound from "./pages/NotFound";
import Home from "./pages/Home";
import MainLayout from "./layouts/MainLayout";
import SignUp from "./pages/SignUp";
import LogIn from "./pages/LogIn";
import Classes from "./pages/Classes";
import Students from "./pages/Students";
import Attendance from "./pages/Attendance";
import Settings from "./pages/Settings";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route index element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
      <Route path="/login" element={<LogIn />} />
      <Route path="/classes" element={<Classes />} />
      <Route path="/students" element={<Students />} />
      <Route path="/attendace" element={<Attendance />} />
      <Route path="/settings" element={<Settings />} />
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
