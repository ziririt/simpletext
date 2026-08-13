const CACHE = 'simpletext-v0.1.7.1';
// 글꼴 core는 미리 받아 둔다. 오프라인에서 표가 어긋나 보이면 안 되기 때문이다.
// cjk(가나·한자)는 실제로 그런 글자를 쓸 때만 받아서 캐시한다(아래 fetch 핸들러가 저장).
const ASSETS = ['./', 'index.html', 'manifest.json', 'icon-192.png', 'icon-512.png', 'icon-180.png',
  'fonts/D2Coding-core.ttf'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(m => m || caches.match('index.html')))
  );
});
