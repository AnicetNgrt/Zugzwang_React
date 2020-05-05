import express from "express";
import * as socketio from "socket.io";
import { Message } from "../Shared/Api/Message";
import * as mongoose from 'mongoose';
import { UserModel, User } from "../Shared/Api/User";
import { LoginData } from "../Shared/Api/LoginData";

(async () => {
  await mongoose.connect('mongodb+srv://admin:'+process.env.DBP+'@wahlsedev-qr8wy.gcp.mongodb.net/test?retryWrites=true&w=majority', { useNewUrlParser: true, useUnifiedTopology: true, dbName: "" });
  const { _id: id } = await UserModel.create(new User("Anicet","#0001","patate")); // an "as" assertion, to have types for all properties
  const user = await UserModel.findById(id).exec();
  console.log(user); // prints { _id: 59218f686409d670a97e53e0, name: 'JohnDoe', __v: 0 }
})();


const app = express();
app.set("port", process.env.PORT || 3000);
let http = require("http").Server(app);
let io = require("socket.io")(http);


io.on("connection", function (socket: any) {
  const sessionID = socket.sessionid;
  console.log("a user connected "+sessionID);
  socket.emit("message", new Message({name:"Server",team:"srv"},"Tu es bo"));
});

io.on("loginGuest", function (socket: any, data:LoginData) {
  
});

const server = http.listen(4443, function() {
  console.log("listening on *:4443");
});