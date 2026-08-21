
require("dotenv").config();

let app = require("./src/app");
let connectToDb = require("./src/config/database");

let port = 3000;

connectToDb();

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});
