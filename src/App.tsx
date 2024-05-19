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
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import Classes, { ClassesLoader } from "./pages/Classes";
import Students from "./pages/Students";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";
import store from "./store";
import { Provider } from "react-redux";
import PrivateRoute from "./components/PrivateRoute";
import AddClass from "./components/AddClass";
import Class, { ClassLoader } from "./pages/Class";
import Attendance from "./pages/Attendance";
import ClassAttendance from "./pages/ClassAttendance";
import CheckAttendance from "./pages/CheckAttendance";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<MainLayout />}>
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="" element={<PrivateRoute />}>
        <Route index element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/classes" element={<Classes />} loader={ClassesLoader} />
        <Route path="/classes/:id" element={<Class />} loader={ClassLoader} />
        <Route path="/classes/add" element={<AddClass />} />
        <Route path="/classes/add-student" element={<AddClass />} />
        <Route path="/students" element={<Students />} />
        <Route path="/attendance" element={<Attendance />} loader={ClassesLoader}/>
        <Route path="/attendance/:id" element={<ClassAttendance />} loader={ClassLoader}/>
        <Route path="/attendance/:id/check" element={<CheckAttendance />} loader={ClassLoader}/>
        <Route path="/settings" element={<Settings />} />
      </Route>
      <Route path="*" element={<NotFound />} />
    </Route>
  )
);

function App() {
  return (
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>
  );
}

export default App;
