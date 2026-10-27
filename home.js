/*
 * The landing page's two behaviours: the sample manifest (choose a job, dispatch it, the seven lines stamp in) and the
 * generated clips (they load after their poster, play only on screen, and never play under reduced motion).
 * Everything is on this page: no request leaves it, nothing is dispatched. Without this script the first job's
 * manifest is printed in full and the clips stand as their posters.
 */
(() => {
  "use strict";
  const doc = document.documentElement;
  doc.classList.add("js");
  const LOCALE = doc.lang.startsWith("zh") ? "zh" : doc.lang.startsWith("es") ? "es" : "en";
  const still = matchMedia("(prefers-reduced-motion: reduce)");

  // ── the sample jobs (fictional operators; the same three as mission control's examples) ─────────────────────
  const JOBS = {
    en: {
      supplier: { no: "VF-S-0141", objective: "Watch one production run of the enclosure and check three samples against drawing rev C.", place: "Supplier’s factory, Shenzhen · this week", skills: ["Mandarin", "Calipers and gauges", "Factory visits"], acceptance: "Three samples within ±0.2 mm, or each miss photographed with the gauge in frame.", operator: "Lin W. · Lead Operator · fictional sample", evidence: ["Photo, GPS and time for each sample", "60 s video of the packing line", "Signed visit log"] },
      popup: { no: "VF-S-0142", objective: "Build a 3 × 3 m pop-up stand by 09:00 and hand it to the event team.", place: "Event hall, Osaka · Saturday 07:00–09:00", skills: ["Japanese", "Event setup", "Lifting 20 kg"], acceptance: "Stand built to the layout plan, power tested, four photos from the marked corners.", operator: "Aiko T. · Operator · fictional sample", evidence: ["Four corner photos with GPS and time", "Photo of the power test", "Hand-over signature"] },
      delivery: { no: "VF-S-0143", objective: "Collect a prototype from the courier depot and hand it to the client’s engineer in person.", place: "Courier depot → client office, Berlin · tomorrow by 14:00", skills: ["German", "Car or cargo bike", "Chain of custody"], acceptance: "A signed receipt from the named engineer; the sealed box photographed at pickup and at hand-over.", operator: "Jonas K. · Operator · fictional sample", evidence: ["Pickup photo, seal visible", "Hand-over photo and signature", "GPS track summary"] },
      waiting: "Waiting for dispatch", approved: "Approved · sample. Nothing dispatched.", dispatch: "Dispatch", again: "Dispatch again",
      done: (n) => `Sample job ${n} dispatched on this page only. Seven lines filled. Nothing was sent.`,
      pause: "Pause motion", play: "Play motion",
    },
    es: {
      supplier: { no: "VF-S-0141", objective: "Observar una tirada de producción de la carcasa y revisar tres muestras contra el plano rev. C.", place: "Fábrica del proveedor, Shenzhen · esta semana", skills: ["Mandarín", "Calibres y galgas", "Visitas a fábrica"], acceptance: "Tres muestras dentro de ±0,2 mm, o cada desviación fotografiada con la galga a la vista.", operator: "Lin W. · Operadora líder · ejemplo ficticio", evidence: ["Foto, GPS y hora de cada muestra", "Vídeo de 60 s de la línea de embalaje", "Registro de visita firmado"] },
      popup: { no: "VF-S-0142", objective: "Montar un stand de 3 × 3 m antes de las 09:00 y entregarlo al equipo del evento.", place: "Recinto de eventos, Osaka · sábado 07:00–09:00", skills: ["Japonés", "Montaje de eventos", "Cargar 20 kg"], acceptance: "Stand montado según el plano, corriente probada, cuatro fotos desde las esquinas marcadas.", operator: "Aiko T. · Operadora · ejemplo ficticio", evidence: ["Cuatro fotos de esquina con GPS y hora", "Foto de la prueba de corriente", "Firma de entrega"] },
      delivery: { no: "VF-S-0143", objective: "Recoger un prototipo en el depósito de mensajería y entregarlo en mano al ingeniero del cliente.", place: "Depósito → oficina del cliente, Berlín · mañana antes de las 14:00", skills: ["Alemán", "Coche o bici de carga", "Cadena de custodia"], acceptance: "Recibo firmado por el ingeniero nombrado; la caja sellada fotografiada al recoger y al entregar.", operator: "Jonas K. · Operador · ejemplo ficticio", evidence: ["Foto de recogida, precinto visible", "Foto de entrega y firma", "Resumen del recorrido GPS"] },
      waiting: "Esperando el despacho", approved: "Aprobado · ejemplo. No se despachó nada.", dispatch: "Despachar", again: "Despachar otra vez",
      done: (n) => `Trabajo de ejemplo ${n} despachado solo en esta página. Siete líneas completas. No se envió nada.`,
      pause: "Pausar el movimiento", play: "Reanudar el movimiento",
    },
    zh: {
      supplier: { no: "VF-S-0141", objective: "现场观看一次外壳生产，并按图纸 C 版检查三个样品。", place: "供应商工厂，深圳 · 本周", skills: ["普通话", "卡尺与量规", "工厂走访"], acceptance: "三个样品误差在 ±0.2 毫米以内，或每处偏差连同量规一起拍照。", operator: "Lin W. · 高级操作员 · 虚构示例", evidence: ["每个样品的照片、GPS 与时间", "60 秒包装线视频", "签字的走访记录"] },
      popup: { no: "VF-S-0142", objective: "09:00 前搭好 3 × 3 米快闪展位，并交给活动团队。", place: "展馆，大阪 · 周六 07:00–09:00", skills: ["日语", "活动搭建", "可搬运 20 公斤"], acceptance: "按布置图搭建，电源已测试，从标记的四个角各拍一张照片。", operator: "Aiko T. · 操作员 · 虚构示例", evidence: ["四张带 GPS 与时间的角落照片", "电源测试照片", "交接签字"] },
      delivery: { no: "VF-S-0143", objective: "从快递站取一个原型，亲手交给客户指定的工程师。", place: "快递站 → 客户办公室，柏林 · 明天 14:00 前", skills: ["德语", "汽车或货运自行车", "保管链"], acceptance: "指定工程师签收；取件与交接时分别拍下密封箱。", operator: "Jonas K. · 操作员 · 虚构示例", evidence: ["取件照片，封条可见", "交接照片与签字", "GPS 路线摘要"] },
      waiting: "等待派单", approved: "已批准 · 示例。未派出任何人。", dispatch: "派单", again: "再派一次",
      done: (n) => `示例任务 ${n} 仅在本页派单。七行已填好。未发送任何内容。`,
      pause: "暂停动态", play: "播放动态",
    },
  }[LOCALE];

  const list = document.getElementById("mf");
  const go = document.getElementById("go");
  const live = document.getElementById("mf-live");
  if (list && go) {
    const rows = [...list.children];
    const row = (k) => rows.find((r) => r.dataset.k === k);
    const out = (k) => row(k).querySelector("output");
    const make = (tag, cls, items, wrap) => {
      const box = document.createElement(tag);
      box.className = cls;
      for (const t of items) {
        const el = document.createElement(wrap);
        if (wrap === "li") { const i = document.createElement("i"); i.textContent = "□"; el.append(i, t); } else el.textContent = t;
        box.append(el);
      }
      return box;
    };
    let current = "supplier";
    let timers = [];
    const fill = (id) => {
      const j = JOBS[id];
      document.getElementById("mf-no").textContent = j.no;
      for (const k of ["objective", "place", "acceptance", "operator"]) out(k).textContent = j[k];
      out("skills").replaceChildren(make("span", "chips-out", j.skills, "i"));
      out("evidence").replaceChildren(make("ul", "ev", j.evidence, "li"));
      out("approval").textContent = JOBS.waiting;
      row("approval").classList.add("pending");
    };
    const clear = () => { timers.forEach(clearTimeout); timers = []; rows.forEach((r) => r.classList.remove("wait", "stamped")); };
    const dispatch = () => {
      clear();
      fill(current);
      const j = JOBS[current];
      const end = () => {
        out("approval").textContent = JOBS.approved;
        row("approval").classList.remove("pending");
        for (const i of list.querySelectorAll(".ev i")) i.textContent = "■";
        go.textContent = JOBS.again;
        live.textContent = JOBS.done(j.no);
      };
      if (still.matches) { rows.forEach((r) => r.classList.add("stamped")); end(); return; }
      rows.forEach((r) => r.classList.add("wait"));
      rows.forEach((r, i) => timers.push(setTimeout(() => {
        r.classList.remove("wait"); r.classList.add("stamped");
        if (i === rows.length - 1) end();
      }, 180 + i * 160)));
    };
    go.hidden = false;
    go.textContent = JOBS.dispatch;
    go.addEventListener("click", dispatch);
    for (const input of document.querySelectorAll('input[name="job"]')) {
      input.addEventListener("change", () => { current = input.value; clear(); fill(current); go.textContent = JOBS.dispatch; live.textContent = ""; });
    }
    const checked = document.querySelector('input[name="job"]:checked');
    if (checked && checked.value !== current) { current = checked.value; fill(current); }
  }

  // ── the clips: load after the poster, play while on screen, a pause control on each (WCAG 2.2.2) ────────────
  const clips = [...document.querySelectorAll("video[data-clip]")];
  const save = navigator.connection && navigator.connection.saveData;
  if (!clips.length || save) return;
  let paused = still.matches;
  const toggles = [];
  const load = (v) => {
    if (v.dataset.loaded) return;
    for (const s of v.querySelectorAll("source[data-src]")) s.src = s.dataset.src;
    v.dataset.loaded = "1";
    v.load();
  };
  const seen = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const v = e.target;
      if (e.isIntersecting && !paused) { load(v); v.play().catch(() => {}); } else if (!e.isIntersecting) v.pause();
    }
  }, { rootMargin: "200px 0px" });
  const label = () => { for (const b of toggles) { b.textContent = paused ? `▶ ${JOBS.play}` : `■ ${JOBS.pause}`; b.setAttribute("aria-pressed", String(paused)); } };
  for (const v of clips) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "clip-toggle gen";
    b.addEventListener("click", () => {
      paused = !paused;
      for (const c of clips) {
        if (paused) c.pause();
        else { const r = c.getBoundingClientRect(); if (r.bottom > 0 && r.top < innerHeight) { load(c); c.play().catch(() => {}); } }
      }
      label();
    });
    toggles.push(b);
    v.parentElement.append(b);
  }
  label();
  // The hero clip waits for the page's load so its poster is the largest paint; the others wait to be near the screen.
  const start = () => clips.forEach((v) => seen.observe(v));
  if (document.readyState === "complete") start(); else addEventListener("load", start, { once: true });
  still.addEventListener("change", () => { paused = still.matches; if (paused) clips.forEach((c) => c.pause()); label(); });
})();
