import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import { MoralisProvider } from 'react-moralis';

ReactDOM.render(
  <React.StrictMode>
    <MoralisProvider
      appId='q5IEQuw1hSTybZj6SPbZG4elcBQjImXVgTbgje9h'
      serverUrl='https://htc0sqek2ktg.usemoralis.com:2053/server'
    >
      <App />
    </MoralisProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
