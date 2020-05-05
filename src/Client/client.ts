import io from 'socket.io-client';
import { Message } from 'Shared/Api/Message';
import { User } from 'Shared/Api/User';

const socket = io("http://localhost:4443");

export function onMessages(onMessage:(m:Message)=>void) {
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
}