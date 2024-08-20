import 'regenerator-runtime/runtime';
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import ContextProvider from './context/ContextProvider.jsx'
import { ClerkProvider } from '@clerk/clerk-react'

const PUBLISHABLE_KEY = "pk_test_Y29udGVudC1jb2QtOTAuY2xlcmsuYWNjb3VudHMuZGV2JA"

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
