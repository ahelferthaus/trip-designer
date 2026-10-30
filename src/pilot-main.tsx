import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import PilotApp from './PilotApp';
createRoot(document.getElementById('root')!).render(<StrictMode><PilotApp /></StrictMode>);
