import { io } from "socket.io-client";

const production = process.env.NODE_ENV === "production";
const serverURL = production ? "realsite.com" : "http://localhost:3000";

const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get("name");
const roomId = urlParams.get("room-id");

if (!name || !roomId) window.location = "/index.html";

const socket = io(serverURL);
const guessForm = document.querySelector("[data-guess-form]");
const wordElement = document.querySelector("[data-word]");
const canvas = document.querySelector("[data-canvas]");
const messagesElement = document.querySelector("[data-messages]");
const guessInput = document.querySelector("[data-guess-input]");
const readyButton = document.querySelector("[data-ready-btn]");

socket.emit("join-room", { name: name, roomId: roomId });

console.log("meh");

function endRound() {
  hide(guessForm);
}

function hide(element) {
  element.classList.add("hide");
}
