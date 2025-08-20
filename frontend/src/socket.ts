import { io } from "socket.io-client";

const socket = io("http://xxx.xxx.x.x:5000", {
  transports: ["websocket"],
  autoConnect: true,
});

export default socket;
