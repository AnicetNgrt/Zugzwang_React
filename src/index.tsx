import React from 'react';
import ReactDOM from 'react-dom';
import App from './Client/React/Components/App';
import { storeData } from 'Client/client';
import { HashRouter, Route, Switch, } from "react-router-dom";

declare global {
  type Locs = { [key: string]: string }
}

async function launch() {
  // setting test private local data
  await storeData("loginData", JSON.stringify({ loggedIn: true, sessionId: "" }));

  // initialising public/moddable local data
  let locs:{[key:string]:Locs} = {};
  let locSettings = await (await fetch('localisation/localisations_settings.json')).json();
  for (var lang of locSettings["available localisations"]) {
    locs[lang] = await (await fetch('localisation/'+lang+'.json')).json();
  }

  console.log(locs);
  ReactDOM.render(
    <React.StrictMode>
      <App locs={locs}/>
    </React.StrictMode>, document.getElementById('root'));
}

launch();
