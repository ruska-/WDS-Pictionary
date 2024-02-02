import { io } from "socket.io-client";
import DrawableCanvas from "./DrawableCanvas";

const production = process.env.NODE_ENV === "production";
const serverURL = production ? "realsite.com" : "http://localhost:3000";

const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get("name");
const roomId = urlParams.get("room-id");

if (!name || !roomId) window.location = "/index.html";

const socket = io(serverURL);
const guessForm = document.querySelector("[data-guess-form]");
const wordElement = document.querySelector("[data-word]");
const messagesElement = document.querySelector("[data-messages]");
const guessInput = document.querySelector("[data-guess-input]");
const readyButton = document.querySelector("[data-ready-btn]");
const canvas = document.querySelector("[data-canvas]");
const drawableCanvas = new DrawableCanvas(canvas, socket);

socket.emit("join-room", { name: name, roomId: roomId });
socket.on("start-drawing", startRoundDrawer);
socket.on("start-guessing", startRoundGuesser);
endRound();
resizeCanvas();

readyButton.addEventListener("click", () => {
  hide(readyButton);
  socket.emit("ready");
});

window.addEventListener("resize", resizeCanvas);

function resizeCanvas() {
  canvas.width = null;
  canvas.height = null;
  const clientDimensions = canvas.getBoundingClientRect();
  canvas.width = clientDimensions.width;
  canvas.height = clientDimensions.height;
}

function startRoundGuesser() {
  show(guessForm);
}

function startRoundDrawer(word) {
  drawableCanvas.canDraw = true;
  wordElement.innerText = word;
}

function endRound() {
  drawableCanvas.canDraw = false;
  hide(guessForm);
}

function hide(element) {
  element.classList.add("hide");
}

function show(element) {
  element.classList.remove("hide");
}
