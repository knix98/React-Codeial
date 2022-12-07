import React from 'react';
import ReactDOM from 'react-dom/client';
import { Toaster } from 'react-hot-toast';

import './styles/index.css';
import { App } from './components/index';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Toaster position='top-left' toastOptions={{duration: 5000}}/>
    <App />
  </React.StrictMode>
);
