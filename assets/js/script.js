var apiKey = "dc4f43c3284c5d9fc2e4a7144ca92ad9";
var cityLongitude = 0;
var cityLatitude = 0;
var kelv = 273.15;
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
//side section targets

var forecastBoxes = document.querySelectorAll(".forecastItem");

var cityObject = {
    "Name" : "",
    "Temperature" : 0,
    "Humidity": 0,
    "Windspeed": 0, 
    "UV Index": 0,
};

var cities = [];

function init () {
    storedCities = JSON.parse(sessionStorage.getItem("Cities"));
    if (storedCities !== null) {
        cities = storedCities;
    }
    console.log(cities);
    // Object.keys(sessionStorage).forEach(function(key){
    //     if (key !== "IsThisFirstTime_Log_From_LiveServer") {
            
    //     }
    // });
    renderStoredCities();
}

var weatherSearchHandler = function (event) {
    event.preventDefault();

    var cityName = cityInputEl.value.trim();
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
        cityObject.Windspeed = data.wind.speed * 2.237 + "mph";
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
    cityTitle.textContent = cityObject.Name;
    cityTemp.textContent  = "Temperature: " + cityObject.Temperature;
    cityHum.textContent = "Humidity: " + cityObject.Humidity;
    cityWind.textContent = "Windspeed: " + cityObject.Windspeed;
    
}

function renderCityForecast (data) {
    console.log(data);
    cityIndex.textContent = "UV Index: " + data.current.uvi;
    for (let i = 0; i < forecastBoxes.length; i++) {
        var unixTime = (data.daily[i + 1].dt);
        var date = new Date(unixTime * 1000);
        var formattedDate = date.toLocaleDateString("en-US");
        var icon = data.daily[i]["weather"][0]["icon"];
        var temp = Math.round(data.daily[i]["temp"].day - kelv) + "°C";
        var humidity = data.daily[i].humidity + "%";

        $(forecastBoxes[i]).append("<p>" + formattedDate +"</p>")
        $(forecastBoxes[i]).append("<p><img id='' src='http://openweathermap.org/img/w/'" + icon + "alt=''></p>")
        $(forecastBoxes[i]).append("<p>" + "Temp: " + temp + "</p>")
        $(forecastBoxes[i]).append("<p>" + "Humidity: " + humidity + "</p>")
    }
}

function storeCity () {
    sessionStorage.setItem(cityObject.Name, JSON.stringify(cityObject));
    sessionStorage.setItem("Cities", JSON.stringify(cities));
    //stores objects in sessionstorage
}

function renderStoredCities() {
    for (let i = 0; i < sideCityList.length; i++) {
        sideCityList[i].textContent = cities[i];
    }
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

cityFormEl.addEventListener('submit', weatherSearchHandler);
// getCityWeather("Sydney");
//uncomment for testing

init();
