const app = require('./src/app')
const { createServer } = require("http");
const databaseConfig = require('./src/db/databaseConfig')
const httpServer = createServer(app);
const { socketServer } = require('./src/socket/socket.services')


databaseConfig()

socketServer(httpServer)

httpServer.listen(3000, () => {
    console.log('Server running on 3000')
})