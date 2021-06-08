// Author: Abhishek Sahu
//api key : e76922f5326219582ed640f1b11f0e26
//http://api.openweathermap.org/geo/1.0/direct?q=jaipur&limit=5&appid=e76922f5326219582ed640f1b11f0e26
// one API For 7 days forcasting
// https://api.openweathermap.org/data/2.5/onecall?lat=26.93088&lon=75.81036&exclude=minutely,hourly,current&appid=e76922f5326219582ed640f1b11f0e26

const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value p");
const descElement = document.querySelector(
  ".temperature-description #weatherDescription"
);
const humadityElement = document.querySelector(
  ".temperature-description #humidity"
);
const windElement = document.querySelector(
  ".temperature-description #windSpeed"
);
const dateElement = document.querySelector(".temperature-description #Date");
const TimeElement = document.querySelector(".temperature-description #Time");
const locationElement = document.querySelector(
  ".temperature-description #location"
);
const notificationElement = document.querySelector(".notification");

//API Data
const weather = {};
//unit
weather.temperature = {
  unit: "celsius",
};

const KELVIN = 273;
const kmph = 18 / 5;

//Api Key
const key = "e76922f5326219582ed640f1b11f0e26";

//GeoLocation
// CHECK IF BROWSER SUPPORTS GEOLOCATION
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setPosition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = "<p>Browser doesn't Support Geolocation</p>";
}

function setPosition(position) {
  let latitude = position.coords.latitude;
  let longitude = position.coords.longitude;

  getWeatherByLocation(latitude, longitude);
}
// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p> ${error.message} </p>`;
}

//weather from user input city
function WeatherByCity() {
  let city = document.getElementById("cityName").value;
  let api = `http://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${key}`;
  fetchweatherApi(api);
}

//Weather from location access Api
function getWeatherByLocation(latitude, longitude) {
  console.log("latitude : " + latitude + " longitude: " + longitude);
  let api = `http://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${key}`;
  fetchweatherApi(api);
}

//fetch API
function fetchweatherApi(api) {
  fetch(api)
    .then(function (response) {
      let data = response.json();

      return data;
    })
    .then(function (data) {
      console.table(data.list);
      weather.temperature.value = Math.floor(data.list[0].main.temp - KELVIN);
      weather.description = data.list[0].weather[0].description;
      weather.iconId = data.list[0].weather[0].icon;
      weather.city = data.city.name;
      weather.country = data.city.country;
      weather.humidity = data.list[0].main.humidity;
      weather.wind = parseInt(data.list[0].wind.speed * kmph);
      weather.date = data.list[0].dt_txt;
    })
    .then(function () {
      displayWeather();
    });
}

//display weather info in the App
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `<span>Temperature : </span>${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = `<span>Description : </span>${weather.description}`;
  locationElement.innerHTML = `${weather.city}, ${weather.country}`;
  windElement.innerHTML = `<span>Wind Speed : </span>${weather.wind} km/h`;
  humadityElement.innerHTML = `<span>Humidity : </span>${weather.humidity}<span>%</span>`;
  str = weather.date;
  dateElement.innerHTML = `<span>Date : </span>${str.substr(
    0,
    str.indexOf(" ")
  )}`;
  TimeElement.innerHTML = `<span>Time : </span>${str.substr(
    str.indexOf(" ") + 1
  )}`;
}
// C to F conversion
function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

//listners
var inputByEnter = document.getElementById("cityName").value;
inputByEnter.addEventListener("keyup", function (event) {
  if (event.keycode == 13) {
    event.preventDefault();
    document.getElementById("mybtn").onclick();
  }
});

// WHEN THE USER CLICKS ON THE TEMPERATURE ELEMENET
tempElement.addEventListener("click", function () {
  if (weather.temperature.value === undefined) return;

  if (weather.temperature.unit == "celsius") {
    let fahrenheit = celsiusToFahrenheit(weather.temperature.value);
    fahrenheit = Math.floor(fahrenheit);

    tempElement.innerHTML = `${fahrenheit}°<span>F</span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
    weather.temperature.unit = "celsius";
  }
});
