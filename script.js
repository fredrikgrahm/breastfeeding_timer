const timerDisplay = document.getElementById("timer");
const startButton = document.getElementById("start");
const stopButton = document.getElementById("stop");
const leftButton = document.getElementById("left");
const bothButton = document.getElementById("both");
const rightButton = document.getElementById("right");
const lastSideDisplay = document.getElementById("lastSide");
const setReminderButton = document.getElementById("setReminder");
const reminderInput = document.getElementById("reminder");
const notificationText = document.getElementById("notificationText");
const historySection = document.querySelector('.history');
const showHistoryButton = document.getElementById('showHistory');
const overlay = document.getElementById('overlay');
const popup = document.getElementById('popup');
const popupMessage = document.getElementById('popup-message');
const closePopupButton = document.getElementById('close-popup');

let timerInterval;
let lastSide = "Not recorded";
let startTime;

startButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  startTime = new Date().getTime();
  timerInterval = setInterval(updateTimer, 1000);
  startButton.disabled = true;
  stopButton.disabled = false;
});

// Inside the 'stopButton' click event handler
stopButton.addEventListener("click", () => {
  clearInterval(timerInterval);
  startButton.disabled = false;
  stopButton.disabled = true;

  const endTime = new Date().getTime();
  const duration = calculateDuration(startTime, endTime); // Calculate duration
  recordSession(startTime, endTime, lastSide, duration); // Pass duration to recordSession
  updateLastSide();

  // Update the 'localStorage' history as well
  updateHistory(startTime, endTime, lastSide, duration);
});

leftButton.addEventListener("click", () => {
  lastSide = "Left";
  lastSideDisplay.innerText = "Left";
  localStorage.setItem("lastSide", lastSide); // Save to localStorage
});
bothButton.addEventListener("click", () => {
  lastSide = "Both";
  lastSideDisplay.innerText = "Both";
  localStorage.setItem("lastSide", lastSide); // Save to localStorage
});

rightButton.addEventListener("click", () => {
  lastSide = "Right";
  lastSideDisplay.innerText = "Right";
  localStorage.setItem("lastSide", lastSide); // Save to localStorage
});

setReminderButton.addEventListener("click", () => {
  const reminderTime = reminderInput.value;
  if (reminderTime) {
    setReminder(reminderTime);
  }
});

function updateTimer() {
  const currentTime = new Date().getTime();
  const elapsedTime = currentTime - startTime;
  const minutes = Math.floor(elapsedTime / 60000);
  const seconds = Math.floor((elapsedTime % 60000) / 1000);
  const formattedTime = `${minutes.toString().padStart(2, "0")}:${seconds
    .toString()
    .padStart(2, "0")}`;
  timerDisplay.innerText = formattedTime;
}

function updateLastSide() {
  lastSideDisplay.innerText = lastSide;
  startTime = new Date().getTime(); // Reset the timer when switching sides

  // Save the updated lastSide to localStorage
  localStorage.setItem("lastSide", lastSide);
}

function setReminder(reminderTime) {
  const now = new Date();
  const [hours, minutes] = reminderTime.split(":");
  const reminder = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    hours,
    minutes
  );

  const timeUntilReminder = reminder - now;
  localStorage.setItem("reminderTime", reminderTime);

  if (timeUntilReminder <= 0) {
    notificationText.innerText = "Reminder time has already passed!";
    return;
  }

  setTimeout(() => {
    notificationText.innerText = "It's time for the next feeding session!";
    showPopup("It's feeding time!");
  }, timeUntilReminder);
}

// Check if last side and reminder time are saved in localStorage
const savedLastSide = localStorage.getItem("lastSide");
const savedReminderTime = localStorage.getItem("reminderTime");

// Initialize the app with saved data (if available)
if (savedLastSide) {
  lastSide = savedLastSide;
  lastSideDisplay.innerText = savedLastSide;
}

if (savedReminderTime) {
  reminderInput.value = savedReminderTime;
}

const historyList = document.getElementById("historyList");

// Function to record a feeding session in the history
function recordSession(startTime, endTime, side) {
  const sessionDuration = calculateDuration(startTime, endTime);
  const sessionTimestamp = new Date(startTime).toLocaleString();

  const listItem = document.createElement("li");
  listItem.innerHTML = `<strong>${sessionTimestamp}:</strong> Side: ${side}, Duration: ${sessionDuration}`;
  historyList.appendChild(listItem);
}

// Function to calculate session duration in minutes and seconds
function calculateDuration(startTime, endTime) {
  const durationInMilliseconds = endTime - startTime;
  const minutes = Math.floor(durationInMilliseconds / 60000);
  const seconds = Math.floor((durationInMilliseconds % 60000) / 1000);
  return `${minutes} min ${seconds} sec`;
}

// Function to update the 'localStorage' history
function updateHistory(startTime, endTime, side) {
  const history = JSON.parse(localStorage.getItem("feedingHistory")) || [];

  const sessionDuration = calculateDuration(startTime, endTime);
  const sessionTimestamp = new Date(startTime).toLocaleString();

  history.push({
    timestamp: sessionTimestamp,
    side,
    duration: sessionDuration,
  });

  localStorage.setItem("feedingHistory", JSON.stringify(history));
}

// Load and display the history on page load
function loadAndDisplayHistory() {
  const history = JSON.parse(localStorage.getItem("feedingHistory")) || [];

  history.forEach((session) => {
    const listItem = document.createElement("li");
    listItem.innerHTML = `<strong>${session.timestamp}:</strong> Side: ${session.side}, Duration: ${session.duration}`;
    historyList.appendChild(listItem);
  });
}

showHistoryButton.addEventListener('click', () => {
    if (historySection.style.display === 'none') {
        historySection.style.display = 'block';
        showHistoryButton.innerText = 'Hide Feeding History';
    } else {
        historySection.style.display = 'none';
        showHistoryButton.innerText = 'Show Feeding History';
    }
})

// Function to show the popup with a message
function showPopup(message) {
    popupMessage.textContent = message;
    overlay.style.display = 'block'; // Show the overlay
    popup.style.display = 'block'; // Show the popup
}
closePopupButton.addEventListener('click', () => {
    closePopup();
});
// Function to close the popup
function closePopup() {
    overlay.style.display = 'none'; // Hide the overlay
    popup.style.display = 'none'; // Hide the popup
}


// Call this function to load and display history when the page loads
loadAndDisplayHistory();
