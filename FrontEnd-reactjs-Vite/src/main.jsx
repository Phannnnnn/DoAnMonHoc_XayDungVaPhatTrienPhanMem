import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './styles/global.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import RegisterPage from './pages/Register.jsx'
import UserPage from './pages/UserPage.jsx'
import LoginPage from './pages/LoginPage.jsx'

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <div>Home page</div>
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
        }
      ]
    },
  ]
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
)
