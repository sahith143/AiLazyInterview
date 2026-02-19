import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// 1. Prevent right-click context menu in production for a native feel
if (import.meta.env.PROD) {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
}

// 2. Global error boundary for unhandled promise rejections (AI/Tauri API failures)
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
});

// 3. Mount the React application
const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Failed to find the root element. Check your index.html.");
}

// In Tauri, the app is ready once the DOM is loaded. 
// No special tauri-init is required for v1/v2, but we wrap in StrictMode.
ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)