import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

// StrictMode mounts components twice in development, which exposes missing cleanup.
createRoot(document.getElementById('root')).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
