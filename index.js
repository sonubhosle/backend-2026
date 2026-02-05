
const dotenv = require('dotenv');
dotenv.config({ path: '.env', quiet: true});
const app = require('./app');
const databaseConnect = require('./config/db');



databaseConnect();

const PORT = process.env.PORT || 5656

app.listen(PORT, () => {
  console.log(`🚀 Server started → http://localhost:${PORT}`);
});
