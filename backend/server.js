require("dotenv").config();

const app = require("./src/app");
const connectToDb = require("./src/config/database");

// Render (and most hosts) inject PORT; fall back to 3000 locally
const port = process.env.PORT || 3000;

connectToDb();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
