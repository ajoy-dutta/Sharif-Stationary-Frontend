import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HelmetProvider } from "react-helmet-async";
import './index.css'
import {
  RouterProvider,
} from "react-router-dom";
import { router } from './Routes/router';

createRoot(document.getElementById('root')).render(
  <StrictMode>
   
    <HelmetProvider>
    <RouterProvider router={router} />
  </HelmetProvider>

    </StrictMode>,
)
