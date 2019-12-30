const express = require("express");
const app = express();
const port = 3001;

app.use(express.static(__dirname + "/../dist"));

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
