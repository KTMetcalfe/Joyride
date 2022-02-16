import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import { loadConnections } from './components/vars';

loadConnections().then(() =>
    ReactDOM.render(
        <React.StrictMode>
            <App />
        </React.StrictMode>,
        document.getElementById('root')
    )
);