const production = process.env.NODE_DEV === "production";
const clientURL = production ? "realsite.com" : "http://localhost:1234";

const io = require("socket.io")(3000, {
  cors: {
    origin: clientURL,
  },
});

io.on("connection", (socket) => {
  console.log("successful");
});
