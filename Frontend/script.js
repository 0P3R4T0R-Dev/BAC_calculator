const SERVER_URL = window.location.host === "localhost:3000" ? "http://localhost:3000" : "https://my-website.com";
let socket = io.connect(SERVER_URL);

socket.on("connect", () => {
    console.log("Connected to server");
});



let button_HWA = document.getElementById('button_HWA');

button_HWA.addEventListener('click', function() {
    let height = parseInt(document.getElementById('input_H').value);
    let weight = parseInt(document.getElementById('input_W').value);
    let age = parseInt(document.getElementById('input_A').value);
    
    if(isNaN(height) || isNaN(weight) || isNaN(age)) {
        console.log("Invalid data");
        return;
    }
    socket.emit('updateWHA', {height: height, weight: weight, age: age});
    console.log("Sent data to server");
});


let halflife = 0;
let milliliters = 0;
let percent = 0;
let time = 0;
let drinkName = "";

let button_drinks = document.getElementById('button_drinks');

button_drinks.addEventListener('click', function() {
    drinkName = document.getElementById('input_drinkName').value;
    halflife = Number(document.querySelector('input[name="hunger_level"]:checked').value);
    milliliters = parseInt(document.getElementById('input_ml').value);
    percent = parseInt(document.getElementById('input_ABV').value);
    time = new Date().getTime();
    if(isNaN(halflife) || isNaN(milliliters) || isNaN(percent)) {
        console.log("Invalid data");
        return;
    }
    socket.emit("Add_drink", {halflife: halflife, milliliters: milliliters, percent: percent, timeDrank: time, Name: drinkName});
    console.log("Sent drink to server");
    document.getElementById('input_ml').value = "";
    document.getElementById('input_ABV').value = "";
    document.getElementById('input_drinkName').value = "";
});


let button_BAC = document.getElementById('button_BAC');

button_BAC.addEventListener('click', function() {
    socket.emit("getBAC", {});
    console.log("Sent request for BAC to server");
});

socket.on("BAC", (data) => {
    console.log("Received BAC from server: " + JSON.stringify(data));
    document.getElementById('BAC').innerHTML = "BAC: " + data.BAC;
});


