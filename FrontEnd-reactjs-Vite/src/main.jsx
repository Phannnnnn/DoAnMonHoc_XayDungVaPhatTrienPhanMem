import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import './styles/course.css';

import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import LoginPage from './component/pages/LoginPage.jsx'
import HomePage from './component/pages/HomePage.jsx'
import CoursesPage from './component/pages/CoursesPage.jsx'
import RegisterPage from './component/pages/Register.jsx'
import { AuthWrapper } from './component/context/auth.context.jsx'
import AdminPage from './component/admin/AdminPage.jsx'
import User from './component/admin/User.jsx'
import Courses from './component/admin/Courses.jsx'
import CreateCourse from './component/admin/CreateCourse.jsx'
import CourseEdit from './component/admin/CourseEdit.jsx';
import TrashCourse from './component/admin/TrashCourse.jsx';
import PrivateRoute from './component/routes/PrivateRoute.jsx'
import AdminHomePage from './component/admin/AdminHomePage.jsx';
import CreateUser from './component/admin/CreateUser.jsx';
import Profile from './component/pages/Profile.jsx';
import CourseMangerPageTeacher from './component/pages/CourseMangerPageTeacher.jsx';

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <HomePage />
        },
        {
          path: "register",
          element: <RegisterPage />
        },
        {
          path: "login",
          element: <LoginPage />
        },
        {
          path: "course",
          element: <CoursesPage />
        },
        {
          path: "profile",
          element: <PrivateRoute element={<Profile />} role={["admin", "teacher", "user"]} />
        },
        {
          path: "course-manager",
          element: <PrivateRoute element={<CourseMangerPageTeacher />} role={["admin", "teacher"]} />
        },
        {
          path: "course-create",
          element: <PrivateRoute element={<CreateCourse />} role={["admin", "teacher"]} />
        },
        {
          path: "course-edit/:id",
          element: <PrivateRoute element={<CourseEdit />} role={["admin", "teacher"]} />
        },
      ]
    },
    {
      path: "/manager",
      element: <PrivateRoute element={<AdminPage />} role={["admin", "teacher"]} />,
      children: [
        {
          path: "",
          element: <AdminHomePage />
        },
        {
          path: "user",
          element: <User />
        },
        {
          path: "course",
          element: <Courses />
        },
        {
          path: "create",
          element: <CreateCourse />
        },
        {
          path: "edit/:id",
          element: <CourseEdit />
        },
        {
          path: "trash",
          element: <TrashCourse />
        },
        {
          path: "user-create",
          element: <CreateUser />
        },
        {
          path: "profile",
          element: <PrivateRoute element={<Profile />} role={["admin", "teacher", "user"]} />
        },
      ],
    }
  ]
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)
