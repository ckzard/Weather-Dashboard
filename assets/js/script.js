var apiKey = "dc4f43c3284c5d9fc2e4a7144ca92ad9";
var cityLongitude = 0;
var cityLatitude = 0;
var kelv = 273.15;
var state = 0;
// convert kelvin to celsius by subtracting 273.15 from kelvin;

var fiveDayWeatherRequestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
var currentWeatherRequestUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + apiKey;
var currentUVIndex = "http://api.openweathermap.org/data/2.5/uvi?lat=" + cityLatitude + "&lon=" + cityLongitude  + "&appid=" + apiKey;

var cityInputEl = document.querySelector("#cityName");
var cityFormEl = document.querySelector(".inputGroup");
//input section targets

var cityTitle = document.querySelector("#cityTitle");
var cityTemp = document.querySelector("#cityTemp");
var cityHum = document.querySelector("#cityHum");
var cityWind = document.querySelector("#cityWind");
var cityIndex = document.querySelector("#cityIndex");
//main weather targets

var sideSection = document.querySelector(".sideSection")
var sideCityList = sideSection.getElementsByTagName("button");
var deleteHistory = document.querySelector(".deleteHistory");
//side section targets

var forecastBoxes = document.querySelectorAll(".forecastItem");
//targets the group of forecast boxes

var cityObject = {
    "Name" : "",
    "Temperature" : 0,
    "Humidity": 0,
    "Windspeed": 0, 
    "UV Index": 0,
};

var cities = [];

function init () {
    storedCities = JSON.parse(localStorage.getItem("Cities"));
    if (storedCities !== null) {
        cities = storedCities;
    }
    console.log(cities);
    renderStoredCities();
}

var weatherSearchHandler = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
    cityInputEl.value = "";
    getCityWeather(cityName);
};

var getCityWeather = function (cityName) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + apiKey;
    fetch(requestUrl)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        cityObject.Name = cityName;
        cityObject.Temperature = Math.round(data.main.temp - 273.15) + "°C"; //converting to celsius
        cityObject.Humidity = data.main.humidity + "%";
        cityObject.Windspeed = Math.round(data.wind.speed * 2.237) + " mph";
        var iconcode = data.weather[0].icon;
        var iconurl = "http://openweathermap.org/img/w/" + iconcode + ".png";
        $('#wicon').attr('src', iconurl);
        cities.push(cityObject.Name);
        getCityForecast(data.coord.lat, data.coord.lon);
        storeCity();
        renderCityDetails(data, cityObject);
        init();
    }) 
}

var getCityForecast = function (lat, lon) {
    var requestUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude={part}&appid=" + apiKey;
    fetch(requestUrl)
    .then(function(response) {
        return response.json()
    })
    .then(function(data) {
        renderCityForecast(data);
    })
}

function renderCityDetails (data, cityObject) {
    var unixTime = (data.dt);
    var date = new Date(unixTime * 1000);
    var formattedDate = date.toLocaleDateString("en-US");
    cityTitle.textContent = cityObject.Name + " " + formattedDate;
    cityTemp.textContent  = "Temperature: " + cityObject.Temperature;
    cityHum.textContent = "Humidity: " + cityObject.Humidity;
    cityWind.textContent = "Windspeed: " + cityObject.Windspeed;
    
}

function renderCityForecast (data) {
    console.log(data);
    for (let i = 0; i < forecastBoxes.length; i++) {
        $("p").remove();
        //removes weather elements in forecast box for the next loop to add more
    }
    cityIndex.textContent = "UV Index: " + Math.round(data.current.uvi);
    var uviData = Math.round(data.current.uvi);
    if (uviData <= 2) {
        cityIndex.setAttribute("style", "color: limegreen; -webkit-text-stroke-width: 0.75px; -webkit-text-stroke-color: black;");
    } else if (uviData <= 5){
        cityIndex.setAttribute("style", "color: yellow; -webkit-text-stroke-width: 0.75px; -webkit-text-stroke-color: black;");
    } else if (uviData <= 7) {
        cityIndex.setAttribute("style", "color: orange; -webkit-text-stroke-width: 0.75px; -webkit-text-stroke-color: black;");
    } else if (uviData <= 10) {
        cityIndex.setAttribute("style", "color: red; -webkit-text-stroke-width: 0.75px; -webkit-text-stroke-color: black;");
    } else if (uviData > 10) {
        cityIndex.setAttribute("style", "color: violet; -webkit-text-stroke-width: 0.75px; -webkit-text-stroke-color: black;");
    }
    for (let i = 0; i < forecastBoxes.length; i++) {
        var unixTime = (data.daily[i + 1].dt);
        var date = new Date(unixTime * 1000);
        var formattedDate = date.toLocaleDateString("en-US");
        var icon = data.daily[i]["weather"][0]["icon"];
        var temp = Math.round(data.daily[i]["temp"].day - kelv) + "°C";
        var humidity = data.daily[i].humidity + "%";

        $(forecastBoxes[i].setAttribute("style", "opacity: 100%;"))
        $(forecastBoxes[i]).append("<p>" + formattedDate +"</p>")
        $(forecastBoxes[i]).append("<p><img id='' src='http://openweathermap.org/img/w/" + icon + ".png'" + "alt=''></p>")
        $(forecastBoxes[i]).append("<p>" + "Temp: " + temp + "</p>")
        $(forecastBoxes[i]).append("<p>" + "Humidity: " + humidity + "</p>")
           
    }
}

function storeCity () {
    localStorage.setItem(cityObject.Name, JSON.stringify(cityObject));
    localStorage.setItem("Cities", JSON.stringify(cities));
    //stores objects in localstorage
}

function renderStoredCities() {
    for (let i = 0; i < sideCityList.length; i++) {
        sideCityList[i].textContent = cities[i];
    }
}

function removeStoredCities () {
    localStorage.setItem("Cities", "");
    for (let i = 0; i < sideCityList.length; i++) {
        sideCityList[i].textContent = "";
    }
    location.reload();
}

function getApiUV(requestUrl) {
    fetch(requestUrl)
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        console.log(data)
    })
}

cityFormEl.addEventListener("submit", weatherSearchHandler);

sideSection.addEventListener("click", function (event) {
    event.preventDefault();
    var element = event.target;

    getCityWeather(element.textContent)
})

deleteHistory.addEventListener("click", function (event) {
    event.preventDefault();
    var element = event.target;
    console.log(element)
    removeStoredCities();
})
//uncomment for testing

init();
