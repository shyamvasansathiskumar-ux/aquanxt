/* AquaNXT page logic: prototype tabs, drag-to-turn, Neer's face demo, countdown. */
(() => {
  const $ = (id) => document.getElementById(id);
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.Site = window.Site || {};
  Site.aqua = { proto: "home", yaw: 0 };

  /* ---------- prototypes (outward-facing only: internals stay private until the patent filing) ---------- */
  const P = {
    home: { k: "01 · Main prototype", t: "Home", p: "A countertop filter for a family kitchen. Pour water in the top; gravity does the filtering, with no power needed. Neer watches, explains, and locks the tap if something looks wrong.",
      d: [["For", "Families, the kitchen counter"], ["Fill", "11 litres per fill"], ["Power", "Filters with none; USB-C + backup cell for the brain"], ["Fails", "Closed: a power cut or a fault shuts the tap"]],
      f: ["Pour", "Gravity filter", "Neer checks", "Tap"] },
    go: { k: "02 · Stretch prototype", t: "Go", p: "A carry kit for travel, the field and relief work. Hang the bag from any hook, and water runs through a sealed pod into a clean bottle. The pod logs litres and tells you when to clean it.",
      d: [["For", "Travel, field work, relief"], ["Setup", "Hangs 0.5 to 1 m up"], ["Power", "Filters with none; small cell + solar top-up"], ["Status", "Built if Home is on track by 20 Oct"]],
      f: ["Hang", "Bag", "Filter pod", "Bottle"] },
    station: { k: "03 · Community prototype", t: "Station", p: "A solar-powered slow-sand filter for schools and village taps. Its living top layer does most of the work once it matures, about 30 days after the first daily pour. Clear walls show every layer.",
      d: [["For", "Schools, village taps"], ["Power", "Off-grid solar"], ["Matures", "~30 days of daily feeding"], ["Proven idea", "Biosand: 200,000+ filters worldwide"]],
      f: ["Pour", "Sand layers", "Biolayer", "Covered storage"] },
  };
  function show(key) {
    Site.aqua.proto = key;
    document.querySelectorAll(".tab").forEach((b) => b.setAttribute("aria-selected", b.dataset.p === key));
    const x = P[key];
    $("pcard").innerHTML = `<span class="kicker">${x.k}</span><h3>${x.t}</h3><p>${x.p}</p>
      <dl>${x.d.map(([a, b]) => `<dt>${a}</dt><dd>${b}</dd>`).join("")}</dl>
      <div class="flow" aria-label="How water moves">${x.f.map((s) => `<span>${s}</span>`).join("")}</div>`;
    if (window.gsap && !reduce) gsap.from("#pcard > *", { y: 18, opacity: 0, duration: 0.6, stagger: 0.05, ease: "expo.out" });
  }
  document.querySelectorAll(".tab").forEach((b) => b.addEventListener("click", () => show(b.dataset.p)));
  document.querySelector(".tabs").addEventListener("keydown", (e) => {
    const keys = ["home", "go", "station"], i = keys.indexOf(Site.aqua.proto);
    if (e.key === "ArrowDown" || e.key === "ArrowRight") { e.preventDefault(); show(keys[(i + 1) % 3]); document.querySelector(`.tab[data-p="${keys[(i + 1) % 3]}"]`).focus(); }
    if (e.key === "ArrowUp" || e.key === "ArrowLeft") { e.preventDefault(); show(keys[(i + 2) % 3]); document.querySelector(`.tab[data-p="${keys[(i + 2) % 3]}"]`).focus(); }
  });
  show("home");

  // drag to turn the model
  const box = $("stagebox");
  let dragging = false, lastX = 0;
  box.addEventListener("pointerdown", (e) => { dragging = true; lastX = e.clientX; box.setPointerCapture(e.pointerId); });
  box.addEventListener("pointermove", (e) => { if (!dragging) return; Site.aqua.yaw += (e.clientX - lastX) * 0.01; lastX = e.clientX; });
  ["pointerup", "pointercancel"].forEach((t) => box.addEventListener(t, () => (dragging = false)));
  // tell the scene where the box is, so the model sits inside it
  Site.aqua.box = () => { const r = box.getBoundingClientRect(); return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width, h: r.height }; };

  /* ---------- Neer's face ---------- */
  const cv = $("face"), g = cv.getContext("2d");
  const S = [
    ["All good", "green", "calm", "All checks passed", "Filter health 92%, about 40 days left at your current use. 6.2 L of clean water ready."],
    ["Thirsty", "blue", "thirsty", "Feed me! Room for 9 L", "The top tank is empty and there's only 1.8 L of clean water left."],
    ["Muddy source", "amber", "worried", "Rinse the cloth", "Your source has been muddy this week. The cloth tray is due for a rinse before the flow drops."],
    ["Salty source", "amber", "worried", "Salty source", "This water has more dissolved salt than the drinking-water standard prefers. The filter can't remove salt, so another source is better."],
    ["Knocked over", "red", "locked", "I was knocked", "The unit was tipped. The tap stays locked until it's upright and still for 10 seconds."],
    ["Power cut", "amber", "worried", "On battery", "Mains power is out. Filtering carries on by gravity. If the battery runs down, the tap shuts itself."],
    ["Pouring", "green", "pour", "Pouring", "Pouring now. Every check that guards the tap passed a moment ago."],
  ];
  let mood = "calm", blink = 0;
  function px(x, y, w = 1, h = 1) { g.fillRect(x, y, w, h); }
  function draw(t) {
    g.fillStyle = "#060b0b"; g.fillRect(0, 0, 128, 64);
    g.fillStyle = mood === "locked" ? "#ff8a70" : "#6fe0d2";
    const bl = (Math.floor(t / 1000) % 5 === 0 && (t % 1000) < 140) && !reduce;
    const eye = (cx) => {
      if (mood === "locked") { for (let i = 0; i < 9; i++) { px(cx - 4 + i, 22 + i); px(cx + 4 - i, 22 + i); } return; }
      if (mood === "pour") { for (let i = 0; i < 5; i++) { px(cx - 4 + i, 28 - i); px(cx + i, 24 + i); } return; }
      if (bl) { px(cx - 5, 26, 11, 2); return; }
      px(cx - 4, 20, 9, 12); g.fillStyle = "#060b0b"; px(cx - 1, 23, 3, 3); g.fillStyle = mood === "locked" ? "#ff8a70" : "#6fe0d2";
      if (mood === "worried") { for (let i = 0; i < 8; i++) px(cx - 5 + i, 15 + (cx < 64 ? i >> 2 : 2 - (i >> 2))); }
    };
    eye(46); eye(82);
    if (mood === "calm" || mood === "pour") { for (let i = 0; i < 20; i++) px(54 + i, 44 + Math.round(Math.sin((i / 19) * Math.PI) * 4)); }
    else if (mood === "thirsty") { px(60, 42, 8, 2); px(58, 44, 2, 6); px(68, 44, 2, 6); px(60, 50, 8, 2); }
    else if (mood === "worried") { for (let i = 0; i < 18; i++) px(55 + i, 48 - Math.round(Math.sin((i / 17) * Math.PI) * 3)); }
    else if (mood === "locked") { px(54, 46, 20, 2); }
    if (mood === "thirsty" || mood === "pour") { const d = (t / 40) % 30; g.fillStyle = "#6fe0d2"; px(104, 14 + d, 3, 4); px(105, 12 + d, 1, 2); }
    if (!reduce) requestAnimationFrame(draw);
  }
  requestAnimationFrame(draw);
  $("scen").innerHTML = S.map((s, i) => `<button type="button" data-i="${i}" aria-pressed="${i === 0}">${s[0]}</button>`).join("");
  function set(i) {
    const s = S[i]; mood = s[2];
    $("ring").className = "ring " + s[1]; $("nline").textContent = s[3]; $("nmsg").textContent = s[4];
    document.querySelectorAll("#scen button").forEach((b) => b.setAttribute("aria-pressed", +b.dataset.i === i));
    if (reduce) draw(0);
  }
  $("scen").addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) set(+b.dataset.i); });
  set(0);

  /* ---------- countdown ---------- */
  const days = Math.ceil((new Date("2026-11-16T00:00:00+05:30") - new Date()) / 86400000);
  $("days").textContent = days > 0 ? days : "Now";
})();
