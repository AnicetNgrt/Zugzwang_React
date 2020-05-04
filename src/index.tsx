import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './Client/React/Components/App';
import io from 'socket.io-client';

const socket = io("http://localhost:4443");
  // listen for new messages
socket.on("message", function(data: any) {
  console.log(data);
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);