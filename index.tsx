import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

const mountApp = () => {
  const rootElement = document.getElementById('root');
  if (!rootElement) return;

  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  } catch (err) {
    console.error("Failed to render App:", err);
    rootElement.innerHTML = `<div style="color: white; padding: 20px; text-align: center;">
      <h2>Something went wrong</h2>
      <p>${err instanceof Error ? err.message : 'Unknown error'}</p>
    </div>`;
  }
};

mountApp();

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(console.error);
  });
}
