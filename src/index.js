import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './components/App';
// import Example from './components/Example';

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<App />);

//root.render(<Example />);
