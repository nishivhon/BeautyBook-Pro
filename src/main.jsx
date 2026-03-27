import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './app'
import './styles/tailwind.css'
// GLOBAL NAVIGATION INTERCEPTOR - Blocks redirect to / for email link users
const originalPush = window.history.pushState;
const originalReplace = window.history.replaceState;

function interceptNavigation(type) {
  return function(state, title, url) {
    const verifiedUser = sessionStorage.getItem('verifiedUser');
    if (verifiedUser && url === '/') {
      return; // BLOCK the navigation
    }
    if (type === 'push') {
      return originalPush.apply(window.history, arguments);
    } else {
      return originalReplace.apply(window.history, arguments);
    }
  };
}

window.history.pushState = interceptNavigation('push');
window.history.replaceState = interceptNavigation('replace');
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)