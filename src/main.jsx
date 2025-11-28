import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

import Home from './screens/Home.jsx';
import Login from './screens/Login.jsx';
import Signout from './screens/Signout.jsx';
import NotFound from './screens/NotFound.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/signin', element: <Login /> },
  { path: '/signout', element: <Signout /> },
  { path: '/about', element: <NotFound /> }, // Need to do a quick about page
  { path: '*', element: <NotFound /> }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
