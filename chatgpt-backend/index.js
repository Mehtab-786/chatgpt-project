const app = require('./src/app')
const databaseConfig = require('./src/db/database')
const socketServer = require('./src/socket/socket.services')
const { createServer } = require("http");
const httpServer = createServer(app);

databaseConfig()
socketServer(httpServer)

httpServer.listen(3000, () => {
    console.log('Server is connected')
})