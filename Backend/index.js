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
        let temp = {name: data.Name, halflife: data.halflife, grams: calculateAlcoholGrams(data.milliliters, data.percent), timeDrank: data.timeDrank}
        drinks.push(temp);

        let drinkIterator = drinks.values();
        for(let drink of drinkIterator) {
            console.log("Drink: " + JSON.stringify(drink));
        }
    });

    socket.on("getBAC", () => {
        let BAC = 0;
        let drinkIterator = drinks.values();
        for(let drink of drinkIterator) {
            let timePassed = (new Date().getTime() - drink.timeDrank) / 1000 / 60 / 60;
            let r = calculateWidmarkFactor(height/100, weight, age);
            let A_ingested = drink.grams;
            let W = weight;
            BAC += (A_ingested * ((100 - (100/(2**(timePassed/drink.halflife))))/100)) / (r * W * 1000) * 100 - .015 * timePassed;
        }
        socket.emit("BAC", {BAC: BAC});
    });


});


function calculateWidmarkFactor(heightM, weightKG, age) {
    return .62544 + .13664 * heightM - weightKG * (.00189 + .002425 / (heightM * heightM)) + 1 / (weightKG * (.57986 + 2.54 * heightM - .02255 * age))
}

function calculateAlcoholGrams(milliliters, percent) {
    return (milliliters/1000) * (percent/100) * .789;
}