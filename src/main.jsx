import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async";
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './Routes/router';
import { UserProvider } from './Provider/UserProvider';

createRoot(document.getElementById('root')).render(
<StrictMode>
  <HelmetProvider>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </HelmetProvider>
</StrictMode>

)
