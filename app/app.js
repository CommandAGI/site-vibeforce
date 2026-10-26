/*
 * VibeForce mission control, a demo that runs in the visitor's browser.
 *
 * It is a script, not a model: a brief is read by keyword rules, and the plan, the shortlist, the milestones and the
 * pipeline come from the sample data below. It sends nothing (the page's CSP has connect-src 'none') and nothing is
 * dispatched. A real mission is scoped by VibeForce's agents and approved by a person.
 */
(() => {
  "use strict";

  const lang = document.documentElement.lang || "en";
  const LOCALE = lang.startsWith("zh") ? "zh" : lang.startsWith("es") ? "es" : "en";
  const STORE = `vibeforce-demo-v1-${LOCALE}`;

  // ── words ──────────────────────────────────────────────────────────────────────────────────────────────────────
  const STR = {
    en: {
      examples: ["Supplier check in Shenzhen", "Set up a pop-up in Osaka", "Deliver a prototype in Berlin"],
      note: "A demo on fictional data. The plan is made by fixed rules in this page, not by a model. Nothing is sent and nothing is dispatched.",
      placeholder: "A supplier in Shenzhen says they can make our enclosure. We need someone on site this week to watch a run, check three samples against our drawing, and photograph the packing line.",
      planTitle: "The plan",
      objective: "Objective",
      deliverables: "Deliverables",
      acceptance: "Acceptance criteria",
      risks: "Watch for",
      evidence: "Evidence pack",
      milestones: "Escrow milestones",
      shortlist: "Operator shortlist",
      score: "match",
      dispatch: "Dispatch this mission",
      company: "Account",
      city: "City",
      budget: "Escrow",
      rate: "Operator rate",
      fee: "Platform fee",
      reserve: "Evidence reserve",
      total: "Escrow total",
      empty: "No mission yet. Write a brief on the left and scope it.",
      emptyPipe: "Nothing dispatched yet. Scope a mission, then dispatch it.",
      emptyAcc: "No accounts yet. A dispatched mission creates its account.",
      dispatchNote: "Dispatched by the demo. No operator was contacted and no money moved.",
      stages: { matching: "Matching", field: "In field", review: "Review", paid: "Paid" },
      advance: { matching: "Send into the field", field: "Close and send the pack", review: "Accept the evidence" },
      returned: "Return one item",
      returnedNote: "One item returned with a reason; the mission waits.",
      timeline: "Timeline",
      next: "Next action",
      account: "Account",
      missions: "Missions",
      value: "Committed",
      stage: "Stage",
      pack: "Evidence pack",
      accept: "Accepted",
      waiting: "Waiting",
      resetDone: "Demo reset.",
      planned: "Mission scoped. Nothing is dispatched until you dispatch it.",
      dispatched: "Dispatched (demo only).",
      waitingText: "every item accepted, the payout releases",
      rateOf: "of the budget",
      fillBrief: "Write what has to happen first.",
      actions: {
        matching: "Confirm the operator's arrival window.",
        field: "Watch the captures; the first one is due today.",
        review: "Check the pack item by item.",
        paid: "Payout released. Add the account's next mission.",
      },
    },
    es: {
      examples: ["Revisión de proveedor en Shenzhen", "Montar un pop-up en Osaka", "Entregar un prototipo en Berlín"],
      note: "Una demostración con datos ficticios. El plan lo hacen reglas fijas en esta página, no un modelo. No se envía nada y no se despacha nada.",
      placeholder: "Un proveedor en Shenzhen dice que puede fabricar nuestra carcasa. Necesitamos a alguien en el sitio esta semana para ver una corrida, revisar tres muestras contra nuestro plano y fotografiar la línea de empaque.",
      planTitle: "El plan",
      objective: "Objetivo",
      deliverables: "Entregables",
      acceptance: "Criterios de aceptación",
      risks: "Ojo con",
      evidence: "Paquete de evidencia",
      milestones: "Hitos del depósito",
      shortlist: "Candidatos",
      score: "coincidencia",
      dispatch: "Despachar esta misión",
      company: "Cuenta",
      city: "Ciudad",
      budget: "Depósito",
      rate: "Tarifa del operador",
      fee: "Comisión de la plataforma",
      reserve: "Reserva por evidencia",
      total: "Total en depósito",
      empty: "Todavía no hay misión. Escribe un encargo a la izquierda y defínelo.",
      emptyPipe: "Nada despachado todavía. Define una misión y despáchala.",
      emptyAcc: "Todavía no hay cuentas. Una misión despachada crea la suya.",
      dispatchNote: "Despachada por la demostración. No se contactó a ningún operador y no se movió dinero.",
      stages: { matching: "Selección", field: "En campo", review: "Revisión", paid: "Pagada" },
      advance: { matching: "Enviar al campo", field: "Cerrar y enviar el paquete", review: "Aceptar la evidencia" },
      returned: "Devolver un punto",
      returnedNote: "Se devolvió un punto con una razón; la misión espera.",
      timeline: "Línea de tiempo",
      next: "Próximo paso",
      account: "Cuenta",
      missions: "Misiones",
      value: "Comprometido",
      stage: "Etapa",
      pack: "Paquete de evidencia",
      accept: "Aceptado",
      waiting: "Pendiente",
      resetDone: "Demostración reiniciada.",
      planned: "Misión definida. No se despacha hasta que la despaches.",
      dispatched: "Despachada (solo demostración).",
      waitingText: "con todos los puntos aceptados, se libera el pago",
      rateOf: "del presupuesto",
      fillBrief: "Escribe primero qué tiene que pasar.",
      actions: {
        matching: "Confirma la ventana de llegada del operador.",
        field: "Sigue las capturas; la primera vence hoy.",
        review: "Revisa el paquete punto por punto.",
        paid: "Pago liberado. Añade la próxima misión de la cuenta.",
      },
    },
    zh: {
      examples: ["深圳的供应商核查", "在大阪搭建快闪店", "在柏林交付原型"],
      note: "示例数据演示。计划由本页的固定规则生成，不是模型。不发送任何内容，也不派发任何任务。",
      placeholder: "深圳的一家供应商说能做我们的外壳。这周需要有人到现场看一次生产，按图纸检查三件样品，并拍下包装线。",
      planTitle: "计划",
      objective: "目标",
      deliverables: "交付物",
      acceptance: "验收标准",
      risks: "注意",
      evidence: "证据包",
      milestones: "托管里程碑",
      shortlist: "候选执行者",
      score: "匹配度",
      dispatch: "派发这项任务",
      company: "客户账户",
      city: "城市",
      budget: "托管金额",
      rate: "执行者费率",
      fee: "平台费用",
      reserve: "证据保证金",
      total: "托管总额",
      empty: "还没有任务。在左侧写下任务说明并定义它。",
      emptyPipe: "还没有派发。先定义一项任务，再派发。",
      emptyAcc: "还没有账户。派发任务会创建它所属的账户。",
      dispatchNote: "由演示派发。没有联系任何执行者，也没有资金流动。",
      stages: { matching: "匹配中", field: "现场", review: "复核", paid: "已结算" },
      advance: { matching: "派往现场", field: "关闭并提交证据包", review: "接受证据" },
      returned: "退回一项",
      returnedNote: "已附理由退回一项，任务等待中。",
      timeline: "时间线",
      next: "下一步",
      account: "账户",
      missions: "任务",
      value: "已承诺",
      stage: "阶段",
      pack: "证据包",
      accept: "已接受",
      waiting: "待处理",
      resetDone: "演示已重置。",
      planned: "任务已定义。派发之前不会派出。",
      dispatched: "已派发（仅演示）。",
      waitingText: "所有项被接受后释放付款",
      rateOf: "占预算",
      fillBrief: "先写下要发生什么。",
      actions: {
        matching: "确认执行者的到场时间窗口。",
        field: "跟踪现场采集，第一项今天到期。",
        review: "逐项检查证据包。",
        paid: "付款已释放。为账户添加下一项任务。",
      },
    },
  };
  const S = STR[LOCALE];

  // ── sample data ───────────────────────────────────────────────────────────────────────────────────────────────
  const CITIES = [
    { id: "shenzhen", en: "Shenzhen", es: "Shenzhen", zh: "深圳" },
    { id: "osaka", en: "Osaka", es: "Osaka", zh: "大阪" },
    { id: "berlin", en: "Berlin", es: "Berlín", zh: "柏林" },
    { id: "austin", en: "Austin", es: "Austin", zh: "奥斯汀" },
    { id: "lisbon", en: "Lisbon", es: "Lisboa", zh: "里斯本" },
    { id: "singapore", en: "Singapore", es: "Singapur", zh: "新加坡" },
    { id: "sao-paulo", en: "São Paulo", es: "São Paulo", zh: "圣保罗" },
    { id: "lagos", en: "Lagos", es: "Lagos", zh: "拉各斯" },
  ];
  const cityName = (id) => (CITIES.find((c) => c.id === id) || CITIES[0])[LOCALE] || CITIES[0].en;

  // Fictional operators. The record is the demo's own.
  const ROSTER = [
    { id: "op-kenji", name: "Kenji Tanaka", city: "osaka", rank: "lead", rating: 4.9, missions: 47, skills: ["event", "supplier", "delivery"] },
    { id: "op-mei", name: "Mei Chen", city: "shenzhen", rank: "captain", rating: 4.8, missions: 63, skills: ["supplier", "delivery"] },
    { id: "op-sofia", name: "Sofia Almeida", city: "lisbon", rank: "operator", rating: 4.7, missions: 21, skills: ["event", "delivery"] },
    { id: "op-tomas", name: "Tomás Ferreira", city: "berlin", rank: "operator", rating: 4.6, missions: 33, skills: ["delivery", "supplier"] },
    { id: "op-aiko", name: "Aiko Mori", city: "osaka", rank: "operator", rating: 4.7, missions: 18, skills: ["supplier", "event"] },
    { id: "op-daniel", name: "Daniel Okafor", city: "lagos", rank: "lead", rating: 4.8, missions: 39, skills: ["delivery", "event"] },
    { id: "op-lena", name: "Lena Hoffmann", city: "berlin", rank: "candidate", rating: 4.4, missions: 4, skills: ["delivery"] },
    { id: "op-wei", name: "Wei Zhang", city: "shenzhen", rank: "operator", rating: 4.7, missions: 26, skills: ["supplier"] },
    { id: "op-grace", name: "Grace Lim", city: "singapore", rank: "operator", rating: 4.8, missions: 29, skills: ["delivery", "supplier"] },
    { id: "op-marcos", name: "Marcos Silva", city: "sao-paulo", rank: "operator", rating: 4.5, missions: 15, skills: ["event"] },
    { id: "op-anna", name: "Anna Novak", city: "austin", rank: "operator", rating: 4.6, missions: 24, skills: ["event", "delivery"] },
  ];
  const RANK = { en: { candidate: "Candidate", operator: "Operator", lead: "Lead Operator", captain: "Field Captain" }, es: { candidate: "Candidato", operator: "Operador", lead: "Operador líder", captain: "Capitán de campo" }, zh: { candidate: "候选", operator: "执行者", lead: "主执行者", captain: "现场队长" } };

  // Three missions a team actually briefs. Every string here is the demo's; a real plan is a person's.
  const TEMPLATES = {
    supplier: {
      title: { en: "Supplier check", es: "Revisión de proveedor", zh: "供应商核查" },
      words: ["supplier", "suppliers", "factory", "plant", "sample", "samples", "proveedor", "fábrica", "muestra", "供应商", "工厂", "样品", "验厂"],
      objective: {
        en: "Verify on site that the supplier can make the part to the drawing, and capture what the line and the samples actually look like.",
        es: "Verificar en el sitio que el proveedor puede fabricar la pieza según el plano y capturar cómo se ven realmente la línea y las muestras.",
        zh: "到现场确认供应商能按图纸做出零件，并如实记录产线与样品的真实状况。",
      },
      deliverables: {
        en: ["A filmed run of one full cycle from the line", "Three samples photographed against the drawing, with measurements", "The packing line and the sample labels, photographed", "The plant manager's name and signature on the visit sheet"],
        es: ["Un video de una corrida completa de la línea", "Tres muestras fotografiadas contra el plano, con medidas", "La línea de empaque y las etiquetas de muestra, fotografiadas", "Nombre y firma del gerente de planta en la hoja de visita"],
        zh: ["产线完整一个循环的录像", "三件样品按图纸拍照并附尺寸", "包装线与样品标签的照片", "访问单上的厂长姓名与签字"],
      },
      acceptance: {
        en: ["Each sample's photo shows the measurement beside the drawing dimension", "The run video is one unedited take, at least 60 seconds", "The visit sheet is signed and dated on the same day"],
        es: ["La foto de cada muestra enseña la medida junto a la dimensión del plano", "El video de la corrida es una toma sin cortes, de al menos 60 segundos", "La hoja de visita está firmada y fechada el mismo día"],
        zh: ["每件样品照片同时显示实测值与图纸尺寸", "生产录像为一段不少于 60 秒的未剪辑原片", "访问单当天签字并注明日期"],
      },
      risks: {
        en: ["The line may not be running: ask for a run before the visit", "Samples may be pre-picked: take three at random from the rack"],
        es: ["La línea puede estar parada: pide una corrida antes de la visita", "Las muestras pueden estar elegidas: toma tres al azar del estante"],
        zh: ["产线可能没有开动：到访前先要求安排生产", "样品可能被预先挑选：从料架上随机取三件"],
      },
      evidence: {
        en: ["Run video", "Sample photos with measurements", "Packing line photos", "Signed visit sheet"],
        es: ["Video de la corrida", "Fotos de muestras con medidas", "Fotos de la línea de empaque", "Hoja de visita firmada"],
        zh: ["生产录像", "带尺寸的样品照片", "包装线照片", "签字访问单"],
      },
      milestones: {
        en: ["Arrival and site check", "Samples and line capture", "Signed visit sheet"],
        es: ["Llegada y revisión del sitio", "Muestras y captura de la línea", "Hoja de visita firmada"],
        zh: ["到场与场地核查", "样品与产线采集", "签字访问单"],
      },
      split: [30, 40, 30],
      map: [0, 1, 3],
    },
    event: {
      title: { en: "Event setup", es: "Montaje de evento", zh: "活动搭建" },
      words: ["event", "venue", "booth", "pop-up", "popup", "conference", "setup", "set up", "evento", "sede", "montaje", "活动", "场地", "搭建", "快闪"],
      objective: {
        en: "Get the space ready and prove it is ready before the doors open: every item placed, every picture taken from the entrance.",
        es: "Dejar el espacio listo y probarlo antes de abrir puertas: cada elemento colocado y cada foto tomada desde la entrada.",
        zh: "在开门之前把场地准备好并证明已经就绪：每件物品就位，每张照片都从入口方向拍摄。",
      },
      deliverables: {
        en: ["One photo of the space from the entrance, before and after", "A checklist walk-through: each item placed or marked missing", "A two-minute video of the finished space, walked end to end", "The venue contact's name and the time the doors open"],
        es: ["Una foto del espacio desde la entrada, antes y después", "Un recorrido con lista: cada elemento colocado o marcado como faltante", "Un video de dos minutos del espacio terminado, recorrido completo", "El nombre del contacto de la sede y la hora de apertura"],
        zh: ["从入口拍摄的场地前后对比照各一张", "按清单走场：每项已就位或标记为缺失", "完工场地两分钟完整走场视频", "场地联系人姓名与开门时间"],
      },
      acceptance: {
        en: ["The before and after photos are taken from the same place", "Every missing item is named, with a photo of the empty spot", "The walk-through video has no cuts"],
        es: ["Las fotos de antes y después se toman desde el mismo lugar", "Cada faltante está nombrado, con foto del lugar vacío", "El video del recorrido no tiene cortes"],
        zh: ["前后对比照拍摄位置一致", "每项缺失都写明，并附空缺位置照片", "走场视频不剪辑"],
      },
      risks: {
        en: ["The venue may open late: call the contact before you start", "Power may be on a different circuit: test the load first"],
        es: ["La sede puede abrir tarde: llama al contacto antes de empezar", "La corriente puede estar en otro circuito: prueba la carga primero"],
        zh: ["场地可能延迟开门：开工前先联系联系人", "供电可能接在另一路：先测试负载"],
      },
      evidence: {
        en: ["Before and after photos", "Checklist walk-through", "Walk-through video", "Venue contact note"],
        es: ["Fotos de antes y después", "Recorrido con lista", "Video del recorrido", "Nota del contacto de la sede"],
        zh: ["前后对比照", "清单走场记录", "走场视频", "场地联系人记录"],
      },
      milestones: {
        en: ["Access and the before photo", "Placement and checklist", "Walk-through and sign-off"],
        es: ["Acceso y foto inicial", "Colocación y lista", "Recorrido y cierre"],
        zh: ["进场与初始照片", "布置与清单", "走场与签认"],
      },
      split: [25, 45, 30],
    },
    delivery: {
      title: { en: "Delivery with proof", es: "Entrega con prueba", zh: "带证据的交付" },
      words: ["deliver", "delivery", "drop", "pickup", "pick up", "prototype", "courier", "entregar", "entrega", "prototipo", "交付", "送达", "取件", "原型"],
      objective: {
        en: "Move one item from A to B intact, and come back with the proof that it arrived and who took it.",
        es: "Mover un artículo de A a B intacto y volver con la prueba de que llegó y de quién lo recibió.",
        zh: "把一件物品完好地从 A 送到 B，并带回已送达及签收人的证据。",
      },
      deliverables: {
        en: ["A photo of the item at pickup, sealed and labelled", "A photo at handover, with the receiver present", "The receiver's name, signature and the time", "Any damage, photographed before the handover"],
        es: ["Una foto del artículo en la recogida, sellado y etiquetado", "Una foto en la entrega, con quien recibe presente", "Nombre, firma y hora de quien recibe", "Cualquier daño, fotografiado antes de la entrega"],
        zh: ["取件时物品已封装贴标的照片", "交接时收件人在场的照片", "收件人姓名、签字与时间", "如有损坏，在交接前拍照"],
      },
      acceptance: {
        en: ["The pickup and handover photos show the same label", "The signature matches the name written on the sheet", "The times add up: pickup before handover"],
        es: ["Las fotos de recogida y entrega muestran la misma etiqueta", "La firma coincide con el nombre escrito en la hoja", "Las horas cuadran: recogida antes de la entrega"],
        zh: ["取件与交接照片上的标签一致", "签字与单上姓名一致", "时间吻合：取件早于交接"],
      },
      risks: {
        en: ["A receiver may be absent: wait for the named person, do not leave it", "Packaging may fail in transit: photograph the seal before you leave"],
        es: ["Puede no haber quien reciba: espera a la persona indicada, no lo dejes", "El embalaje puede fallar en el trayecto: fotografía el sello antes de salir"],
        zh: ["收件人可能不在：等指定的人，不要留下物品", "包装可能在途中损坏：出发前拍下封条"],
      },
      evidence: {
        en: ["Pickup photo", "Handover photo", "Signed receipt", "Condition photos"],
        es: ["Foto de recogida", "Foto de entrega", "Recibo firmado", "Fotos del estado"],
        zh: ["取件照片", "交接照片", "签收单据", "状态照片"],
      },
      milestones: {
        en: ["Pickup", "In transit", "Signed handover"],
        es: ["Recogida", "En tránsito", "Entrega firmada"],
        zh: ["取件", "在途", "签收交接"],
      },
      split: [25, 25, 50],
    },
    visit: {
      title: { en: "Site visit", es: "Visita al sitio", zh: "现场走访" },
      words: [],
      objective: {
        en: "Go to the place, see the thing with your own eyes, and bring back a record someone who was not there can check.",
        es: "Ir al lugar, verlo con tus propios ojos y volver con un registro que alguien que no estuvo pueda revisar.",
        zh: "到现场亲眼看清楚，并带回一份没到现场的人也能核对的记录。",
      },
      deliverables: {
        en: ["A photo of the place, with the address in frame", "Notes on what was seen, with a photo for each note", "One short video of the thing that matters", "The name and role of whoever you spoke to"],
        es: ["Una foto del lugar, con la dirección en el encuadre", "Notas de lo visto, con una foto por nota", "Un video corto de lo que importa", "Nombre y cargo de con quién hablaste"],
        zh: ["场地照片，画面中含地址", "所见记录，每条附一张照片", "一段关键对象的短视频", "你交谈者的姓名与职务"],
      },
      acceptance: {
        en: ["Every note has its photo", "The address in the photo matches the brief", "A person's name is recorded once"],
        es: ["Cada nota tiene su foto", "La dirección de la foto coincide con el encargo", "Hay un nombre de persona registrado"],
        zh: ["每条记录都有照片", "照片中的地址与任务说明一致", "至少记录一位联系人姓名"],
      },
      risks: {
        en: ["The person you need may be out: ask for a time before you travel", "Photos may not carry a location: check the capture's metadata"],
        es: ["La persona que buscas puede no estar: pide una hora antes de viajar", "Las fotos pueden no llevar ubicación: revisa los metadatos"],
        zh: ["要找的人可能不在：出发前先约时间", "照片可能没有位置信息：检查采集元数据"],
      },
      evidence: {
        en: ["Place photo with address", "Note photos", "Short video", "Contact note"],
        es: ["Foto del lugar con dirección", "Fotos de notas", "Video corto", "Nota de contacto"],
        zh: ["含地址的场地照片", "记录照片", "短视频", "联系人记录"],
      },
      milestones: {
        en: ["Arrival", "Capture", "Notes and sign-off"],
        es: ["Llegada", "Captura", "Notas y cierre"],
        zh: ["到场", "采集", "记录与签认"],
      },
      split: [30, 40, 30],
    },
  };

  const FEE = 0.12; // the platform fee the demo shows; the owner sets it
  const RATE = 0.72; // the operator's share of the mission budget, by rank below
  const RANK_SHARE = { candidate: 0.6, operator: 0.7, lead: 0.75, captain: 0.85 };

  // ── state ────────────────────────────────────────────────────────────────────────────────────────────────────
  const load = () => {
    try {
      const raw = localStorage.getItem(STORE);
      if (raw) return JSON.parse(raw);
    } catch {
      /* a blocked or full storage: the demo runs without it */
    }
    return { seq: 1, missions: [], accounts: [], plan: null };
  };
  let state = load();
  const save = () => {
    try {
      localStorage.setItem(STORE, JSON.stringify(state));
    } catch {
      /* the demo works without storage too */
    }
  };

  // ── elements ─────────────────────────────────────────────────────────────────────────────────────────────────
  const $ = (id) => document.getElementById(id);
  const view = $("view");
  const el = (tag, props = {}, ...kids) => {
    const node = document.createElement(tag);
    for (const [k, v] of Object.entries(props)) {
      if (k === "class") node.className = v;
      else if (k === "text") node.textContent = v;
      else if (k.startsWith("on")) node.addEventListener(k.slice(2), v);
      else node.setAttribute(k, v);
    }
    for (const kid of kids.flat()) if (kid != null) node.append(kid.nodeType ? kid : document.createTextNode(String(kid)));
    return node;
  };
  const money = (n) => `$${Math.round(n).toLocaleString("en-US")}`;

  let tab = "plan";
  let opened = null; // a dispatched mission opened from the pipeline, drawn in place of the plan

  // ── the planner: fixed rules over the sample data ─────────────────────────────────────────────────────────────
  function pickTemplate(brief) {
    const text = brief.toLowerCase();
    let best = { id: "visit", hits: 0 };
    for (const [id, t] of Object.entries(TEMPLATES)) {
      const hits = t.words.filter((w) => text.includes(w)).length;
      if (hits > best.hits) best = { id, hits };
    }
    return best.id;
  }

  function shortlist(template, city, n = 2) {
    return ROSTER.map((op) => {
      const reasons = [];
      let score = op.rating * 8 + Math.min(op.missions, 60) / 4;
      if (op.city === city) {
        score += 30;
        reasons.push(STR[LOCALE] === STR.en ? `based in ${cityName(city)}` : LOCALE === "es" ? `con base en ${cityName(city)}` : `常驻${cityName(city)}`);
      }
      if (op.skills.includes(template)) {
        score += 35;
        reasons.push(LOCALE === "es" ? "ha hecho esta clase de misión" : LOCALE === "zh" ? "做过同类任务" : "has run this kind of mission");
      }
      if (op.rank === "lead" || op.rank === "captain") reasons.push(LOCALE === "es" ? "puede coordinar a un segundo operador" : LOCALE === "zh" ? "可协调第二名执行者" : "can coordinate a second operator");
      return { ...op, score: Math.round(score), reasons };
    })
      .sort((a, b) => b.score - a.score)
      .slice(0, n);
  }

  function planMission({ brief, city, budget }) {
    const id = pickTemplate(brief);
    const t = TEMPLATES[id];
    const total = Math.max(50, Number(budget) || 900);
    const ops = shortlist(id, city);
    const mapping = t.map || [0, 1, 2];
    const milestones = t.milestones[LOCALE].map((name, i) => ({
      name,
      amount: Math.round((total * (t.split[i] || 0)) / 100),
      evidence: t.evidence[LOCALE][mapping[i]] || t.evidence[LOCALE][t.evidence[LOCALE].length - 1],
    }));
    const rate = Math.round(total * (RANK_SHARE[ops[0].rank] || RATE));
    const fee = Math.round(total * FEE);
    const reserve = Math.max(0, total - rate - fee);
    return {
      id: `msn_${String(state.seq).padStart(3, "0")}`,
      template: id,
      title: t.title[LOCALE],
      company: (document.getElementById("company").value || "").trim() || "Northwind Robotics",
      city,
      brief: brief.trim(),
      budget: total,
      fee,
      rate,
      reserve,
      objective: t.objective[LOCALE],
      deliverables: t.deliverables[LOCALE],
      acceptance: t.acceptance[LOCALE],
      risks: t.risks[LOCALE],
      evidence: t.evidence[LOCALE],
      milestones,
      operators: ops,
      operator: ops[0],
      stage: null,
      timeline: [],
      accepted: [],
    };
  }

  const at = () => new Date().toLocaleTimeString(LOCALE === "zh" ? "zh-Hans" : LOCALE === "es" ? "es" : "en", { hour: "2-digit", minute: "2-digit" });

  function stamp(mission, text) {
    mission.timeline.push({ at: at(), text });
  }

  // ── views ────────────────────────────────────────────────────────────────────────────────────────────────────
  function renderPlan() {
    view.replaceChildren();
    if (opened) {
      const back = el("button", {
        class: "btn small",
        type: "button",
        text: LOCALE === "zh" ? "← 返回任务" : LOCALE === "es" ? "← Volver a las misiones" : "← Back to the missions",
        onclick: () => {
          opened = null;
          render();
        },
      });
      view.append(back, el("div", { style: "height:12px" }), missionCard(opened, false));
      return;
    }
    const plan = state.plan;
    if (!plan) {
      view.append(el("p", { class: "empty", text: S.empty }));
      return;
    }
    const head = el("div", { class: "mission" }, el("div", { class: "top" }, el("span", { class: "id", text: `${plan.id} · ${cityName(plan.city)}` }), el("span", { class: "tag", text: plan.title })), el("h3", { text: plan.company }));
    const list = (label, items, cls) => el("div", {}, el("h3", { text: label }), el("ul", { class: cls || "" }, items.map((x) => el("li", { text: x }))));
    const rows = (label, items) => el("div", {}, el("h3", { text: label }), el("ul", { class: "check" }, items.map((x) => el("li", { text: x }))));

    const ops = el("div", { class: "ops" }, plan.operators.map((op, i) => el("div", { class: `op${i === 0 ? " pick" : ""}` },
      el("div", { class: "nm", text: `${op.name} · ${RANK[LOCALE][op.rank]}` }),
      el("div", { class: "score", text: `${S.score} ${op.score} · ★ ${op.rating} · ${op.missions} ${S.missions.toLowerCase()}` }),
      el("div", { class: "why", text: op.reasons.join(" · ") || (LOCALE === "zh" ? "可出差" : LOCALE === "es" ? "puede viajar" : "can travel") }),
    )));
    const ms = el("table", { class: "small" },
      el("thead", {}, el("tr", {}, el("th", { text: S.milestones }), el("th", { text: S.evidence }), el("th", { text: "USD" }))),
      el("tbody", {}, plan.milestones.map((m) => el("tr", {}, el("td", { text: m.name }), el("td", { text: m.evidence }), el("td", { text: money(m.amount) })))),
    );
    const nums = el("dl", { class: "kv" },
      el("dt", { text: S.budget }), el("dd", { text: money(plan.budget) }),
      el("dt", { text: S.rate }), el("dd", { text: money(plan.rate) }),
      el("dt", { text: S.fee }), el("dd", { text: money(plan.fee) }),
      el("dt", { text: S.reserve }), el("dd", { text: money(plan.reserve) }),
      el("dt", { text: S.total }), el("dd", { text: money(plan.budget) }),
    );
    head.append(
      el("p", { class: "meta" }, el("span", {}, el("b", { text: S.objective }), ": ", plan.objective)),
      list(S.deliverables, plan.deliverables),
      rows(S.acceptance, plan.acceptance),
      el("h3", { text: S.shortlist }),
      ops,
      el("h3", { text: S.milestones }),
      ms,
      nums,
      el("h3", { text: S.risks }),
      el("ul", { class: "small" }, plan.risks.map((r) => el("li", { text: r }))),
    );
    const dispatch = el("button", {
      class: "btn primary",
      type: "button",
      text: S.dispatch,
      onclick: () => {
        const mission = { ...plan, stage: "matching", timeline: [] };
        stamp(mission, `${LOCALE === "zh" ? "任务已派发" : LOCALE === "es" ? "Misión despachada" : "Mission dispatched"} · ${mission.operator.name}`);
        state.missions.unshift(mission);
        state.seq += 1;
        state.plan = null;
        opened = null;
        save();
        toast(S.dispatched);
        tab = "pipe";
        setTab();
      },
    });
    view.append(head, el("div", { class: "btns" }, dispatch), el("p", { class: "small muted", text: S.dispatchNote }));
  }

  function missionCard(m, board) {
    const card = el("div", { class: "mission" },
      el("div", { class: "top" }, el("span", { class: "id", text: m.id }), el("span", { class: "tag", text: S.stages[m.stage] })),
      el("h3", { text: `${m.title} · ${m.company}` }),
      el("p", { class: "meta" }, el("span", {}, el("b", { text: S.city }), ": ", cityName(m.city)), el("span", {}, el("b", { text: S.budget }), ": ", money(m.budget)), el("span", {}, el("b", { text: "Operator" }), ": ", m.operator.name)),
    );
    if (!board) {
      card.append(
        el("p", { text: m.objective }),
        el("h3", { text: S.pack }),
        el("ul", { class: "check" }, m.evidence.map((e, i) => el("li", { text: `${e} — ${m.accepted.includes(i) ? S.accept : S.waiting}` }))),
        el("h3", { text: S.timeline }),
        el("ul", { class: "timeline" }, m.timeline.map((t) => el("li", { text: `${t.at} · ${t.text}` }))),
      );
    }
    return card;
  }

  function advance(m) {
    const order = ["matching", "field", "review", "paid"];
    const i = order.indexOf(m.stage);
    const next = order[Math.min(i + 1, order.length - 1)];
    const words = {
      en: { matching: "Operator confirmed the window and is on the way.", field: "Pack submitted for review.", review: "Evidence accepted; escrow released.", paid: "" },
      es: { matching: "El operador confirmó la ventana y va en camino.", field: "Paquete enviado a revisión.", review: "Evidencia aceptada; depósito liberado.", paid: "" },
      zh: { matching: "执行者确认了时间窗口，正在前往。", field: "证据包已提交复核。", review: "证据已接受，托管款已释放。", paid: "" },
    }[LOCALE];
    m.stage = next;
    m.accepted = next === "paid" ? m.evidence.map((_, k) => k) : next === "review" ? m.evidence.map((_, k) => k).slice(0, 1) : m.accepted;
    if (words[next]) stamp(m, words[next]);
  }

  function renderPipeline() {
    view.replaceChildren();
    if (!state.missions.length) {
      view.append(el("p", { class: "empty", text: S.emptyPipe }));
      return;
    }
    const board = el("div", { class: "board" });
    for (const stage of ["matching", "field", "review", "paid"]) {
      const inStage = state.missions.filter((m) => m.stage === stage);
      const col = el("div", { class: "col" }, el("h4", {}, el("span", { text: S.stages[stage] }), el("span", { text: String(inStage.length) })));
      for (const m of inStage) {
        const card = el("div", { class: "bcard" },
          el("div", { class: "t", text: m.company }),
          el("div", { class: "s", text: `${m.id} · ${m.title} · ${cityName(m.city)}` }),
          el("div", { class: "s", text: `${m.operator.name} · ${money(m.budget)}` }),
        );
        if (stage !== "paid") {
          card.append(el("button", {
            class: "btn small",
            type: "button",
            text: S.advance[stage],
            onclick: () => {
              advance(m);
              save();
              render();
            },
          }));
        }
        if (stage === "review") {
          card.append(el("button", {
            class: "btn small",
            type: "button",
            style: "margin-left:6px",
            text: S.returned,
            onclick: () => {
              stamp(m, S.returnedNote);
              save();
              render();
            },
          }));
        }
        card.addEventListener("click", (e) => {
          if (e.target.tagName === "BUTTON") return;
          opened = m;
          tab = "plan";
          render();
        });
        col.append(card);
      }
      board.append(col);
    }
    view.append(board);
  }

  function renderAccounts() {
    view.replaceChildren();
    if (!state.missions.length) {
      view.append(el("p", { class: "empty", text: S.emptyAcc }));
      return;
    }
    const byAccount = new Map();
    for (const m of state.missions) {
      const a = byAccount.get(m.company) || { name: m.company, missions: [], value: 0, stage: "matching" };
      a.missions.push(m);
      a.value += m.budget;
      const order = ["matching", "field", "review", "paid"];
      if (order.indexOf(m.stage) > order.indexOf(a.stage)) a.stage = m.stage;
      byAccount.set(m.company, a);
    }
    const table = el("table", {},
      el("thead", {}, el("tr", {}, [S.account, S.missions, S.value, S.stage, S.next].map((h) => el("th", { text: h })))),
      el("tbody", {}, [...byAccount.values()].map((a) => el("tr", {},
        el("td", { text: a.name }),
        el("td", { text: String(a.missions.length) }),
        el("td", { text: money(a.value) }),
        el("td", {}, el("span", { class: "tag", text: S.stages[a.stage] })),
        el("td", { class: "small", text: S.actions[a.stage] }),
      ))),
    );
    view.append(table);
  }

  function render() {
    if (tab === "plan") renderPlan();
    else if (tab === "pipe") renderPipeline();
    else renderAccounts();
    for (const id of ["tab-plan", "tab-pipe", "tab-acc"]) $(id).setAttribute("aria-selected", String((tab === "plan" && id === "tab-plan") || (tab === "pipe" && id === "tab-pipe") || (tab === "acc" && id === "tab-acc")));
  }

  const setTab = () => render();

  let toastTimer = null;
  function toast(text) {
    const t = $("toast");
    t.textContent = text;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  // ── wiring ───────────────────────────────────────────────────────────────────────────────────────────────────
  function init() {
    document.title = `${LOCALE === "zh" ? "任务控制台" : LOCALE === "es" ? "Control de misiones" : "Mission control"} | VibeForce`;
    $("brief").placeholder = S.placeholder;
    $("form-note").textContent = S.note;
    const city = $("city");
    for (const c of CITIES) city.append(el("option", { value: c.id, text: c[LOCALE] || c.en }));
    city.value = "shenzhen";
    const chips = $("chips");
    S.examples.forEach((label, i) => {
      const key = ["supplier", "event", "delivery"][i];
      chips.append(el("button", {
        class: "chip",
        type: "button",
        text: label,
        onclick: () => {
          $("brief").value = label;
          $("city").value = ["shenzhen", "osaka", "berlin"][i];
          $("budget").value = ["900", "1400", "600"][i];
          $("brief").focus();
        },
      }));
    });
    $("plan").addEventListener("click", () => {
      const brief = $("brief").value;
      if (!brief.trim()) {
        toast(S.fillBrief);
        $("brief").focus();
        return;
      }
      state.plan = planMission({ brief, city: $("city").value, budget: $("budget").value });
      save();
      tab = "plan";
      render();
      toast(S.planned);
    });
    $("reset").addEventListener("click", () => {
      state = { seq: 1, missions: [], accounts: [], plan: null };
      save();
      tab = "plan";
      render();
      toast(S.resetDone);
    });
    $("tab-plan").addEventListener("click", () => { tab = "plan"; render(); });
    $("tab-pipe").addEventListener("click", () => { tab = "pipe"; render(); });
    $("tab-acc").addEventListener("click", () => { tab = "acc"; render(); });

    render();
  }

  init();
})();
