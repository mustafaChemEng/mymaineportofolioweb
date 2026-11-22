// Browser replica of the AVEVA tank model used in the Python digital twin.
// Same PI tuning (Kc 16.58, tauI 264 s, dt 2 s, P on measurement), same 5 s valve lag.
// Plant: rho*A*H = 1559 kg, inflow 0.976 kg/s (1.097 kg/s after +50 kPa feed upset),
// outflow = c * valve * sqrt(level), fitted to the AVEVA run (open loop 6.4 cm, closed loop 0.75 cm).
{
  const root = document.getElementById('sim');
  if (root) {
    const RHOAH = 1559, C = 0.976 / (0.685 * Math.sqrt(0.5)), KC = 16.58, TI = 264, DT = 2, TC = 5;
    const SPAN = 1200, H_CM = 200;
    const els = {
      svg: root.querySelector('.plant svg'), cv: root.querySelector('.trend canvas'),
      run: root.querySelector('#simRun'), upset: root.querySelector('#simUpset'), reset: root.querySelector('#simReset'),
      pi: root.querySelector('#simPI'), sp: root.querySelector('#simSP'), spOut: root.querySelector('#simSPout'),
      t: root.querySelector('#rT'), lvl: root.querySelector('#rL'), err: root.querySelector('#rE'), valve: root.querySelector('#rV'), iae: root.querySelector('#rI'), fin: root.querySelector('#rF')
    };
    let s, running = true, scripted = true, timer = null;
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    function init() {
      s = { t: 0, L: 0.5, Lp: 0.5, u: 0.685, ua: 0.685, sp: 0.5, fin: 0.976, iae: 0, hist: [] };
      scripted = true;
      els.sp.value = 0.5; els.spOut.textContent = '0.50';
      log();
    }
    function log() { s.hist.push([s.t, s.L, s.sp, s.ua]); if (s.hist.length > SPAN / DT + 1) s.hist.shift(); }
    function step() {
      if (scripted) {
        if (s.t === 120) { s.fin = 1.097; els.upset.textContent = 'Remove upset'; }
        if (s.t === 600) { s.sp = 0.6; els.sp.value = 0.6; els.spOut.textContent = '0.60'; }
        if (s.t >= SPAN) scripted = false;
      }
      if (els.pi.checked) {
        const e = s.L - s.sp;
        s.u = Math.min(1, Math.max(0.05, s.u + KC * ((s.L - s.Lp) + DT / TI * e)));
      }
      s.Lp = s.L;
      for (let k = 0; k < 4; k++) {
        const h = DT / 4;
        s.ua += h / TC * (s.u - s.ua);
        const fout = C * s.ua * Math.sqrt(Math.max(s.L, 0));
        s.L = Math.min(1, Math.max(0, s.L + h * (s.fin - fout) / RHOAH));
      }
      s.t += DT;
      s.iae += Math.abs(s.L - s.sp) * DT;
      log();
    }
    function drawPlant() {
      const lvl = s.L, top = 40, bot = 250, y = bot - (bot - top) * lvl, ysp = bot - (bot - top) * s.sp;
      const op = Math.round(s.ua * 100), upset = s.fin > 1;
      els.svg.innerHTML = `
        <defs><linearGradient id="wat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#43c6e0" stop-opacity=".75"/><stop offset="1" stop-color="#3d6bff" stop-opacity=".85"/></linearGradient>
        <clipPath id="tk"><rect x="80" y="${top}" width="110" height="${bot - top}" rx="16"/></clipPath></defs>
        <path d="M10 70H80" stroke="${upset ? '#ef4444' : '#7c9bff'}" stroke-width="5"/>
        <text x="10" y="58">FEED</text>
        <text class="lbl" x="10" y="92">${s.fin.toFixed(3)} kg/s</text>
        ${upset ? '<text x="10" y="110" fill="#ff8a8a" style="fill:#ff8a8a">+50 kPa</text>' : ''}
        <rect x="80" y="${top}" width="110" height="${bot - top}" rx="16" fill="#0b1430" stroke="#c9d3e6" stroke-width="2"/>
        <rect x="80" y="${y}" width="110" height="${bot - y}" fill="url(#wat)" clip-path="url(#tk)"/>
        <path d="M80 ${ysp}H190" stroke="#fff" stroke-dasharray="5 4" stroke-width="1.5" opacity=".8"/>
        <text class="lbl" x="196" y="${ysp + 4}">SP</text>
        <text x="104" y="${Math.min(y + 22, bot - 8)}" fill="#fff">${(lvl * 100).toFixed(1)}%</text>
        <path d="M190 232H230" stroke="#7c9bff" stroke-width="5"/>
        <path d="M230 220V244L250 232Z M270 220V244L250 232Z" fill="#0b1430" stroke="#c9d3e6" stroke-width="2"/>
        <path d="M250 232V206" stroke="#c9d3e6" stroke-width="2"/><rect x="241" y="198" width="18" height="9" fill="#c9d3e6"/>
        <path d="M270 232H290" stroke="#7c9bff" stroke-width="5"/>
        <text x="228" y="270">V2 ${op}%</text>
        <circle cx="250" cy="120" r="22" fill="#0b1430" stroke="${els.pi.checked ? '#2bd17e' : '#525d70'}" stroke-width="2.5"/>
        <path d="M228 120H272" stroke="${els.pi.checked ? '#2bd17e' : '#525d70'}" stroke-width="1"/>
        <text x="237" y="116">LIC</text><text class="lbl" x="236" y="135">${els.pi.checked ? 'PI on' : 'manual'}</text>
        <path d="M190 120H228" stroke="#ef4444" stroke-dasharray="4 4" stroke-width="1.6"/>
        <path d="M250 142V196" stroke="#ef4444" stroke-dasharray="4 4" stroke-width="1.6"/>`;
    }
    function drawTrend() {
      const cv = els.cv, r = devicePixelRatio || 1, W = cv.clientWidth, H = cv.clientHeight;
      if (cv.width !== W * r) { cv.width = W * r; cv.height = H * r; }
      const g = cv.getContext('2d'); g.setTransform(r, 0, 0, r, 0, 0); g.clearRect(0, 0, W, H);
      const m = { l: 46, r: 52, t: 40, b: 30 }, pw = W - m.l - m.r, ph = H - m.t - m.b;
      const t1 = Math.max(SPAN, s.t), t0 = t1 - SPAN;
      const lo = 0.4, hi = 0.75;
      const X = t => m.l + (t - t0) / SPAN * pw, Y = v => m.t + (1 - (v - lo) / (hi - lo)) * ph;
      g.font = '12px Inter, sans-serif'; g.fillStyle = '#7d89a1'; g.strokeStyle = 'rgba(255,255,255,.07)'; g.lineWidth = 1;
      for (let v = 0.4; v <= 0.751; v += 0.05) { const yy = Y(v); g.beginPath(); g.moveTo(m.l, yy); g.lineTo(W - m.r, yy); g.stroke(); g.fillText((v * 100).toFixed(0) + '%', 6, yy + 4); }
      const stepT = W < 520 ? 400 : 200;
      for (let t = Math.ceil(t0 / stepT) * stepT; t <= t1; t += stepT) { const xx = X(t); g.beginPath(); g.moveTo(xx, m.t); g.lineTo(xx, H - m.b); g.stroke(); g.fillText(t + ' s', xx - 14, H - 10); }
      const line = (idx, col, w, dash, map) => {
        g.beginPath(); g.setLineDash(dash); g.strokeStyle = col; g.lineWidth = w;
        s.hist.forEach((p, i) => { const xx = X(p[0]), yy = map(p[idx]); i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); });
        g.stroke(); g.setLineDash([]);
      };
      line(3, 'rgba(43,209,126,.55)', 1.5, [], v => m.t + (1 - v) * ph);
      g.fillStyle = 'rgba(43,209,126,.8)'; g.textAlign = 'right';
      [0, 50, 100].forEach(v => g.fillText('V ' + v + '%', W - 4, m.t + (1 - v / 100) * ph + (v === 100 ? 12 : v === 0 ? -4 : 4)));
      g.textAlign = 'left';
      line(2, 'rgba(255,255,255,.75)', 1.5, [6, 5], Y);
      const grd = g.createLinearGradient(m.l, 0, W, 0); grd.addColorStop(0, '#3d6bff'); grd.addColorStop(1, '#43c6e0');
      line(1, grd, 3, [], Y);
    }
    function readouts() {
      els.t.textContent = s.t + ' s';
      els.lvl.textContent = (s.L * 100).toFixed(1) + ' %';
      els.err.textContent = ((s.L - s.sp) * H_CM).toFixed(1) + ' cm';
      els.valve.textContent = (s.ua * 100).toFixed(0) + ' %';
      els.iae.textContent = s.iae.toFixed(1);
      els.fin.textContent = s.fin.toFixed(3);
    }
    function render() { drawPlant(); drawTrend(); readouts(); }
    function tick() { for (let k = 0; k < 2; k++) step(); render(); }
    function play() { clearInterval(timer); timer = setInterval(tick, 100); running = true; els.run.textContent = 'Pause'; }
    function pause() { clearInterval(timer); running = false; els.run.textContent = 'Run'; }

    els.run.addEventListener('click', () => running ? pause() : play());
    els.upset.addEventListener('click', () => { scripted = false; s.fin = s.fin > 1 ? 0.976 : 1.097; els.upset.textContent = s.fin > 1 ? 'Remove upset' : 'Feed upset +50 kPa'; render(); });
    els.reset.addEventListener('click', () => { init(); els.upset.textContent = 'Feed upset +50 kPa'; render(); });
    els.pi.addEventListener('change', () => { scripted = false; render(); });
    els.sp.addEventListener('input', () => { scripted = false; s.sp = +els.sp.value; els.spOut.textContent = s.sp.toFixed(2); render(); });
    const ro = new ResizeObserver(() => drawTrend()); ro.observe(els.cv);

    init();
    if (reduce) { for (let k = 0; k < SPAN / DT; k++) step(); render(); pause(); }
    else { render(); play(); }
  }
}
