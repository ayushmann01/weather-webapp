// jshint esversion:6

const express = require("express");
const https = require("https");
require("dotenv").config();
const bodyParser = require("body-parser");
const app = express();

app.use(bodyParser.urlencoded({
    extended: true
}));

const API_KEY = process.env.APIKEY;


app.get("/", (request, response) => {
    response.sendFile(__dirname + "/index.html");
});

app.post("/", (request, res) => {

    var city = request.body.cityInput;

    const url = "https://api.weatherapi.com/v1/current.json?key=" + API_KEY + "&q=" + city;


    https.get(url, function (response) {

        console.log(response.statusCode);

        if (response.statusCode === 200) {
            response.on("data", (data) => {

                const weatherData = JSON.parse(data);
                const city = weatherData.location.name;
                const weather = weatherData.current.condition.text;
                const temp = weatherData.current.temp_c;
                const imageUrl = weatherData.current.condition.icon;

                res.write("<h1>city name: " + city + " weather: " + weather + "</h1>");
                res.write("<h2> Current temperature is: " + temp + " degree celsius</h2>");
                res.write("<img src=" + imageUrl + ">");
                res.send();      
            });
        } else{
            res.write("<h1>Sorry! Cannot find your city.</h1>");
            res.send();
        } 
        
    });
    
});



app.listen(process.env.PORT |  3000, function () {
    console.log("weather app started at port-3000");
});