const CACHE = "bereit-v98";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icons/icon-192.png", "./icons/icon-512.png", "./icons/maskable-512.png", "./icons/apple-touch-icon.png"];
self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", (e) => {
  // Nur eigene Caches (Präfix "bereit-") aufräumen, fremde Caches bleiben unberührt.
  e.waitUntil(caches.keys().then((ks) => Promise.all(ks.filter((k) => k.startsWith("bereit-") && k !== CACHE).map((k) => caches.delete(k)))).then(() => self.clients.claim()));
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
