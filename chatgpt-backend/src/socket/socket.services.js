const { Server } = require("socket.io");

function socketServer(httpServer) {
    const io = new Server(httpServer, {});

    io.on("connection", (socket) => {
        console.log('Server connected', socket.id)
    });

}

module.exports = socketServer