// 只服務 ./app/ 底下：內容來自密碼解密後存進本機 Cache Storage 的檔案
const CACHE = 'lantern-run-app-v1'
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()))
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url)
  const scope = new URL('./app/', self.registration.scope.replace(/app\/$/, '')).pathname
  if (url.origin !== location.origin || !url.pathname.startsWith(scope)) return
  e.respondWith((async () => {
    const cache = await caches.open(CACHE)
    let p = url.pathname; if (p.endsWith('/')) p += 'index.html'
    const hit = await cache.match(new URL(p, location.origin).href)
    if (hit) return hit
    if (e.request.mode === 'navigate') return Response.redirect(new URL('../', new URL(scope, location.origin)).href, 302)
    return new Response('Not found', { status: 404 })
  })())
})
