let loaded = false;
let lastLoad = 0;

const kOneHour = 60 * 60 * 1000;

const kApiKey = "5beb4099196092bb5013df66fee76de3";

const kTempUnit = "°C";

async function getCityCoords(city = "Paris") {
  let url = `http://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
    city
  )}&appid=${kApiKey}&units=metric`;
  try {
    let response = await fetch(url);
    let json = await response.json();
    return json;
  } catch (e) {
    console.error(`Failed to fetch city coords: ${e}`);
  }
  return null;
}

async function getForecast(coords) {
  let url = `http://api.openweathermap.org/data/2.5/onecall?lat=${encodeURIComponent(
    coords.lat
  )}&lon=${encodeURIComponent(coords.lon)}&appid=${kApiKey}&units=metric`;
  try {
    let response = await fetch(url);
    let json = await response.json();
    return json;
  } catch (e) {
    console.error(`Failed to fetch forecast: ${e}`);
  }
  return null;
}

async function loadOrUpdate() {
  console.log(
    `Weather loadOrUpdate loaded=${loaded} online=${navigator.onLine} visible=${document.visibilityState}`
  );
  // Make sure we are online and visible.
  if (!navigator.onLine || document.visibilityState === "hidden") {
    return;
  }

  let now = Date.now();
  if (now - lastLoad < kOneHour) {
    console.log(
      `Weather updated ${(now - lastLoad) / 1000}s ago, not updating.`
    );
    return;
  }

  console.log(`Weather about to update`);

  function temperature(raw) {
    return `${Math.round(raw)}${kTempUnit}`;
  }

  let container = document.getElementById("container");

  // Updating the data.
  let info = await getCityCoords("palo alto");
  if (info) {
    container.innerHTML = `
      <div class="current">
      <div class="city">${info.name}</div>
      <img class="icon" src="icons/${info.weather[0].icon}@2x.png"/>
      <div class="temp">${temperature(info.main.feels_like)}</div>
      <div class="desc">${info.weather[0].description}</div>
      </div>
      `;

    let forecast = await getForecast(info.coord);

    if (forecast) {
      // Remove the first entry which is the current day.
      forecast.daily.splice(0, 1);

      forecast.daily.forEach(day => {
        let node = document.createElement("div");
        node.classList.add("forecast");

        let date = new Date(day.dt * 1000);
        const dateFormat = new Intl.DateTimeFormat("default", {
          weekday: "long",
          timeZone: "UTC",
        });

        node.innerHTML = `
          <div class="date">${dateFormat.format(date)}</div>
          <img class="icon" src="icons/${day.weather[0].icon}.png"/>
          <div class="temps">
            <span>${temperature(day.temp.min)}</span>
            <span>${temperature(day.temp.max)}</span>
          </div>
        `;
        container.append(node);
      });
    }
  } else {
    container.innerHTML = "";
  }

  lastLoad = now;
}

document.addEventListener("DOMContentLoaded", () => {
  window.addEventListener("online", loadOrUpdate);
  document.addEventListener("visibilitychange", loadOrUpdate);

  // Refresh every hour.
  setInterval(loadOrUpdate, kOneHour);

  loadOrUpdate();
});
