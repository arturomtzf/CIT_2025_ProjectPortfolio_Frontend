import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import './index.css'

import Home from './screens/Home.jsx';
import Login from './screens/Login.jsx';
import Signout from './screens/Signout.jsx';
import NotFound from './screens/NotFound.jsx';
import TitlesList from './screens/TitlesList.jsx';
import TitleDetails from './screens/TitleDetails.jsx';
import ActorDetails from './screens/ActorDetails.jsx';
import ActorsList from './screens/ActorsList.jsx';

const router = createBrowserRouter([
  { path: '/', element: <Home /> },
  { path: '/titles', element: <TitlesList /> },
  { path: '/title/:id', element: <TitleDetails /> },
  { path: '/actors', element: <ActorsList /> },
  { path: '/actor/:id', element: <ActorDetails /> },
  { path: '/signin', element: <Login /> },
  { path: '/signout', element: <Signout /> },
  { path: '*', element: <NotFound /> }
]);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
