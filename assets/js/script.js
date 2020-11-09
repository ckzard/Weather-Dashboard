var apiKey = "dc4f43c3284c5d9fc2e4a7144ca92ad9";
var cityLongitude = 0;
var cityLatitude = 0;
// convert kelvin to celsius by subtracting 273.15 from kelvin;

var fiveDayWeatherRequestUrl = "https://api.openweathermap.org/data/2.5/forecast?q=" + cityName + "&appid=" + apiKey;
var currentWeatherRequestUrl = "https://api.openweathermap.org/data/2.5/weather?q="+ cityName + "&appid=" + apiKey;
var currentUVIndex = "http://api.openweathermap.org/data/2.5/uvi?lat=" + cityLatitude + "&lon=" + cityLongitude  + "&appid=" + apiKey;

var cityInputEl = document.querySelector("#cityName");
var cityFormEl = document.querySelector(".inputGroup");
var cityTitle = document.querySelector("#cityTitle");
var cityTemp = document.querySelector("#cityTemp");
var cityHum = document.querySelector("#cityHum");
var cityWind = document.querySelector("#cityWind");
var cityIndex = document.querySelector("#cityIndex");
//targets elements of webpage

var cityObject = {
    "Name" : "",
    "Temperature" : 0,
    "Humidity": 0,
    "Windspeed": 0, 
    "UV Index": 0,
};

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
        cityObject.Temperature = data.main.temp - 273.15; //converting to celsius
        cityObject.Humidity = data.main.humidity;
        cityObject.Windspeed = data.wind.speed * 2.237;
        console.log(cityObject);
        renderCityDetails(cityObject);
    }) 
}

function renderCityDetails (cityObject) {
    cityTitle.textContent = cityObject.Name;
    cityTemp.textContent  = "Temperature: " + cityObject.Temperature;
    cityHum.textContent = "Humidity: " + cityObject.Humidity;
    cityWind.textContent = "Windspeed: " + cityObject.Windspeed;
    cityIndex.textContent = 9; //need UV index as well
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

