const railways = {
  lrt1: [
    "Baclaran", "EDSA", "Libertad", "Gil Puyat", "Vito Cruz", "Quirino", "Pedro Gil", "UN Avenue",
    "Central", "Carriedo", "Doroteo Jose", "Bambang", "Tayuman", "Blumentritt", "Abad Santos",
    "R. Papa", "5th Avenue", "Monumento", "Balintawak", "Roosevelt"
  ],
  lrt2: [
    "Recto", "Legarda", "Pureza", "V. Mapa", "J. Ruiz", "Gilmore", "Betty-Go", "Araneta",
    "Anonas", "Katipunan", "Santolan"
  ],
  mrt3: [
    "North Ave", "Quezon Ave", "GMA Kamuning", "Araneta Center Cubao", "Santolan Annapolis", "Ortigas",
    "Shaw Blvd", "Boni", "Guadalupe", "Buendia", "Ayala", "Magallanes", "Taft Ave"
  ]
};

const railwaySelect = document.getElementById("railway");
const fromSelect = document.getElementById("fromStation");
const toSelect = document.getElementById("toStation");

railwaySelect.addEventListener("change", () => {
  const selectedLine = railwaySelect.value;
  const stations = railways[selectedLine] || [];

  fromSelect.innerHTML = `<option value="">--Select Station--</option>`;
  toSelect.innerHTML = `<option value="">--Select Station--</option>`;

  stations.forEach(station => {
    const option1 = document.createElement("option");
    const option2 = document.createElement("option");
    option1.value = option1.text = station;
    option2.value = option2.text = station;
    fromSelect.appendChild(option1);
    toSelect.appendChild(option2);
  });
});

function calculateFare() {
  const line = railwaySelect.value;
  const from = fromSelect.value;
  const to = toSelect.value;
  const resultDiv = document.getElementById("result");

  if (!line || !from || !to) {
    resultDiv.innerHTML = `<p class="error">⚠️ Please select railway and both stations.</p>`;
    return;
  }

  const stations = railways[line];
  const fromIndex = stations.indexOf(from);
  const toIndex = stations.indexOf(to);
  const stationDiff = Math.abs(toIndex - fromIndex);

  let fare = 0;

  if (line === "lrt1") {
    // ₱13 base fare + ₱1 per station after 3rd
    fare = 16 + Math.max(0, stationDiff - 3);
  } else if (line === "lrt2") {
    // ₱12 + ₱1 per station
    fare = 14 + stationDiff;
  } else if (line === "mrt3") {
    // ₱13 + ₱1 per 2 stations (rounded up)
    fare = 13 + Math.ceil(stationDiff / 2);
  }

  resultDiv.innerHTML = `
    <h2>Trip Details</h2>
    <p><strong>Railway Line:</strong> ${line.toUpperCase()}</p>
    <p><strong>From:</strong> ${from}</p>
    <p><strong>To:</strong> ${to}</p>
    <p><strong>Stations Traveled:</strong> ${stationDiff}</p>
    <p><strong>Estimated Fare:</strong> P${fare}</p>
  `;
}
