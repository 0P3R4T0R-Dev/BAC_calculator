const express = require("express");
const app = express();
const http = require("http");
const port = 3000;

app.use(express.static("../Frontend"));

const server = http.createServer(app);
const io = require("socket.io")(server, {
    cors: {origin: "*"},
});
server.listen(port, () => { console.log(`Server running at http://localhost:${port}`); });

// app.get("/", (req, res) => {
//   res.send("Hello World!");
// });
