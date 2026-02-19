import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 1. Prevent right-click context menu in production (optional, for a cleaner "App" feel)
if (import.meta.env.PROD) {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
}

// 2. Global error boundary for unhandled promise rejections (AI API failures)
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// 3. Mount the React application
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Check your index.html.");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)