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
    var url = "https://api.openweathermap.org/data/2.5/weather?" +
        "zip=" + zip +
        "&APPID=" + APPID;
    sendRequest(url);
}

function updateByGeo(lat, lon) {
    var url = "https://api.openweathermap.org/data/2.5/weather?" +
        "lat=" + lat +
        "&lon=" + lon +
        "&APPID=" + APPID;
    sendRequest(url);
}

function updateByCity(city) {
    var url = "https://api.openweathermap.org/data/2.5/weather?" +
        "q=" + city +
        "&APPID=" + APPID;
    sendRequest(url);
}

$(document).ready(function () {
    $('#subimt').click(function () {
        let url = "https://api.openweathermap.org/data/2.5/weather?" +
            "q=" + input.value +
            "&APPID=" + APPID;
        sendRequest(url);
    });
    $('#city').on('keydown', function (enter) {
        if (enter.which === 13) {
            let url = "https://api.openweathermap.org/data/2.5/weather?" +
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
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            let data = JSON.parse(xmlhttp.responseText);
            let weather = {};
            weather.description = data.weather[0].description;
            weather.icon = data.weather[0].icon;
            weather.humidity = data.main.humidity;
            weather.wind = data.wind.speed;
            weather.direction = degreesToDirection(data.wind.deg);
            weather.pressure = data.main.pressure;
            weather.loc = data.name;
            weather.temp = Fix(data.main.temp);
            weather.sunrise = setSun(data.sys.sunrise);
            weather.sunset = setSun(data.sys.sunset);
            // weather.rain = data.rain?data.rain["3h"] : '';

            // (function () {
            //     function mediaSize() {
            //         if (window.matchMedia('(max-width: 768px)').matches) {
            //             weather.loc = "POGODA U CIEBIE";
            //         }
            //
            //     };
            //     mediaSize();
            //     window.addEventListener('resize', mediaSize, false);
            // })(jQuery);
            update(weather);
        }
    };

    xmlhttp.open("GET", url, true);
    xmlhttp.onloadend = function () {
        if (xmlhttp.status == 404)
            alert("Podana nazwna jest nieprawidłowa");
    }
    xmlhttp.send();
}

function Fix(round) {
    return round.toFixed(1);
}

function setSun(sun) {
    let propsunrise = new Date(sun * 1000);
    return propsunrise.toLocaleTimeString();
}

let newTime = new Date().getHours();
if (7 <= newTime && newTime < 16) {
    $('body').addClass('day');
} else {
    $('body').addClass('night');
}

function degreesToDirection(degrees) {
    let range = 360 / 16;
    let low = 360 - range / 2;
    let high = (low + range) % 360;
    let angles = ["Pn", "Pn Pn Wsch", "Pn Wsch", "Wsch Pn Wsch", "Wsch", "Wsch Pd Wsch", "Pd Wsch", "Pd Pd Wsch", "Pd", "Pd Pd Zach", "Pd Zach", "Zach Pd Zach", "ZAch", "Zach Pn Zach", "Pn Zach", "Pn Pn Zach"];
    for (i in angles) {

        if (degrees >= low && degrees < high)
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

    (function () {
        function mediaSize() {
            if (window.matchMedia('(max-width: 768px)').matches) {
                (navigator.geolocation);
                navigator.geolocation.getCurrentPosition(showPosition);
            } else {
                if (!navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                } else {
                    alert("Nie mogę odnaleźć Twojej lokalizacji, podaj nazwę miasta.");
                }
            }
        };
        mediaSize();
        window.addEventListener('resize', mediaSize, false);
    })(jQuery);
}

