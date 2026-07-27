import { StrictMode, useContext } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom'
import './index.css'
import App from './App.jsx'
import SignUp from '../Component/SignUp'
import SignIn from '../Component/SignIn'
import AuthContextProvider, { AuthContext } from '../context/AuthContext'

const ProtectedRoute = () => {
  const { token } = useContext(AuthContext)


  return token ? <App /> : <Navigate to="/signin" replace />
}

const router = createBrowserRouter([
  {
    path: '/',
    element: <Navigate to="/signin" replace />,
  },
  {
    path: '/signin',
    element: <SignIn />,
  },
  {
    path: '/signup',
    element: <SignUp />,
  },
  {
    path: '/home',
    element: <ProtectedRoute />,
  },
  {
    path: '*',
    element: <Navigate to="/signin" replace />,
  },
])

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthContextProvider>
      <RouterProvider router={router} />
    </AuthContextProvider>
  </StrictMode>,
)

