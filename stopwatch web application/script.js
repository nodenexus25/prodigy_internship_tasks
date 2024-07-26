// script.js

let startTime;
let updatedTime;
let difference;
let tInterval;
let running = false;
let laps = [];
let lapCounter = 1;

const hourHand = document.querySelector('.hour-hand');
const minuteHand = document.querySelector('.minute-hand');
const secondHand = document.querySelector('.second-hand');
const lapList = document.getElementById('lapList');
const digitalTimeDisplay = document.getElementById('digital-time');
const themeToggle = document.getElementById('theme-toggle');
const themeStylesheet = document.getElementById('theme-stylesheet');

document.getElementById('startBtn').addEventListener('click', startStopwatch);
document.getElementById('pauseBtn').addEventListener('click', pauseStopwatch);
document.getElementById('resetBtn').addEventListener('click', resetStopwatch);
themeToggle.addEventListener('click', toggleTheme);

function startStopwatch() {
    if (!running) {
        startTime = new Date().getTime();
        tInterval = setInterval(updateStopwatch, 10);
        running = true;
    }
}

function pauseStopwatch() {
    if (running) {
        clearInterval(tInterval);
        running = false;
        recordLap();
    }
}

function resetStopwatch() {
    clearInterval(tInterval);
    running = false;
    hourHand.style.transform = 'rotate(90deg)';
    minuteHand.style.transform = 'rotate(90deg)';
    secondHand.style.transform = 'rotate(90deg)';
    digitalTimeDisplay.textContent = '00:00:00';
    lapList.innerHTML = '';
    laps = [];
    lapCounter = 1;
}

function updateStopwatch() {
    updatedTime = new Date().getTime();
    difference = updatedTime - startTime;
    
    let seconds = Math.floor((difference % (1000 * 60)) / 1000);
    let minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    let hours = Math.floor(difference / (1000 * 60 * 60));
    
    let secondsDegrees = ((seconds / 60) * 360) + 90;
    let minutesDegrees = ((minutes / 60) * 360) + 90;
    let hoursDegrees = ((hours / 12) * 360) + 90;

    hourHand.style.transform = `rotate(${hoursDegrees}deg)`;
    minuteHand.style.transform = `rotate(${minutesDegrees}deg)`;
    secondHand.style.transform = `rotate(${secondsDegrees}deg)`;

    // Update digital clock display
    let formattedHours = String(hours).padStart(2, '0');
    let formattedMinutes = String(minutes).padStart(2, '0');
    let formattedSeconds = String(seconds).padStart(2, '0');
    digitalTimeDisplay.textContent = `${formattedHours}:${formattedMinutes}:${formattedSeconds}`;
}

function recordLap() {
    let lapTime = new Date().getTime() - startTime;
    let lapSeconds = Math.floor((lapTime % (1000 * 60)) / 1000);
    let lapMinutes = Math.floor((lapTime % (1000 * 60 * 60)) / (1000 * 60));
    let lapHours = Math.floor(lapTime / (1000 * 60 * 60));

    let formattedLapHours = String(lapHours).padStart(2, '0');
    let formattedLapMinutes = String(lapMinutes).padStart(2, '0');
    let formattedLapSeconds = String(lapSeconds).padStart(2, '0');

    let lapItem = document.createElement('li');
    lapItem.innerHTML = `Lap ${lapCounter}: ${formattedLapHours}:${formattedLapMinutes}:${formattedLapSeconds}
        <button onclick="deleteLap(this)">Delete</button>`;
    lapList.appendChild(lapItem);
    laps.push(lapItem);
    lapCounter++;
}

function deleteLap(button) {
    const lapItem = button.parentElement;
    lapList.removeChild(lapItem);
    laps = laps.filter(item => item !== lapItem);
}

function toggleTheme() {
    const isDarkMode = themeStylesheet.getAttribute('href') === 'dark-theme.css';
    if (isDarkMode) {
        themeStylesheet.setAttribute('href', 'light-theme.css');
        themeToggle.textContent = 'Switch to Dark Mode';
    } else {
        themeStylesheet.setAttribute('href', 'dark-theme.css');
        themeToggle.textContent = 'Switch to Light Mode';
    }
}
