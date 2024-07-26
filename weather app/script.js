const apiKey = '7c6a883feaec82d7f4d95c8050b2d49b'; // Replace with your actual weather API key

function fetchWeather() {
    const locationInput = document.getElementById('locationInput').value.trim();
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${locationInput}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            displayWeather(data);
            fetchAdditionalInfo(data.coord.lat, data.coord.lon);
        })
        .catch(error => {
            console.error('Error fetching weather data:', error);
            alert('Failed to fetch weather data. Please try again.');
        });
}

function fetchAdditionalInfo(lat, lon) {
    const forecastUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    fetch(forecastUrl)
        .then(response => response.json())
        .then(data => {
            displayForecast(data);
            displayWindPredictions(data);
            displayHumidityVisibility(data);
            displaySunriseSunset(data);
        })
        .catch(error => console.error('Error fetching additional info:', error));
}

function displayWeather(data) {
    const weatherInfo = document.querySelector('.weather-info');
    weatherInfo.innerHTML = `
        <h2>${data.name}, ${data.sys.country}</h2>
        <p><i class="fas fa-cloud"></i> Weather: ${data.weather[0].description}</p>
        <p><i class="fas fa-thermometer-half"></i> Temperature: ${data.main.temp} °C</p>
        <p><i class="fas fa-tint"></i> Humidity: ${data.main.humidity}%</p>
        <p><i class="fas fa-eye"></i> Visibility: ${data.visibility / 1000} km</p>
        <p><i class="fas fa-wind"></i> Wind Speed: ${data.wind.speed} m/s</p>
    `;
}

function displayForecast(data) {
    const forecast = document.getElementById('forecast');
    forecast.innerHTML = '<h3>5-Day Forecast</h3>';
    data.list.forEach(item => {
        if (item.dt_txt.includes('12:00:00')) {
            forecast.innerHTML += `<p>${new Date(item.dt * 1000).toDateString()}: ${item.main.temp} °C, ${item.weather[0].description}</p>`;
        }
    });
}

function displayWindPredictions(data) {
    const wind = document.getElementById('wind');
    wind.innerHTML = `<p>Wind Speed: ${data.list[0].wind.speed} m/s</p>`;
}

function displayHumidityVisibility(data) {
    const humidityVisibility = document.getElementById('humidity-visibility');
    humidityVisibility.innerHTML = `
        <p>Humidity: ${data.list[0].main.humidity}%</p>
        <p>Visibility: ${data.list[0].visibility / 1000} km</p>
    `;
}

function displaySunriseSunset(data) {
    const sunriseSunset = document.getElementById('sunrise-sunset');
    const sunrise = new Date(data.city.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.city.sunset * 1000).toLocaleTimeString();
    sunriseSunset.innerHTML = `<p><i class="fas fa-sun"></i> Sunrise: ${sunrise}</p><p><i class="fas fa-moon"></i> Sunset: ${sunset}</p>`;
}

function updateDateTime() {
    const now = new Date();
    document.getElementById('currentDate').textContent = now.toDateString();
    document.getElementById('currentTime').textContent = now.toLocaleTimeString();
}

setInterval(updateDateTime, 1000);
updateDateTime();

function initEarth() {
    const container = document.getElementById('earth-container');
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(container.clientWidth, container.clientHeight);
    container.appendChild(renderer.domElement);

    const geometry = new THREE.SphereGeometry(5, 64, 64);
    const texture = new THREE.TextureLoader().load('https://threejs.org/examples/textures/earth_atmos_2048.jpg');
    const material = new THREE.MeshBasicMaterial({ map: texture });
    const sphere = new THREE.Mesh(geometry, material);
    scene.add(sphere);

    camera.position.z = 10;

    const controls = new THREE.OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;
    controls.enableZoom = true;

    function animate() {
        requestAnimationFrame(animate);
        sphere.rotation.y += 0.01;
        controls.update();
        renderer.render(scene, camera);
    }

    animate();
}

window.onload = function() {
    initEarth();
};
