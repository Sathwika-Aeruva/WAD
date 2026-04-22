const apiKey = "95d58094fe3fbc45d0c2d6bb5c7c52e0";
let chart;
 //Using callback
function fetchWeatherCallback(city, callback) {
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    fetch(url)
        .then(response => response.json())
        .then(data => callback(data))
        .catch(err => console.log("Error:", err));
}
//Using promise
function fetchWeatherPromise(city) {
    return new Promise((resolve, reject) => {
        const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    reject("City not found");
                }
                return response.json();
            })
            .then(data => resolve(data))
            .catch(err => reject(err));
    });
}
//Using async/await
async function fetchWeatherAsync(city) {
    try {
        const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

        const response = await fetch(url);

        if (!response.ok) {
            throw new Error("City not found");
        }

        const data = await response.json();
        return data;

    } catch (error) {
        console.error(error);
        return null;
    }
}

async function getWeather() {
    const city = document.getElementById("cityInput").value;

    if (!city) {
        alert("Please enter a city");
        return;
    }
    try {
        // Using async/await
        const data = await fetchWeatherAsync(city);

        if (data.cod !== "200") {
            throw new Error("City not found");
        }

        displayWeather(data);
        drawChart(data);

    } catch (err) {
        document.getElementById("Result").innerHTML = "❌ Error fetching data";
    }
}

// DISPLAY FUNCTION
function displayWeather(data) {

    const city = data.city.name;
    const temp = data.list[0].main.temp;
    const desc = data.list[0].weather[0].description;
    const humidity = data.list[0].main.humidity;
    const wind = data.list[0].wind.speed;
    const icon = data.list[0].weather[0].icon;

    document.getElementById("weatherCard").innerHTML = `
        <h2>${city}</h2>
        <p>Temperature: ${temp}°C</p>
        <p>Condition : ${desc}</p>
        <p>Humidity: ${humidity}%</p>
        <p>Wind Speed: ${wind} m/s</p>
    `;

}

// GRAPH FUNCTION
function drawChart(data) {

    const temps = data.list.slice(0, 8).map(item => item.main.temp);
    const labels = data.list.slice(0, 8).map(item => item.dt_txt.split(" ")[1]);

    const ctx = document.getElementById("weatherChart").getContext("2d");

    if (chart) {
        chart.destroy();
    }

    chart = new Chart(ctx, {
        type: "line",
        data: {
            labels: labels,
            datasets: [{
                label: "Temperature (°C)",
                data: temps,
                borderWidth: 2,
                fill: false
            }]
        }
    });
}
