const production = process.env.NODE_DEV === "production";
const clientURL = production ? "realsite.com" : "http://localhost:1234";

const io = require("socket.io")(3000, {
  cors: {
    origin: clientURL,
  },
});

const rooms = {};

io.on("connection", (socket) => {
  socket.on("join-room", (data) => {
    const user = { id: socket.id, name: data.name, socket: socket };
    let room = rooms[data.roomId];
    if (room == null) {
      room = { users: [], id: data.roomId };
      rooms[data.roomsId] = room;
    }
    room.users.push(user);

    socket.join(room.id);
    console.log(room);
    console.log("njj");

    socket.on("disconnect", () => {
      room.users = room.users.filter((userInRoom) => userInRoom !== user);
    });
  });
});
