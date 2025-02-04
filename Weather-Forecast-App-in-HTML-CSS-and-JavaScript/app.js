let moreBtn = document.querySelector(".more-btn");
let input = document.querySelector("input");
let key = "your-api-key-here";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&";

// Toggle more info section
moreBtn.addEventListener("click", () => {
  document.querySelector(".more").classList.toggle("active");
});

// Function to fetch weather based on city or coordinates
function getWeather(loc, lat = null, lon = null) {
  let url = lat && lon ? `${apiUrl}lat=${lat}&lon=${lon}&appid=${key}` : `${apiUrl}q=${loc}&appid=${key}`;

  fetch(url)
    .then((res) => {
      if (!res.ok) {
        document.querySelector(".data-wrapper").innerHTML = `<h2 class="error">Unable to fetch data</h2>`;
        throw new Error("Unable to fetch data");
      }
      return res.json();
    })
    .then((data) => {
      console.log(data);
      let type = data.weather[0].main;
      let icon = document.querySelector(".icon");

      switch (type) {
        case "Clouds":
          icon.className = "bx bx-cloud icon";
          break;
        case "Rain":
          icon.className = "bx bx-cloud-rain icon";
          break;
        case "Snow":
          icon.className = "bx bx-cloud-snow icon";
          break;
      }

      document.querySelector(".temp").textContent = Math.floor(data.main.temp) + "°C";
      document.querySelector(".city").textContent = data.name;
      document.querySelector(".min-temp").textContent = data.main.temp_min + "°C";
      document.querySelector(".max-temp").textContent = data.main.temp_max + "°C";
      document.querySelector(".humidity").textContent = data.main.humidity + "%";
      document.querySelector(".wind").textContent = data.wind.speed + "km/h";

      let pressure = data.main.pressure / 1013.25;
      document.querySelector(".pressure").textContent = (Math.floor(pressure * 100) / 100).toFixed(2) + "atm";
    })
    .catch((err) => console.log(err));
}

// Search by city name
document.querySelector(".btn").addEventListener("click", () => {
  let inputVal = input.value;
  if (inputVal) {
    getWeather(inputVal);
    input.value = "";
  }
});

// Function to get user's current location
function getLocation() {
  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        let lat = position.coords.latitude;
        let lon = position.coords.longitude;
        getWeather(null, lat, lon);
      },
      (error) => {
        console.log("Error getting location:", error);
        document.querySelector(".data-wrapper").innerHTML = `<h2 class="error">Location access denied. Please search manually.</h2>`;
      }
    );
  } else {
    alert("Geolocation is not supported by your browser.");
  }
}

// Automatically fetch weather for user's location on page load
getLocation();
