import * as ls from 'local-storage'
//const socket = io("http://localhost:4443");

export const getLocalData = async (key:string):Promise<string | null> => {
  try {
    const value = ls.get<string>(key);
    return value;
  } catch(e) {
    return null;
  }
}

export const storeData = async (key:string, value:string) => {
  try {
    await ls.set<string>(key, value);
  } catch (e) {
    // saving error
  }
}

/*export function onMessages(onMessage:(m:Message)=>void) {
  socket.on("message", function (data: Message) {
    onMessage(data);
  });
}

export function onConnectionConfirmed(onConnectionConfirmed: ()=>void) {
  socket.on("ConnectionConfirmed", () => {
    onConnectionConfirmed();
  })
}

export function onLogin(onLogin: (you: User | string) =>void) {
  socket.on("Login", (logined: User | string) => {
    onLogin(logined);
  });
}

export function sendMessage(m:Message) {
  socket.emit("message", m);
}*/