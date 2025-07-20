import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { AuthProvider } from './contexts/auth.jsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { AuthorizeProvider } from './contexts/authorize.jsx'
import { StyleRegistry } from 'styled-jsx'
import 'quill/dist/quill.snow.css'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthorizeProvider>
          <StyleRegistry>
            <App />
          </StyleRegistry>
        </AuthorizeProvider>
      </AuthProvider>
    </QueryClientProvider>
  </React.StrictMode>
)
