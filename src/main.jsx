import React from 'react';
import { createRoot } from 'react-dom/client';
import * as supabase from '@supabase/supabase-js';
import App from './App.jsx';
import './styles.css';

window.supabase = supabase;

createRoot(document.getElementById('root')).render(<App />);
