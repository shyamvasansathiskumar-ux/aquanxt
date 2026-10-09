// AquaNXT's world: the three prototypes as clean outer shells (no internals), with water
// falling through them. In the prototypes chapter the chosen model sits inside the stage box.
import { createWorld, THREE, smooth } from "./world.js";

const TEAL = new THREE.Color("#0b7a75");
const INK = new THREE.Color("#15120e");
const SAND = new THREE.Color("#d9cfbb");

createWorld(document.getElementById("world"), async ({ scene, camera }) => {
  const glass = () => new THREE.MeshPhysicalMaterial({ color: 0xeaf3f1, roughness: 0.05, metalness: 0, transparent: true, opacity: 0.32, clearcoat: 1, depthWrite: false, side: THREE.DoubleSide });
  const water = new THREE.MeshPhysicalMaterial({ color: "#5fb7ae", roughness: 0.1, transparent: true, opacity: 0.55, clearcoat: 1, depthWrite: false });
  const body = new THREE.MeshStandardMaterial({ color: "#f1ebdf", roughness: 0.55 });
  const ink = new THREE.MeshStandardMaterial({ color: INK, roughness: 0.5 });
  const teal = new THREE.MeshStandardMaterial({ color: TEAL, roughness: 0.35, emissive: TEAL, emissiveIntensity: 0.25 });
  const shadowy = (m) => { m.castShadow = true; m.receiveShadow = true; return m; };
  const rbox = (w, h, d, mat) => shadowy(new THREE.Mesh(new THREE.BoxGeometry(w, h, d, 1, 1, 1), mat));

  /* ---------- Home ---------- */
  const home = new THREE.Group();
  const plinth = rbox(2.6, 1.3, 2.6, body); plinth.position.y = 0.65; home.add(plinth);
  const alcove = rbox(1.2, 0.9, 0.05, ink); alcove.position.set(0, 0.62, 1.31); home.add(alcove);
  const glassCup = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.18, 0.5, 24, 1, true), glass()); glassCup.position.set(0, 0.42, 1.12); home.add(glassCup);
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.16, 0.035, 12, 40), teal); ring.position.set(0.95, 0.95, 1.31); home.add(ring);
  const faceTex = new THREE.CanvasTexture(document.getElementById("face")); faceTex.magFilter = THREE.NearestFilter; faceTex.colorSpace = THREE.SRGBColorSpace;
  const screen = new THREE.Mesh(new THREE.PlaneGeometry(0.62, 0.31), new THREE.MeshBasicMaterial({ map: faceTex })); screen.position.set(-0.75, 0.95, 1.315); home.add(screen);
  const lowTank = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.9, 2.5), glass()); lowTank.position.y = 1.3 + 0.95; home.add(lowTank);
  const lowWater = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.1, 2.4), water); lowWater.position.y = 1.3 + 0.58; home.add(lowWater);
  const band = rbox(2.56, 0.12, 2.56, body); band.position.y = 3.26; home.add(band);
  const upTank = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.9, 2.5), glass()); upTank.position.y = 3.32 + 0.95; home.add(upTank);
  const upWater = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.3, 2.4), water); upWater.position.y = 3.32 + 0.7; home.add(upWater);
  const lid = rbox(2.6, 0.16, 2.6, body); lid.position.y = 5.3; home.add(lid);
  const knob = rbox(0.5, 0.12, 0.5, ink); knob.position.y = 5.44; home.add(knob);
  home.userData = { h: 5.5, fallTop: 5.1, fallBot: 1.4, w: 1.1 };

  /* ---------- Go ---------- */
  const go = new THREE.Group();
  const hook = shadowy(new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.04, 10, 30, Math.PI * 1.4), ink)); hook.position.set(0, 6.35, 0); hook.rotation.z = Math.PI * 0.8; go.add(hook);
  const cord = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.6), ink)); cord.position.set(0, 5.9, 0); go.add(cord);
  const bagGeo = new THREE.SphereGeometry(1, 32, 24); bagGeo.scale(1.15, 1.35, 0.55);
  const bag = shadowy(new THREE.Mesh(bagGeo, new THREE.MeshPhysicalMaterial({ color: "#9fd6cf", roughness: 0.35, transmission: 0, transparent: true, opacity: 0.85, clearcoat: 0.6 }))); bag.position.set(0, 4.4, 0); go.add(bag);
  const hose1 = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.9), ink)); hose1.position.set(0, 2.65, 0); go.add(hose1);
  const pod = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 2.0, 32), body)); pod.position.set(0, 1.25 + 0.95, 0); go.add(pod);
  const podBand = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.335, 0.335, 0.18, 32), teal)); podBand.position.set(0, 2.75, 0); go.add(podBand);
  const hose2 = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.05, 0.55), ink)); hose2.position.set(0, 0.95, 0); go.add(hose2);
  const bottle = new THREE.Mesh(new THREE.CylinderGeometry(0.42, 0.42, 1.1, 32, 1, true), glass()); bottle.position.set(0, 0.55, 0); go.add(bottle);
  const bottleW = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 0.55, 32), water); bottleW.position.set(0, 0.3, 0); go.add(bottleW);
  go.userData = { h: 6.6, fallTop: 1.2, fallBot: 0.4, w: 0.2 };

  /* ---------- Station ---------- */
  const st = new THREE.Group();
  for (const [x, z] of [[-0.9, -0.9], [0.9, -0.9], [-0.9, 0.9], [0.9, 0.9]]) { const l = rbox(0.1, 1.5, 0.1, ink); l.position.set(x, 0.75, z); st.add(l); }
  const top = rbox(2.1, 0.08, 2.1, ink); top.position.y = 1.54; st.add(top);
  const col = new THREE.Mesh(new THREE.CylinderGeometry(1, 1, 3.8, 48, 1, true), glass()); col.position.y = 1.58 + 1.9; st.add(col);
  const layers = [["#6b6156", 0.45], ["#a3907a", 1.0], ["#c9b28e", 1.2], ["#d8c39c", 0.12]];
  let y0 = 1.6;
  layers.forEach(([c, h]) => { const m = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.97, 0.97, h, 48), new THREE.MeshStandardMaterial({ color: c, roughness: 1 }))); m.position.y = y0 + h / 2; y0 += h; st.add(m); });
  const bio = new THREE.Mesh(new THREE.CylinderGeometry(0.975, 0.975, 0.06, 48), new THREE.MeshStandardMaterial({ color: "#5d8c4f", roughness: 0.8 })); bio.position.y = y0 + 0.03; st.add(bio);
  const stW = new THREE.Mesh(new THREE.CylinderGeometry(0.96, 0.96, 0.35, 48), water); stW.position.y = y0 + 0.24; st.add(stW);
  const colLid = rbox(2.1, 0.1, 2.1, body); colLid.position.y = 5.42; st.add(colLid);
  const panel = rbox(2.4, 0.06, 1.4, new THREE.MeshStandardMaterial({ color: "#1d2a4a", roughness: 0.25, metalness: 0.4 })); panel.position.set(-2.1, 3.2, -0.4); panel.rotation.set(-0.5, 0.35, 0.15); st.add(panel);
  const pole = rbox(0.08, 3.1, 0.08, ink); pole.position.set(-2.1, 1.55, -0.4); st.add(pole);
  const store = shadowy(new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.65, 1.2, 40), body)); store.position.set(2.0, 0.6, 0.3); st.add(store);
  const tap = rbox(0.25, 0.12, 0.12, teal); tap.position.set(2.0, 0.35, 1.0); st.add(tap);
  st.userData = { h: 5.5, fallTop: 5.3, fallBot: 4.9, w: 0.7 };

  const models = { home, go, station: st };
  const holder = new THREE.Group();
  Object.values(models).forEach((m) => { m.visible = false; holder.add(m); });
  scene.add(holder);
  models.home.visible = true;

  /* ---------- water drops ---------- */
  const ND = 60;
  const drops = new THREE.InstancedMesh(new THREE.SphereGeometry(0.045, 8, 6), new THREE.MeshStandardMaterial({ color: "#3fa79c", roughness: 0.2, emissive: "#0b7a75", emissiveIntensity: 0.2 }), ND);
  holder.add(drops);
  const D = Array.from({ length: ND }, (_, i) => ({ u: Math.random(), x: (Math.random() - 0.5), z: (Math.random() - 0.5), s: 0.25 + Math.random() * 0.35 }));
  const m4 = new THREE.Matrix4(), q = new THREE.Quaternion(), v = new THREE.Vector3(), sc = new THREE.Vector3();

  // a drifting ring of droplets across the "need" chapter
  const NR = 220;
  const rain = new THREE.InstancedMesh(new THREE.SphereGeometry(0.035, 6, 5), new THREE.MeshStandardMaterial({ color: "#5fb7ae", roughness: 0.3, transparent: true, opacity: 0.8 }), NR);
  scene.add(rain);
  const R = Array.from({ length: NR }, () => ({ x: (Math.random() - 0.5) * 22, y: Math.random() * 9 - 1.6, z: -2 - Math.random() * 8, v: 0.4 + Math.random() * 0.8 }));

  let current = "home", swap = 1, yawS = 0;
  const look = new THREE.Vector3(0, 1.4, 0), ray = new THREE.Vector3(), dir = new THREE.Vector3();
  function boxWorld(st) {
    const b = window.Site?.aqua?.box?.(); if (!b) return null;
    const ndcX = (b.x / st.w) * 2 - 1, ndcY = -(b.y / st.h) * 2 + 1;
    ray.set(ndcX, ndcY, 0.5).unproject(camera); dir.copy(ray).sub(camera.position).normalize();
    const t = (0 - camera.position.z) / dir.z;
    const p = camera.position.clone().addScaledVector(dir, t);
    const visH = 2 * Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * Math.abs(camera.position.z);
    return { p, scale: (b.h / st.h) * visH };
  }

  return (state) => {
    const t = state.t, dt = state.dt, S = state.stage;
    const want = window.Site?.aqua?.proto || "home";
    // swap models with a quick shrink/grow
    if (want !== current) { swap -= dt * 5; if (swap <= 0) { models[current].visible = false; current = want; models[current].visible = true; swap = 0; } }
    else swap = Math.min(1, swap + dt * 4);
    const ease = 1 - Math.pow(1 - swap, 3);

    camera.position.set(state.px * 0.3, 1.0 - state.py * 0.2, 12);
    camera.lookAt(look);

    // where the model lives per chapter
    const m = models[current], H = m.userData.h;
    let px, py, s;
    const inProto = smooth(1.6, 2.1, S) * (1 - smooth(2.85, 3.1, S));
    const bw = inProto > 0.01 ? boxWorld(state) : null;
    if (state.mobile) { px = 1.45; py = 1.9; s = 0.3; }
    else { px = 3.6 - smooth(0.6, 1.4, S) * 7.4 + smooth(3.2, 4.0, S) * 7.4; py = -1.6; s = 0.62 - smooth(0.6, 1.4, S) * 0.12; }
    if (bw) { const k = (bw.scale * 0.82) / H; px = THREE.MathUtils.lerp(px, bw.p.x, inProto); py = THREE.MathUtils.lerp(py, bw.p.y - (H * k) / 2, inProto); s = THREE.MathUtils.lerp(s, k, inProto); }
    holder.position.set(px, py, 0);
    const present = Math.min(1, 1 - smooth(4.55, 4.95, S) + smooth(5.65, 6.0, S));
    holder.scale.setScalar(Math.max(0.0001, s * (0.6 + 0.4 * ease) * present));
    yawS += ((window.Site?.aqua?.yaw || 0) - yawS) * Math.min(1, dt * 6);
    holder.rotation.y = -0.5 + t * 0.15 + yawS + state.px * 0.2;

    // drops inside the current model
    const u = m.userData;
    for (let i = 0; i < ND; i++) {
      const d = D[i];
      d.u += dt * d.s; if (d.u > 1) d.u -= 1;
      v.set(d.x * u.w, u.fallTop + (u.fallBot - u.fallTop) * d.u, d.z * u.w);
      sc.setScalar(swap > 0.9 ? 1 : 0.0001);
      m4.compose(v, q, sc); drops.setMatrixAt(i, m4);
    }
    drops.instanceMatrix.needsUpdate = true;

    // rain field, strongest in "the need"
    const rainK = smooth(0.4, 1.0, S) * (1 - smooth(1.6, 2.2, S)) + 0.15;
    for (let i = 0; i < NR; i++) {
      const r = R[i];
      r.y -= r.v * dt; if (r.y < -1.6) r.y = 7.5;
      v.set(r.x, r.y, r.z); sc.setScalar(rainK);
      m4.compose(v, q, sc); rain.setMatrixAt(i, m4);
    }
    rain.instanceMatrix.needsUpdate = true;

    faceTex.needsUpdate = true;
    ring.material.emissiveIntensity = 0.25 + Math.sin(t * 2) * 0.15;
  };
}, { bg: "#e8e1d3", fog: [12, 40] });
