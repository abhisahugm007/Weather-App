// Author: Abhishek Sahu
//api key : e76922f5326219582ed640f1b11f0e26
//http://api.openweathermap.org/geo/1.0/direct?q=jaipur&limit=5&appid=e76922f5326219582ed640f1b11f0e26
// one API For 7 days forcasting
// https://api.openweathermap.org/data/2.5/onecall?lat=26.93088&lon=75.81036&exclude=minutely,hourly,current&appid=e76922f5326219582ed640f1b11f0e26

const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temperature-value #temp");
const descElement = document.querySelector("#weatherDescription");
const humadityElement = document.querySelector("#humidity");
const windElement = document.querySelector("#windSpeed");
const dateElement = document.querySelector("#Date");
const TimeElement = document.querySelector("#Time");
const locationElement = document.querySelector("#location");
const notificationElement = document.querySelector(".notification");

//API Data
const weather = {};
//unit
weather.temperature = {
  unit: "celsius",
};
console.log(typeof weather);

let forcast = [];

const KELVIN = 273;
const kmph = 18 / 5;

//Api Key
const key = "e76922f5326219582ed640f1b11f0e26";
var days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
var months = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];
//convert Unix date&Time to Human read Date & time
function dateConverter(UNIX_timestamp, dayName) {
  var a = new Date(UNIX_timestamp * 1000);

  var year = a.getFullYear();
  var month = months[a.getMonth()];
  var date = a.getDate();
  var min = a.getMinutes();

  var hours = (a.getHours() + 24) % 24;
  var mid = "AM";
  if (hours == 0) {
    //At 00 hours we need to show 12 am
    hours = 12;
  } else if (hours > 12) {
    hours = hours % 12;
    mid = "PM";
  }

  if (dayName) {
    var time = days[a.getDay()] + ", " + date + " " + month;
    return time;
  }

  var time =
    date + " " + month + " " + year + "-" + hours + ":" + min + " " + mid;
  return time;
}
console.log(dateConverter(1623110740));

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
  getcityName(latitude, longitude);
}
function getcityName(lat, lon) {
  let city;
  fetch(
    `https://us1.locationiq.com/v1/reverse.php?key=pk.87f2d9fcb4fdd8da1d647b46a997c727&lat=${lat}&lon=${lon}&format=json`
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      weather.city =
        data.address.city != null ? data.address.city : data.address.state;
      weather.country = data.address.country_code.toUpperCase();
    })
    .then(() => {
      console.log(city);
      getWeatherByLocation(lat, lon);
    });
}
// SHOW ERROR WHEN THERE IS AN ISSUE WITH GEOLOCATION SERVICE
function showError(error) {
  notificationElement.style.display = "block";
  weather.city = "New Delhi";
  weather.country = "IN";
  getWeatherByLocation(28.7041, 77.1025);
}

//weather from user input city
function WeatherByCity() {
  let city = document.getElementById("cityName").value;
  let api = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${key}`;
  let geocode = {};
  fetch(api)
    .then(function (response) {
      let data = response.json();

      return data;
    })
    .then(function (data) {
      geocode.latitude = data[0].lat;
      geocode.longitude = data[0].lon;
      weather.city = data[0].name;
      weather.country = data[0].country;
    })
    .then(function () {
      getWeatherByLocation(geocode.latitude, geocode.longitude);
    });
}

//Weather from location access Api
function getWeatherByLocation(latitude, longitude) {
  console.log("latitude : " + latitude + " longitude: " + longitude);
  let api = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=minutely,hourly&appid=${key}`;

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
      // console.table(data.current);
      weather.temperature.value = Math.floor(data.current.temp - KELVIN);

      weather.description = data.current.weather[0].description;
      weather.iconId = data.current.weather[0].icon;
      weather.humidity = data.current.humidity;
      weather.wind = parseInt(data.current.wind_speed * kmph);

      dateTime = dateConverter(data.current.dt);
      weather.date = dateTime.substr(0, dateTime.indexOf("-"));
      weather.Time = dateTime.substr(dateTime.indexOf("-") + 1);

      weather.Type = data.current.weather[0].main;

      //set forcast Data

      for (var i = 1; i <= 7; i++) {
        let dayName = dateConverter(data.daily[i].dt, 1);
        forcast[i] = {
          tempMax: Math.floor(data.daily[i].temp.max - KELVIN),
          tempMin: Math.floor(data.daily[i].temp.min - KELVIN),
          weatherIcon: data.daily[i].weather[0].icon,
          dayName: dayName,
        };
      }
    })
    .then(function () {
      displayWeather();
    });
}
//display weather info in the App
function displayWeather() {
  iconElement.innerHTML = `<img src="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `${weather.temperature.value}°<span>C</span>`;
  descElement.innerHTML = `<span>Description : </span>${weather.description}`;
  locationElement.innerHTML = `${weather.city},${weather.country}`;
  windElement.innerHTML = `<span>Wind : </span>${weather.wind} km/h`;
  humadityElement.innerHTML = `<span>Humidity : </span>${weather.humidity}<span>%</span>`;
  dateElement.innerHTML = `${weather.date}`;
  TimeElement.innerHTML = `<span>Time : </span>${weather.Time}`;

  // background image

  if (weather.Type) {
    if (weather.iconId == "50d" || weather.iconId == "50n") {
      document.body.style.backgroundImage = "url('icons/Mist.jpg')";
    } else {
      var image = `icons/${weather.Type}.jpg`;
      document.body.style.backgroundImage = `url(${image})`;
    }
  } else {
    document.body.style.backgroundImage =
      "url('https://www.freecodecamp.org/news/content/images/size/w2000/2021/06/w-qjCHPZbeXCQ-unsplash.jpg')";
  }

  //forcast

  for (var i = 1; i <= 7; i++) {
    document.querySelector(
      `.day${i} #imag`
    ).innerHTML = `<img src="icons/${forcast[i].weatherIcon}.png"  width="70" height="70" />`;
    document.querySelector(
      `.day${i} #temp `
    ).innerHTML = `${forcast[i].tempMax}°<span>C / </span>${forcast[i].tempMin}°<span>C</span>`;
    document.querySelector(
      `.day${i} #dayName`
    ).innerHTML = `${forcast[i].dayName}`;
  }
}
// C to F conversion
function celsiusToFahrenheit(temperature) {
  return (temperature * 9) / 5 + 32;
}

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
// console.log(weather);
