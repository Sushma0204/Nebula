import 'regenerator-runtime/runtime';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ContextProvider from './context/ContextProvider.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error("Clerk publishable key is missing");
}

ReactDOM.createRoot(document.getElementById('root')).render(

    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      <ContextProvider>
        <App />
      </ContextProvider>
    </ClerkProvider>

)
