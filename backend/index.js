const app = require('./app');
const DbConnect = require('./config/db');

DbConnect()
const PORT = 6789

app.listen(PORT , () => {
    console.log(`http://localhost:${PORT}`)
})