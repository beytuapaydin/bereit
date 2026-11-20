// Bereit – Service Worker (generiert von build/build.js; nicht von Hand ändern)
const CACHE = "bereit-v153-knoten";
const PREFIX = "bereit-";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./img/prax/10_1-1.webp", "./img/prax/10_6-1.webp", "./img/prax/2_2-1.webp", "./img/prax/2_3-1.webp", "./img/prax/3_1-1.webp", "./img/prax/3_2-1.webp", "./img/prax/3_3-1.webp", "./img/prax/3_4-1.webp", "./img/prax/3_5-1.webp", "./img/prax/3_6-1.webp", "./img/prax/3_6-2.webp", "./img/prax/3_7-1.webp", "./img/prax/3_8-1.webp", "./img/prax/3_9-1.webp", "./img/prax/4_1-1.webp", "./img/prax/4_2-1.webp", "./img/prax/4_3-1.webp", "./img/prax/4_4-1.webp", "./img/prax/4_5-1.webp", "./img/prax/4_6-1.webp", "./img/prax/4_7-1.webp", "./img/prax/4_8-1.webp", "./img/prax/6_1_5-1.webp", "./img/prax/6_1_6-1.webp", "./img/prax/7_2-1.webp", "./img/prax/7_5-1.webp", "./img/prax/7_8-1.webp", "./img/prax/7_9-1.webp", "./img/prax/8_1-1.webp", "./img/prax/9_3-1.webp", "./data/funkrufnamen-ofra.json", "./icons/apple-touch-icon.png", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png", "./img/dev/motorsaege.svg", "./img/dev/stromerzeuger.svg", "./img/dev/steckleiter.svg", "./img/dev/trennschleifer.svg", "./img/dev/schlagbohrmaschine.svg", "./img/dev/motortrennschleifer.svg", "./img/dev/saebelsaege.svg", "./img/dev/zuggeraet.svg", "./img/dev/hebekissen.svg", "./img/dev/hebe_pressgeraet.svg", "./img/dev/brechstange.svg", "./img/dev/heber_und_winde.svg", "./img/dev/rettungsweste.svg", "./img/dev/tauchpumpe_strahlrohr.svg", "./img/dev/sandsaecke.svg", "./img/dev/rettungsschere.svg", "./img/dev/leuchtballon.svg", "./img/kn/leinen_verbinden.webp", "./img/kn/ende_sichern.webp", "./img/kn/wurf_vorbereiten.webp", "./img/kn/am_festpunkt.webp", "./img/kn/last_anschlagen.webp", "./img/kn/geraet_anbinden.webp", "./img/kn/hoelzer_verbinden.webp", "./img/kn/querholz_unter_last.webp", "./img/kn/steg_bauen.webp", "./img/kn/verstaerken.webp", "./img/kn/zweibock.webp", "./img/kn/dreibock.webp", "./img/kn18/mast.webp", "./img/kn18/acht.webp", "./img/kn18/doppel.webp", "./img/kn18/einf.webp", "./img/kn18/anker.webp", "./img/kn18/kreuz.webp", "./img/kn18/zimm.webp", "./img/kn18/hs.webp", "./img/kn18/dreib.webp", "./img/kn18/bock.webp", "./img/kn18/hint.webp", "./img/kn18/pal.webp", "./img/kn18/schl.webp", "./img/kn18/bret.webp", "./img/kn18/wurf.webp", "./img/kn18/wick.webp", "./img/kn18/sack.webp", "./img/kn18/hinth.webp"];
self.addEventListener("install", (e) => {
  // Jede Datei einzeln und am HTTP-Cache vorbei laden; eine fehlende Datei bricht die Installation nicht ab.
  e.waitUntil(caches.open(CACHE).then((c) => Promise.allSettled(FILES.map((f) => c.add(new Request(f, { cache: "reload" }))))).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  // Nur eigene Caches (Präfix "bereit-") aufräumen. Fremde Caches derselben Origin bleiben unberührt.
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith(PREFIX) && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
});
function sameOrigin(req) { return new URL(req.url).origin === location.origin; }
self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET" || !sameOrigin(req)) return;
  if (req.mode === "navigate" || req.destination === "document") {
    // Seiten: zuerst Netzwerk (neue Version sofort), bei Offline der Cache.
    e.respondWith(
      fetch(req).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put("./index.html", copy)); }
        return res;
      }).catch(() => caches.match("./index.html").then((hit) => hit || caches.match("./")))
    );
    return;
  }
  // Statische Dateien: aus dem Cache, im Hintergrund aktualisieren.
  e.respondWith(
    caches.match(req).then((hit) => {
      const net = fetch(req).then((res) => {
        if (res && res.ok) { const copy = res.clone(); caches.open(CACHE).then((c) => c.put(req, copy)); }
        return res;
      }).catch(() => hit);
      return hit || net;
    })
  );
});
self.addEventListener("message", (e) => { if (e.data === "skipWaiting") self.skipWaiting(); });
