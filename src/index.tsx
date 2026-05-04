import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './Client/React/Components/App';
import { storeData } from 'Client/client';

declare global {
  type Locs = { [key: string]: string }
}

async function launch() {
  // setting test private local data
  await storeData("loginData", JSON.stringify({ loggedIn: true, sessionId: "" }));

  // initialising public/moddable local data
  let locs: { [key: string]: Locs } = {};
  let locSettings = await (await fetch('localisation/localisations_settings.json')).json();
  for (var lang of locSettings["available localisations"]) {
    locs[lang] = await (await fetch('localisation/' + lang + '.json')).json();
  }

  console.log(locs);

  const container = document.getElementById('root');
  if (!container) throw new Error('Root container #root not found');
  const root = createRoot(container);
  root.render(
    <React.StrictMode>
      <App locs={locs} />
    </React.StrictMode>
  );
}

launch();
