let APPID = "30ffbbc0b3a25385e8f52bb2c2cfea0a&units=metric&lang=pl";
let temp;
let loc;
let icon;
let humidity;
let wind;
let direction;
let description;
let pressure;
let sunrise;
let sunset;
let input;

function updateByZip(zip) {
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
        "zip=" + zip +
        "&APPID=" + APPID;
    sendRequest(url);
}
function updateByGeo(lat, lon) {
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
        "lat=" + lat +
        "&lon=" + lon +
        "&APPID=" + APPID;
    sendRequest(url);
}
function updateByCity(city) {
    var url = "http://api.openweathermap.org/data/2.5/weather?" +
        "q=" + city +
        "&APPID=" + APPID;
    sendRequest(url);
}
$(document).ready(function(){
    $('#subimt').click(function(){
        let url = "http://api.openweathermap.org/data/2.5/weather?" +
            "q=" + input.value +
            "&APPID=" + APPID;
        sendRequest(url);
    });
    $('#city').on('keydown', function(enter) {
        if (enter.which === 13) {
            let url = "http://api.openweathermap.org/data/2.5/weather?" +
                "q=" + input.value +
                "&APPID=" + APPID;
            sendRequest(url);
            enter.preventDefault();
            enter.currentTarget.value = "";
        }
    });
});

function sendRequest(url) {
    let xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function () {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200){
            let data = JSON.parse(xmlhttp.responseText);
            let weather = {};
            weather.description = data.weather[0].description;
            weather.icon = data.weather[0].icon;
            weather.humidity = data.main.humidity;
            weather.wind = data.wind.speed;
            weather.direction = degreesToDirection(data.wind.deg);
            weather.pressure = data.main.pressure;
            weather.loc = data.name;
            weather.temp = data.main.temp;
            weather.sunrise = setSun(data.sys.sunrise);
            weather.sunset = setSun(data.sys.sunset);
            // weather.rain = data.rain?data.rain["3h"] : '';
            weather.temp_max = data.main.temp_max;
            update(weather);

        }
    };
    xmlhttp.open("GET", url, true);
    xmlhttp.send();
}
function setSun(sun) {
   let propsunrise = new Date(sun *1000);
   return propsunrise.toLocaleTimeString();
}
function degreesToDirection(degrees) {
    let range = 360/16;
    let low = 360 - range/2;
    let high = (low + range) % 360;
    let angles = [ "Pn", "Pn Pn Wsch", "Pn Wsch", "Wsch Pn Wsch", "Wsch", "Wsch Pd Wsch", "Pd Wsch", "Pd Pd Wsch", "Pd", "Pd Pd Zach", "Pd Zach", "Zach Pd Zach", "ZAch", "Zach Pn Zach", "Pn Zach", "Pn Pn Zach"];
    for( i in angles ){

        if (degrees>=low && degrees<high)
            return angles[i];

        low = (low + range) % 360;
        high = (high + range) % 360;
    }
    return "N";
}
// // kelwiny na celcjusze
// function K2C(k) {
//     return Math.round(k - 273.15);
// }

function update(weather) {
    wind.innerHTML = weather.wind;
    direction.innerHTML = weather.direction;
    temp.innerHTML = weather.temp;
    sunrise.innerHTML = weather.sunrise;
    sunset.innerHTML = weather.sunset;
    loc.innerHTML = weather.loc;
    humidity.innerHTML = weather.humidity;
    pressure.innerHTML = weather.pressure;
    description.innerHTML = weather.description;
    icon.src = "images/" + weather.icon + ".png";
    console.log(icon.src);
}
function showPosition(position) {
    updateByGeo(position.coords.latitude, position.coords.longitude);
}

window.onload = function () {
    temp = document.getElementById("temperature");
    loc = document.getElementById("location");
    icon = document.getElementById("icon");
    humidity = document.getElementById("humidity");
    wind = document.getElementById("wind");
    direction = document.getElementById("direction");
    description = document.getElementById("description");
    pressure = document.getElementById("pressure");
    sunrise = document.getElementById("sunrise");
    sunset = document.getElementById("sunset");
    input = document.getElementById("city");

    if(!navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        let city = window.prompt("Nie mogę odnaleźć Twojej lokalizacji, podaj nazwę miasta.");
        updateByCity(city);
    }
}

