const app = require('./src/app')
const databaseConfig = require('./src/db/database')

databaseConfig()

app.listen(3000, () => {
    console.log('Server is connected')
})