const production = process.env.NODE_DEV === "production";
const clientURL = production ? "realsite.com" : "http://localhost:1234";

const io = require("socket.io")(3000, {
  cors: {
    origin: clientURL,
  },
});

const rooms = {};
const WORDS = ["Dog", "Bike", "Human"];

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    const user = { id: socket.id, name: data.name, socket: socket };
    let room = rooms[data.roomId];
    if (room == null) {
      room = { users: [], id: data.roomId };
      rooms[data.roomId] = room;
    }
    room.users.push(user);

    socket.join(room.id);
    console.log("leeengthhh " + room.users.length);

    console.log(room.id + " " + data.name);
    socket.on("ready", () => {
      user.ready = true;
      if (room.users.every((u) => u.ready)) {
        console.log(room.users.length);
        console.log(room.users);
        room.word = getRandomeEntry(WORDS);
        room.drawer = getRandomeEntry(room.users);
        io.to(room.drawer.id).emit("start-drawing", room.word);
        room.drawer.socket.to(room.id).emit("start-guessing");
      }
    });

    socket.on("disconnect", () => {
      room.users = room.users.filter((userInRoom) => userInRoom !== user);
    });

    socket.on("draw", (data) => {
      socket.to(room.id).emit("draw-line", data.start, data.end);
    });
  });
});

function getRandomeEntry(array) {
  return array[Math.floor(Math.random() * array.length)];
}
