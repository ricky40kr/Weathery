let lon;
let lat;

const getLocation = () => {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          lon = position.coords.longitude;
          lat = position.coords.latitude;
          resolve({ lon, lat });
        },
        (error) => reject(error)
      );
    } else {
      reject(new Error("Geolocation is not supported by this browser."));
    }
  });
};

async function getWeatherData() {
  try {
    const { lon, lat } = await getLocation();
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0112f537bc34ab323d68fb4b078b9497&units=metric`
    );
    const data = await response.json();
    setData(data);
    localStorage.setItem("weatherData", JSON.stringify(data)); // Cache the data
  } catch (error) {
    console.error("Error fetching weather data:", error);
  }
}

function setData(data) {
  console.log(data);
  const titleContainer = document.getElementById("titleLoc");
  titleContainer.innerHTML = data.name;

  const tempContainer = document.getElementById("temp");
  tempContainer.innerHTML = `${data.main.temp} °C`;

  const humidity = document.getElementById("humidity");
  humidity.innerHTML = `Humidity: ${data.main.humidity} %`;

  const wind = document.getElementById("wind");
  wind.innerHTML = `Wind: ${data.wind.speed} km/h`;

  const imgContainer = document.getElementById("weatherImg");
  imgContainer.setAttribute(
    "src",
    `http://openweathermap.org/img/w/${data.weather[0].icon}.png`
  );
}

function loadCachedData() {
  const cachedData = localStorage.getItem("weatherData");
  if (cachedData) {
    setData(JSON.parse(cachedData));
  }
}

document.addEventListener("DOMContentLoaded", () => {
  loadCachedData(); // Load cached data immediately
  getWeatherData(); // Fetch new data in the background
});
