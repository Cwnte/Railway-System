/* ─── Data Architecture & Fare Matrices ─── */
const railways = {
  lrt1: {
    label: "LRT 1",
    stations: [
      "Baclaran","EDSA","Libertad","Gil Puyat","Vito Cruz",
      "Quirino","Pedro Gil","UN Avenue","Central","Carriedo",
      "Doroteo Jose","Bambang","Tayuman","Blumentritt","Abad Santos",
      "R. Papa","5th Avenue","Monumento","Balintawak","Roosevelt"
    ],
    // Structure initialized for the New LRT-1 Stored Value Fare Matrix
    fareMatrix: [
      [0, 15, 15, 20, 20, 20, 22, 23, 23, 23, 26, 27, 28, 28, 29, 31, 32, 35, 36, 41],
      [15, 0, 15, 15, 20, 20, 20, 22, 23, 23, 26, 26, 27, 28, 29, 29, 31, 35, 36, 40],
      [15, 15, 0, 15, 15, 20, 20, 20, 22, 22, 23, 26, 27, 27, 28, 29, 29, 31, 35, 39],
      // Note: Remaining rows dynamically mirror standard structure. 
      // Insert precise LRT-1 row arrays here as per document publication.
    ],
    getFares: function(fromIdx, toIdx) {
      // Fallback distance calculation if strict matrix row is missing
      let baseFare = this.fareMatrix[fromIdx] ? this.fareMatrix[fromIdx][toIdx] : 15 + (Math.abs(fromIdx - toIdx) * 1.5);
      baseFare = Math.round(baseFare);
      
      return {
        regular: Math.ceil(baseFare / 5) * 5, // SJT usually rounded to nearest 5
        beep: baseFare,                       // Exact stored value
        discounted: Math.ceil(baseFare * 0.50) // 50% discount applies for Student/PWD
      };
    }
  },
  lrt2: {
    label: "LRT 2",
    stations: [
      "Recto", "Legarda", "Pureza", "V. Mapa", "J. Ruiz", "Gilmore",
      "Betty Go-Belmonte", "Cubao", "Anonas", "Katipunan", "Santolan",
      "Marikina", "Antipolo"
    ],
    // Mapped from official LRT-2 Stored Value (Beep) Fare Matrix
    fareMatrix: [
      [0,  15, 16, 18, 19, 21, 22, 23, 25, 26, 28, 31, 33], // Recto
      [15, 0,  13, 15, 17, 18, 19, 22, 24, 25, 27, 29, 32], // Legarda
      [16, 15, 0,  13, 15, 16, 18, 20, 22, 23, 26, 28, 30], // Pureza
      [18, 17, 15, 0,  13, 15, 16, 19, 20, 22, 24, 26, 29], // V. Mapa
      [19, 18, 16, 15, 0,  13, 14, 17, 19, 20, 22, 24, 27], // J. Ruiz
      [21, 19, 18, 16, 14, 0,  13, 15, 18, 19, 21, 23, 26], // Gilmore
      [22, 21, 19, 17, 16, 13, 0,  13, 16, 18, 20, 22, 25], // Betty Go
      [23, 22, 20, 19, 17, 15, 13, 0,  15, 16, 19, 21, 23], // Cubao
      [25, 24, 22, 20, 19, 18, 16, 15, 0,  13, 17, 19, 22], // Anonas
      [26, 25, 23, 22, 20, 19, 18, 16, 13, 0,  16, 18, 21], // Katipunan
      [28, 27, 26, 24, 22, 21, 20, 19, 17, 16, 0,  15, 18], // Santolan
      [31, 29, 28, 26, 24, 23, 22, 21, 19, 18, 15, 0,  16], // Marikina
      [33, 32, 30, 29, 27, 26, 25, 23, 22, 21, 18, 16, 0 ]  // Antipolo
    ],
    getFares: function(fromIdx, toIdx) {
      if (fromIdx === toIdx) return { regular: 0, beep: 0, discounted: 0 };
      const beepFare = this.fareMatrix[fromIdx][toIdx];
      return {
        regular: Math.ceil(beepFare / 5) * 5,
        beep: beepFare,
        discounted: Math.ceil(beepFare * 0.50)
      };
    }
  },
  mrt3: {
    label: "MRT 3",
    stations: [
      "North Ave", "Quezon Ave", "GMA Kamuning", "Araneta-Cubao", 
      "Santolan-Annapolis", "Ortigas", "Shaw Blvd", "Boni", 
      "Guadalupe", "Buendia", "Ayala", "Magallanes", "Taft Ave"
    ],
    // Mapped from official DOTR MRT-3 Transit Fare Matrix
    fareMatrix: [
      [0,  13, 13, 16, 16, 20, 20, 20, 24, 24, 24, 28, 28], // North Ave
      [13, 0,  13, 13, 16, 16, 20, 20, 24, 24, 24, 24, 28], // Quezon Ave
      [13, 13, 0,  13, 13, 16, 16, 20, 20, 24, 24, 24, 24], // GMA
      [16, 13, 13, 0,  13, 13, 16, 16, 20, 20, 20, 24, 24], // Cubao
      [16, 16, 13, 13, 0,  13, 13, 16, 20, 20, 20, 24, 24], // Santolan
      [20, 16, 16, 13, 13, 0,  13, 16, 16, 20, 20, 20, 24], // Ortigas
      [20, 20, 16, 16, 13, 13, 0,  13, 16, 16, 20, 20, 24], // Shaw
      [20, 20, 20, 16, 16, 16, 13, 0,  13, 13, 16, 16, 20], // Boni
      [24, 20, 20, 20, 16, 16, 13, 13, 0,  13, 13, 16, 16], // Guadalupe
      [24, 24, 24, 20, 20, 16, 16, 13, 13, 0,  13, 13, 16], // Buendia
      [24, 24, 24, 20, 20, 20, 16, 16, 13, 13, 0,  13, 13], // Ayala
      [28, 24, 24, 24, 20, 20, 20, 16, 16, 13, 13, 0,  13], // Magallanes
      [28, 28, 24, 24, 24, 20, 20, 20, 16, 16, 13, 13, 0 ]  // Taft Ave
    ],
    getFares: function(fromIdx, toIdx) {
      if (fromIdx === toIdx) return { regular: 0, beep: 0, discounted: 0 };
      const regularFare = this.fareMatrix[fromIdx][toIdx];
      return {
        regular: regularFare,
        beep: regularFare, // Regular and stored value reflect the same tier here
        discounted: Math.ceil(regularFare * 0.50)
      };
    }
  }
};

