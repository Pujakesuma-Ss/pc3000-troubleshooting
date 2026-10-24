const CACHE="pc3000-ai-shell-v1";
const ASSETS=["./","./index.html","./app.js","./manifest.webmanifest","./icon.svg"];
self.addEventListener("install",e=>e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ASSETS))));
self.addEventListener("activate",e=>e.waitUntil(caches.keys().then(keys=>Promise.all(keys.filter(k=>k!==CACHE).map(k=>caches.delete(k))))));
self.addEventListener("fetch",e=>{
 if(e.request.method!=="GET")return;
 const url=new URL(e.request.url);
 if(url.pathname.includes("/api/"))return;
 e.respondWith(caches.match(e.request).then(cached=>cached||fetch(e.request).then(res=>{
  if(res.ok && url.origin===location.origin){const copy=res.clone();caches.open(CACHE).then(c=>c.put(e.request,copy))}
  return res;
 })));
});