const socketIo = require("socket.io");
const jwtAuth = require("socketio-jwt-auth");

const socketAuth = require("../helpers/socketAuth");
const { User, Message } = require("../models");

module.exports = server => {
  const io = socketIo(server);

  // if user is not verified - socket emit error message
  io.use(jwtAuth.authenticate({ secret: process.env.JWT_SECRET }, socketAuth));

  io.sockets.on("connection", socket => {
    socket.emit("success", { msg: "success!" });
    console.log("user connected");

    /**
     * Join to room and return its history
     */
    socket.on("room:join", async function(room) {
      socket.join(room.name);
      console.log(`user ${socket.request.user.username} join to ${room.name}`);

      const messages = await Message.findAll({
        where: { room_id: room.id },
        include: {
          model: User,
          as: "user",
          attributes: ["id", "username", "screenname", "avatar"],
        },
      });

      socket.emit("messages:history", messages);
    });

    /**
     * CREATE new message and broadcast it to room
     */
    socket.on("message:create", data => {
      Message.create({
        roomId: data.roomId,
        userId: data.userId,
        text: data.text,
      }).then(message => {
        const msg = message.get({ plain: true });
        msg.user = socket.request.user;
        socket.broadcast.to(data.roomName).emit("messages:add", message);
        socket.emit("messages:add", message);
      });
    });

    socket.on("typing:start", function(room) {
      const username = socket.request.user.username;
      socket.broadcast.to(room.name).emit("typing_bc:start", username);
    });

    socket.on("typing:stop", function(room) {
      socket.broadcast.to(room.name).emit("typing_bc:stop");
    });

    socket.on("room:leave", function(room) {
      socket.leave(room.name);
      console.log(`user ${socket.request.user.username} leave ${room.name}`);
    });

    socket.on("disconnect", () => {
      console.log("disconnected !!!");
    });
  });
};
