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
const guessTemplate = document.querySelector("[data-guess-template]");

socket.emit("join-room", { name: name, roomId: roomId });
socket.on("start-drawing", startRoundDrawer);
socket.on("start-guessing", startRoundGuesser);
socket.on("guess", displayGuess);
socket.on("winner", endRound);
endRound();
resizeCanvas();
setupHTMLEvents();

function setupHTMLEvents() {
  readyButton.addEventListener("click", () => {
    hide(readyButton);
    socket.emit("ready");
  });

  guessForm.addEventListener("submit", (e) => {
    e.preventDefault();

    if (guessInput.value === "") return;

    socket.emit("make-guess", { guess: guessInput.value });
    displayGuess(name, guessInput.value);
    guessInput.value = "";
  });

  window.addEventListener("resize", resizeCanvas);
}

function displayGuess(guesserName, guess) {
  const guessElement = guessTemplate.content.cloneNode(true);
  const messageElement = guessElement.querySelector("[data-text]");
  const nameElement = guessElement.querySelector("[data-name]");
  nameElement.innerText = guesserName;
  messageElement.innerText = guess;
  messagesElement.append(guessElement);
}

function resizeCanvas() {
  canvas.width = null;
  canvas.height = null;
  const clientDimensions = canvas.getBoundingClientRect();
  canvas.width = clientDimensions.width;
  canvas.height = clientDimensions.height;
}

function startRoundGuesser() {
  show(guessForm);
  hide(wordElement);
  messagesElement.innerHTML = "";
  drawableCanvas.clearCanvas();
}

function startRoundDrawer(word) {
  drawableCanvas.canDraw = true;
  drawableCanvas.clearCanvas();
  wordElement.innerText = word;
  messagesElement.innerHTML = "";
}

function endRound(name, word) {
  if (name && word) {
    wordElement.innerText = word;
    show(wordElement);
    displayGuess(null, `${name} is the winner`);
  }

  show(readyButton);
  drawableCanvas.canDraw = false;
  hide(guessForm);
}

function hide(element) {
  element.classList.add("hide");
}

function show(element) {
  element.classList.remove("hide");
}