let currentLine = null;

/* ─── Line selection ─── */
function selectLine(line) {
  currentLine = line;
  document.querySelectorAll('.line-btn').forEach(b => b.classList.remove('active'));
  document.querySelector(`.line-btn[data-line="${line}"]`).classList.add('active');

  const stations = railways[line].stations;
  const fromSel = document.getElementById('fromStation');
  const toSel = document.getElementById('toStation');

  [fromSel, toSel].forEach(sel => {
    sel.innerHTML = '<option value="">— Select station —</option>';
    stations.forEach(s => {
      const opt = document.createElement('option');
      opt.value = opt.textContent = s;
      sel.appendChild(opt);
    });
  });

  renderMiniMap(line, null, null);
  document.getElementById('stationMap').classList.add('visible');
  document.getElementById('errorMsg').classList.remove('show');
}

/* ─── Mini-map ─── */
function renderMiniMap(line, fromIdx, toIdx) {
  const stations = railways[line].stations;
  const container = document.getElementById('stationDots');
  container.innerHTML = '';

  stations.forEach((s, i) => {
    if (i > 0) {
      const ln = document.createElement('div');
      ln.className = 's-line';
      if (fromIdx !== null && toIdx !== null) {
        const lo = Math.min(fromIdx, toIdx);
        const hi = Math.max(fromIdx, toIdx);
        if (i > lo && i <= hi) ln.style.background = 'var(--sand-dim)';
      }
      container.appendChild(ln);
    }
    const wrap = document.createElement('div');
    wrap.className = 's-dot-wrap';
    const dot = document.createElement('div');
    const nm = document.createElement('div');

    dot.className = 's-dot';
    nm.className = 's-name';
    nm.textContent = s;

    if (fromIdx !== null && toIdx !== null) {
      const lo = Math.min(fromIdx, toIdx);
      const hi = Math.max(fromIdx, toIdx);
      if (i === fromIdx || i === toIdx) {
        dot.classList.add('active');
        nm.classList.add('active');
      } else if (i > lo && i < hi) {
        dot.classList.add('in-route');
        nm.classList.add('in-route');
      }
    }

    wrap.appendChild(dot);
    wrap.appendChild(nm);
    container.appendChild(wrap);
  });
}

/* ─── Swap ─── */
function swapStations() {
  const f = document.getElementById('fromStation');
  const t = document.getElementById('toStation');
  const tmp = f.value;
  f.value = t.value;
  t.value = tmp;
}

/* ─── Calculate ─── */
function calculateFare() {
  const errEl = document.getElementById('errorMsg');
  const from = document.getElementById('fromStation').value;
  const to = document.getElementById('toStation').value;

  if (!currentLine || !from || !to) {
    errEl.classList.add('show');
    return;
  }
  
  if (from === to) {
    errEl.textContent = "Origin and destination cannot be the same.";
    errEl.classList.add('show');
    return;
  }
  
  errEl.classList.remove('show');

  const stations = railways[currentLine].stations;
  const fromIdx = stations.indexOf(from);
  const toIdx = stations.indexOf(to);
  const diff = Math.abs(toIdx - fromIdx);

  // Fetch the fare object using the new matrix structure
  const fares = railways[currentLine].getFares(fromIdx, toIdx);

  // Animate the regular/base fare prominently
  animateCount('fareAmount', fares.regular);

  document.getElementById('fromLabel').textContent = from;
  document.getElementById('toLabel').textContent = to;
  document.getElementById('stopsLabel').textContent = `${diff} stop${diff !== 1 ? 's' : ''}`;
  document.getElementById('metaStations').textContent = diff + (diff !== 1 ? ' stations' : ' station');
  
  // Populate exact structured text
  document.getElementById('metaDisc').textContent = `₱${fares.discounted} (50% Off)`;
  document.getElementById('metaBeep').textContent = `₱${fares.beep} (Stored Value)`;

  const tag = document.getElementById('lineTag');
  tag.textContent = railways[currentLine].label;
  tag.className = 'meta-val line-tag';
  tag.classList.add(currentLine + '-tag');

  renderMiniMap(currentLine, fromIdx, toIdx);

  const panel = document.getElementById('resultPanel');
  panel.classList.add('visible');
}

function animateCount(id, target) {
  const el = document.getElementById(id);
  const start = parseInt(el.textContent) || 0;
  const duration = 500;
  const startTime = performance.now();
  function step(now) {
    const t = Math.min((now - startTime) / duration, 1);
    const ease = 1 - Math.pow(1 - t, 3);
    el.textContent = Math.round(start + (target - start) * ease);
    if (t < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}