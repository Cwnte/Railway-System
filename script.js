const railways = {
  lrt1: {
    label: "LRT 1",
    stations: [
      "Baclaran","EDSA","Libertad","Gil Puyat","Vito Cruz",
      "Quirino","Pedro Gil","UN Avenue","Central","Carriedo",
      "Doroteo Jose","Bambang","Tayuman","Blumentritt","Abad Santos",
      "R. Papa","5th Avenue","Monumento","Balintawak","Roosevelt"
    ],
    fare: (diff) => {
      if (diff === 0) return 0;
      if (diff <= 4) return 15;
      if (diff <= 7) return 20;
      if (diff <= 11) return 25;
      if (diff <= 14) return 28;
      return 30;
    }
  },

  lrt2: {
    label: "LRT 2",
    stations: [
      "Antipolo","Marikina-Pasig","Santolan","Katipunan","Anonas",
      "Cubao (Araneta)","Betty-Go Belmonte","Gilmore","J. Ruiz","V. Mapa",
      "Pureza","Legarda","Recto"
    ],
    fare: (diff) => {
      if (diff === 0) return 0;
      if (diff <= 2) return 15;
      if (diff <= 4) return 20;
      if (diff <= 6) return 25;
      if (diff <= 8) return 28;
      return 30;
    }
  },

  mrt3: {
    label: "MRT 3",
    stations: [
      "North Avenue","Quezon Avenue","GMA-Kamuning","Araneta Center-Cubao",
      "Santolan-Annapolis","Ortigas","Shaw Boulevard","Boni",
      "Guadalupe","Buendia","Ayala","Magallanes","Taft Avenue"
    ],
    fare: (diff) => {
      if (diff === 0) return 0;
      if (diff <= 2) return 13;
      if (diff <= 4) return 16;
      if (diff <= 6) return 20;
      if (diff <= 8) return 23;
      if (diff <= 10) return 26;
      return 28;
    }
  }
};

let currentLine = null;
let animationFrame = null;

const fromStation = document.getElementById("fromStation");
const toStation = document.getElementById("toStation");

document.querySelectorAll(".line-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    selectLine(btn.dataset.line);
  });
});

document.getElementById("swapBtn")
  .addEventListener("click", swapStations);

document.getElementById("calculateBtn")
  .addEventListener("click", calculateFare);

fromStation.addEventListener("change", updateMiniMap);
toStation.addEventListener("change", updateMiniMap);

function selectLine(line) {

  currentLine = line;

  document.querySelectorAll(".line-btn")
    .forEach(btn => btn.classList.remove("active"));

  document.querySelector(`.line-btn[data-line="${line}"]`)
    .classList.add("active");

  const stations = railways[line].stations;

  [fromStation, toStation].forEach(select => {

    select.innerHTML =
      '<option value="">— Select station —</option>';

    stations.forEach(station => {

      const option = document.createElement("option");

      option.value = station;
      option.textContent = station;

      select.appendChild(option);
    });
  });

  document.getElementById("stationMap")
    .classList.add("visible");

  document.getElementById("errorMsg")
    .classList.remove("show");

  renderMiniMap(line, null, null);
}

function renderMiniMap(line, fromIdx, toIdx) {

  const stations = railways[line].stations;

  const container =
    document.getElementById("stationDots");

  container.innerHTML = "";

  stations.forEach((station, index) => {

    if (index > 0) {

      const lineDiv = document.createElement("div");
      lineDiv.className = "s-line";

      container.appendChild(lineDiv);
    }

    const wrap = document.createElement("div");
    wrap.className = "s-dot-wrap";

    const dot = document.createElement("div");
    dot.className = "s-dot";

    const name = document.createElement("div");
    name.className = "s-name";
    name.textContent = station;

    if (fromIdx !== null && toIdx !== null) {

      const low = Math.min(fromIdx, toIdx);
      const high = Math.max(fromIdx, toIdx);

      if (index === fromIdx || index === toIdx) {

        dot.classList.add("active");
        name.classList.add("active");

      } else if (index > low && index < high) {

        dot.classList.add("in-route");
        name.classList.add("in-route");
      }
    }

    wrap.appendChild(dot);
    wrap.appendChild(name);

    container.appendChild(wrap);
  });
}

function updateMiniMap() {

  if (!currentLine) return;

  const stations = railways[currentLine].stations;

  const fromIdx = stations.indexOf(fromStation.value);
  const toIdx = stations.indexOf(toStation.value);

  renderMiniMap(currentLine, fromIdx, toIdx);
}

function swapStations() {

  const temp = fromStation.value;

  fromStation.value = toStation.value;
  toStation.value = temp;

  updateMiniMap();
}

function calculateFare() {

  const errorMsg = document.getElementById("errorMsg");

  const from = fromStation.value;
  const to = toStation.value;

  if (!currentLine || !from || !to) {

    showError(
      "Please select a railway line and both stations."
    );

    return;
  }

  if (from === to) {

    showError(
      "Origin and destination stations cannot be the same."
    );

    return;
  }

  errorMsg.classList.remove("show");

  const stations = railways[currentLine].stations;

  const fromIdx = stations.indexOf(from);
  const toIdx = stations.indexOf(to);

  const diff = Math.abs(toIdx - fromIdx);

  const fare = railways[currentLine].fare(diff);

  const discounted = Math.ceil(fare * 0.8);

  animateCount("fareAmount", fare);

  document.getElementById("fromLabel").textContent = from;
  document.getElementById("toLabel").textContent = to;

  document.getElementById("stopsLabel").textContent =
    `${diff} stop${diff !== 1 ? "s" : ""}`;

  document.getElementById("metaStations").textContent =
    `${diff} station${diff !== 1 ? "s" : ""}`;

  document.getElementById("metaDisc").textContent =
    `₱${discounted}`;

  document.getElementById("metaBeep").textContent =
    `₱${fare} (stored value)`;

  const lineTag = document.getElementById("lineTag");

  lineTag.textContent = railways[currentLine].label;

  lineTag.className = "meta-val line-tag";
  lineTag.classList.add(`${currentLine}-tag`);

  renderMiniMap(currentLine, fromIdx, toIdx);

  document.getElementById("resultPanel")
    .classList.add("visible");
}

function animateCount(id, target) {

  if (animationFrame) {
    cancelAnimationFrame(animationFrame);
  }

  const element = document.getElementById(id);

  const start =
    parseInt(element.textContent) || 0;

  const duration = 500;

  const startTime = performance.now();

  function step(currentTime) {

    const progress =
      Math.min((currentTime - startTime) / duration, 1);

    const eased =
      1 - Math.pow(1 - progress, 3);

    element.textContent =
      Math.round(start + (target - start) * eased);

    if (progress < 1) {
      animationFrame = requestAnimationFrame(step);
    }
  }

  animationFrame = requestAnimationFrame(step);
}

function showError(message) {

  const errorMsg = document.getElementById("errorMsg");

  errorMsg.textContent = message;

  errorMsg.classList.add("show");
}
