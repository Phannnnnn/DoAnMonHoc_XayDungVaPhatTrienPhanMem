import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import UserPage from './component/pages/UserPage.jsx'
import LoginPage from './component/pages/LoginPage.jsx'
import HomePage from './component/pages/HomePage.jsx'
import CoursesPage from './component/pages/CoursesPage.jsx'
import UserManagePage from './component/pages/UserManagerPage.jsx'
import CoursesManagerPage from './component/pages/CoursesManagerPage.jsx'
import RegisterPage from './component/pages/Register.jsx'
import { AuthWrapper } from './context/auth.context.jsx'
import PrivateRoute from './component/routes/PrivateRoute.jsx'

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
          path: "user",
          element: <UserPage />
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
          path: "usermanager",
          element: <PrivateRoute element={<UserManagePage />} role="admin" />,
        },
        {
          path: "coursesmanager",
          element: <PrivateRoute element={<CoursesManagerPage />} role="admin" />,
        }
      ]
    },
  ]
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AuthWrapper>
      <RouterProvider router={router} />
    </AuthWrapper>
  </React.StrictMode>,
)
