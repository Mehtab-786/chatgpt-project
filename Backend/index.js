const app = require('./src/app')
const databaseConfig = require('./src/db/databaseConfig')

databaseConfig()

app.listen(3000, () => {
    console.log('Server running on 3000')
})