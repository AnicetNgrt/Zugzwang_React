import io from 'socket.io-client';
import { Message } from 'Shared/Api/Message';
import { User } from 'Shared/Api/User';
import AsyncStorage from '@react-native-community/async-storage';

const socket = io("http://localhost:4443");

export const getLocalData = async (key:string):Promise<string | null> => {
  try {
    const value = await AsyncStorage.getItem(key)
    return value;
  } catch(e) {
    return null;
  }
}

export const storeData = async (key:string, value:string) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
}

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