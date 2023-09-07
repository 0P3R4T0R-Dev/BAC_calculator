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

let height = 0;
let weight = 0;
let age = 0;

let drinks = [];

io.on("connection", (socket) => {
    console.log("A user connected with socket ID: " + socket.id);
    socket.on("disconnect", () => { console.log("A user disconnected"); });
    
    socket.on("updateWHA", (data) => {
        console.log("Received data from client: " + JSON.stringify(data));
        height = data.height;
        weight = data.weight;
        age = data.age;
    });

    socket.on("Add_drink", (data) => {
        console.log("Received drink from client: " + JSON.stringify(data));
        drinks.push(data);

        let drinkIterator = drinks.values();
        for(let drink of drinkIterator) {
            console.log("Drink: " + JSON.stringify(drink));
        }
    });


});


function calculateWidmarkFactor(heightM, weightKG, age) {
    return .62544 + .13664 * heightM - weightKG * (.00189 + .002425 / (heightM * heightM)) + 1 / (weightKG * (.57986 + 2.54 * heightM - .02255 * age))
}

function calculateAlcoholGrams(milliliters, percent) {
    return (milliliters/1000) * percent * .789;
}