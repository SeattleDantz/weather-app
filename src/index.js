function displayDateAndTime() {
  let day = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  let month = [
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

  let index = [];
  let now = new Date();
  let todaysDayIndex = now.getDay();
  let todaysDay = `${day[now.getDay()]}`;
  let todaysMonth = `${month[now.getMonth()]}`;
  let todaysYear = now.getFullYear();
  let todaysDate = now.getDate();
  let dateSentence = `${todaysDay} ${todaysMonth} ${todaysDate}`;
  let dayPlus = [];

  let h2TodaysDate = document.querySelector("#todays-date");
  h2TodaysDate.innerHTML = dateSentence;

  //This gets the next 5 days' names to put on smaller cards
  for (let i = 0; i < 5; i++) {
    index[i] = todaysDayIndex + i + 1;
    if (index[i] > 6) {
      index[i] = index[i] - 7;
    }
    dayPlus[i] = `${day[index[i]]}`;
    dayPlus[i] = dayPlus[i].substring(0, 3);
    let dayPlusElement = document.querySelector(`.dayplus${i + 1}`);
    dayPlusElement.innerHTML = `${dayPlus[i]}`;
  }
}

function displayFutureWeather(response) {
  for (let i = 1; i < 6; i++) {
    let temp = Math.round(response.data.daily[i].temp.day);
    let hiTemp = Math.round(response.data.daily[i].temp.max);
    let loTemp = Math.round(response.data.daily[i].temp.min);
    let weatherDescription = response.data.daily[i].weather[0].main;
    let weatherImage = determineWeatherImage(weatherDescription);

    let h5HiLoTemp = document.querySelector(`.dayplus${i}-temp`);
    let h5Description = document.querySelector(`.dayplus${i}-weather`);
    let imgWeather = document.querySelector(`#dayplus${i}-icon`);
    h5HiLoTemp.innerHTML = `${hiTemp}°${unitSymbol}/${loTemp}°${unitSymbol}`;
    h5Description.innerHTML = `${weatherDescription}`;
    imgWeather.src = `${weatherImage}`;
  }
}

function determineWeatherImage(weatherDescription) {
  weatherDescription = weatherDescription.toLowerCase();
  if (weatherDescription === "clouds") {
    return "images/cloudy.png";
  }
  if (weatherDescription === "rain" || weatherDescription === "drizzle") {
    return "images/rain.png";
  }
  if (weatherDescription === "clear") {
    return "images/sunny.png";
  }
  if (weatherDescription === "thunderstorm") {
    return "images/thunderstorm.png";
  }
  if (weatherDescription === "snow") {
    return "images/snowoption2.png";
  }
}

function displayTodayWeather(response) {
  let temp = Math.round(response.data.main.temp);
  let city = response.data.name;
  let hiTemp = Math.round(response.data.main.temp_max);
  let loTemp = Math.round(response.data.main.temp_min);
  let weatherDescription = response.data.weather[0].main;
  let windSpeed = response.data.wind.speed;
  let humidity = response.data.main.humidity;
  let h1SelectedCity = document.querySelector("#current-city");
  let h3CurrentTemp = document.querySelector("#current-temp");
  let h3HiLoTemp = document.querySelector("#hi-lo-temps");
  let h3Description = document.querySelector("#weather-description");
  let imgWeather = document.querySelector(".current-icon");
  let weatherImage = determineWeatherImage(weatherDescription);
  let h3WindSpeed = document.querySelector("#wind-speed");
  let h3TodaysHumidity = document.querySelector("#todays-humidity");

  currentCity = `${city}`;
  h1SelectedCity.innerHTML = `${city}`;
  h3CurrentTemp.innerHTML = `Currently ${temp}°${unitSymbol}`;
  h3HiLoTemp.innerHTML = `${hiTemp}°${unitSymbol}/${loTemp}°${unitSymbol}`;
  h3Description.innerHTML = `${weatherDescription}`;
  h3WindSpeed.innerHTML = `Wind speed: ${windSpeed} ${windUnit}`;
  h3TodaysHumidity.innerHTML = `Humidity: ${humidity} %`;
  imgWeather.src = `${weatherImage}`;
}

function getLatLong(response) {
  let lat = response.data.results[0].locations[0].displayLatLng.lat;
  let long = response.data.results[0].locations[0].displayLatLng.lng;
  let apiKeyOpenWeather = "551f8c89cdce818fb4f3b6e3fe374a5c";

  let apiEndpointDaily = "https://api.openweathermap.org/data/2.5/onecall?";

  axios
    .get(
      `${apiEndpointDaily}lat=${lat}&lon=${long}&appid=${apiKeyOpenWeather}&units=${units}&exclude=hourly,minutely`
    )
    .then(displayFutureWeather);
}

function getEnteredCityWeather(event) {
  if (event) {
    event.preventDefault();
  }
  let city = document.querySelector("#city-input");
  let apiKeyOpenWeather = "551f8c89cdce818fb4f3b6e3fe374a5c";
  let apiKeyMapQuest = "HZ0u4XCijeiKnhXQ2FtnMaL8Au0hYJxm";
  let enteredCity = `${city.value}`;
  let apiEndpointMapQuest =
    "https://open.mapquestapi.com/geocoding/v1/address?";
  let apiEndpointWeather = "https://api.openweathermap.org/data/2.5/weather?";
  let apiEndpointDaily = "https://api.openweathermap.org/data/2.5/onecall?";
  currentCity = `${city.value}`;
  if (city.value !== "") {
    city.value = "";
    axios
      .get(
        `${apiEndpointWeather}q=${enteredCity}&appid=${apiKeyOpenWeather}&units=${units}`
      )
      .then(displayTodayWeather);
    axios
      .get(
        `${apiEndpointMapQuest}location=${enteredCity}&key=${apiKeyMapQuest}`
      )
      .then(getLatLong);
  } else {
    alert("You need to enter a city!");
  }
}

function getCurrentLocWeather(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  let apiKey = "551f8c89cdce818fb4f3b6e3fe374a5c";
  //let units = "imperial";
  let apiEndpoint = "https://api.openweathermap.org/data/2.5/weather?";
  let apiEndpoint2 = "https://api.openweathermap.org/data/2.5/onecall?";
  axios
    .get(`${apiEndpoint}lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}`)
    .then(displayTodayWeather);

  axios
    .get(
      `${apiEndpoint2}lat=${lat}&lon=${long}&appid=${apiKey}&units=${units}&exclude=hourly,minutely`
    )
    .then(displayFutureWeather);
}

function getCurrentLocation(event) {
  navigator.geolocation.getCurrentPosition(getCurrentLocWeather);
}

function setTempToF() {
  units = "imperial";
  unitSymbol = "F";
  windUnit = "mi/hr";
  let city = document.querySelector("#city-input");
  let farenheit = document.querySelector("#f-units");
  let celsius = document.querySelector("#c-units");
  farenheit.className = "farenheit f-unit-picked";
  celsius.className = "celsius c-unit-unpicked";
  city.value = `${currentCity}`;
  getEnteredCityWeather();
}

function setTempToC() {
  units = "metric";
  unitSymbol = "C";
  windUnit = "m/sec";
  let city = document.querySelector("#city-input");
  let farenheit = document.querySelector("#f-units");
  let celsius = document.querySelector("#c-units");
  farenheit.className = "farenheit f-unit-unpicked";
  celsius.className = "celsius c-unit-picked";
  city.value = `${currentCity}`;
  getEnteredCityWeather();
}

let units = "imperial";
let unitSymbol = "F";
let windUnit = "mi/hr";

displayDateAndTime();
// default's to New York's weather when landing on page for 1st time
let city = document.querySelector("#city-input");
city.value = "New York";
let currentCity = city.value;
getEnteredCityWeather();

let enterCity = document.querySelector(".search");
enterCity.addEventListener("submit", getEnteredCityWeather);

let farenheitPicker = document.querySelector("#f-units");
farenheitPicker.addEventListener("click", setTempToF);

let celsiusPicker = document.querySelector("#c-units");
celsiusPicker.addEventListener("click", setTempToC);

let currentLocationButton = document.querySelector(".current-loc-button");
currentLocationButton.addEventListener("click", getCurrentLocation);

let searchIcon = document.querySelector("#spy-glass");
searchIcon.addEventListener("click", getEnteredCityWeather);
