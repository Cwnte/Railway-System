<script>
    /* ─── Data ─── */
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
      errEl.classList.remove('show');
 
      const stations = railways[currentLine].stations;
      const fromIdx = stations.indexOf(from);
      const toIdx = stations.indexOf(to);
      const diff = Math.abs(toIdx - fromIdx);
 
      const fare = railways[currentLine].fare(diff);
      const disc = Math.ceil(fare * 0.8);
      const beep = fare;
 
      // Animate fare number
      animateCount('fareAmount', fare);
 
      document.getElementById('fromLabel').textContent = from;
      document.getElementById('toLabel').textContent = to;
      document.getElementById('stopsLabel').textContent = `${diff} stop${diff !== 1 ? 's' : ''}`;
      document.getElementById('metaStations').textContent = diff + (diff !== 1 ? ' stations' : ' station');
      document.getElementById('metaDisc').textContent = `₱${disc}`;
      document.getElementById('metaBeep').textContent = `₱${beep} (stored value)`;
 
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
  </script>
</body>
