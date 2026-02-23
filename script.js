const blocks = ["Block 25", "Block 26", "Block 27", "Block 33", "Block 34", "Block 36"];
let hour = 9;
let countdown = 10;
let bins = blocks.map((block, index) => ({
  id: index,
  block,
  fill: 0,
}));

function formatTime(hr) {
  const suffix = hr >= 12 ? "PM" : "AM";
  const hour12 = hr > 12 ? hr - 12 : hr;
  return `${hour12.toString().padStart(2, "0")}:00 ${suffix}`;
}

function updateTimeDisplay() {
  document.getElementById("currentTime").textContent = formatTime(hour);
}

function fillBins() {
  bins.forEach((bin) => {
    const increase = Math.floor(Math.random() * 21) + 10; // +10–30%
    bin.fill = Math.min(100, bin.fill + increase);
  });
}

function renderBins() {
  const container = document.getElementById("bins");
  container.innerHTML = "";
  bins.forEach((bin) => {
    const color =
      bin.fill >= 75 ? "bg-red-400" :
      bin.fill >= 40 ? "bg-lime-400" :
      "bg-teal-500";

    const status =
      bin.fill >= 75
        ? `<span class="text-red-600 font-semibold text-sm">⚠️ Needs Pickup</span>`
        : `<span class="text-teal-700 font-semibold text-sm">✅ OK</span>`;

    const binHTML = `
      <div id="bin-${bin.id}" class="bg-white rounded-xl shadow-md p-5 relative">
        <h3 class="text-xl font-semibold mb-2">🗑️ ${bin.block}</h3>
        <div class="w-full bg-slate-200 rounded-full h-5 mb-2">
          <div class="${color} h-5 rounded-full transition-all duration-500" style="width: ${bin.fill}%"></div>
        </div>
        <p class="text-sm text-slate-600 mb-1">Fill Level: ${bin.fill}%</p>
        <p class="mb-2">${status}</p>
        <button onclick="emptyBin(${bin.id})" class="px-3 py-1 bg-cyan-600 text-white rounded hover:bg-cyan-700">
          Empty Bin
        </button>
      </div>
    `;
    container.innerHTML += binHTML;
  });
  showAlerts();
}

function simulateHour() {
  if (hour >= 17) {
    showDayEndAlert();
    clearInterval(hourTimer);
    clearInterval(clockTimer);
    return;
  }

  hour++;
  updateTimeDisplay();
  fillBins();
  renderBins();
  countdown = 10;
}

function nextHour() {
  simulateHour();
}

function emptyBin(id) {
  const bin = bins.find(b => b.id === id);
  if (bin) {
    bin.fill = 0;
    renderBins();
  }
}

function showAlerts() {
  const alertDiv = document.getElementById("alertBanner");
  const fullBins = bins.filter(b => b.fill >= 75);

  if (fullBins.length > 0) {
    alertDiv.classList.remove("hidden");
    alertDiv.innerHTML = `🚨 The following bins are almost full: <strong>${fullBins.map(b => b.block).join(", ")}</strong>. Please empty them.`;
  } else {
    alertDiv.classList.add("hidden");
  }
}

function showDayEndAlert() {
  const alertDiv = document.getElementById("alertBanner");
  alertDiv.classList.remove("hidden");
  alertDiv.innerHTML = `📣 <strong>The day has ended (5 PM).</strong> Please empty all bins to start a new day. <br>
    <button onclick="startNewDay()" class="mt-2 px-3 py-1 bg-lime-600 text-white rounded hover:bg-lime-700">Start New Day</button>`;
}

function startNewDay() {
  hour = 9;
  bins = bins.map(b => ({ ...b, fill: 0 }));
  updateTimeDisplay();
  renderBins();
  document.getElementById("alertBanner").classList.add("hidden");
  countdown = 10;
  hourTimer = setInterval(simulateHour, 10000);
  clockTimer = setInterval(updateCountdown, 1000);
}

function updateCountdown() {
  if (countdown > 0) {
    countdown--;
    document.getElementById("countdown").textContent = countdown;
  } else {
    countdown = 10;
  }
}

// Start timers
let hourTimer = setInterval(simulateHour, 10000);
let clockTimer = setInterval(updateCountdown, 1000);

// Initial render
updateTimeDisplay();
renderBins();