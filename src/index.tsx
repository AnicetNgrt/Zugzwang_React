import React from 'react';
import ReactDOM from 'react-dom';
import App from './Client/React/Components/App';
import { storeData } from 'Client/client';

async function launch() {
  await storeData("loginData", JSON.stringify({ loggedIn: true, sessionId: "" }));

  ReactDOM.render(
    <React.StrictMode>
      <App/>
    </React.StrictMode>,
    document.getElementById('root')
  );
}

launch();