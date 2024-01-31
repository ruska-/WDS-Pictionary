import { io } from "socket.io-client";

const production = process.env.NODE_ENV === "production";
const serverURL = production ? "realsite.com" : "http://localhost:3000";

const socket = io(serverURL);

const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get("name");
const roomId = urlParams.get("room-id");

if (!name || !roomId) window.location = "/index.html";


