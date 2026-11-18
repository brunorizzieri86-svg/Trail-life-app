/* TRAIL LIFE · © 2026 Bruno Rizzieri · TLSIG-6bqKOmYY-BR26 · build D0C7895CF4-261118 */const TL_SWA=[207022101,3233374865],TL_SWOK=(()=>{try{const n=String(self.location.hostname||'').toLowerCase().replace(/^www\./,'');if(!n||n==='localhost'||n==='127.0.0.1')return true;let x=2166136261;for(let i=0;i<n.length;i++){x^=n.charCodeAt(i);x=Math.imul(x,16777619)>>>0}return TL_SWA.includes(x>>>0)}catch(e){return false}})();
if(!TL_SWOK){self.addEventListener('install',()=>self.skipWaiting());self.addEventListener('activate',e=>e.waitUntil(self.registration.unregister()))}else{
/* TRAIL LIFE · Service Worker V.10.0
   Estratégia "rede primeiro": busca a versão nova quando há internet e usa o cache só offline.
   A versão nova espera o usuário tocar em "Atualizar agora" (mensagem SKIP_WAITING).
   Ao lançar uma versão: troque CACHE aqui e APP_VERSION em js/00-config.js. */
const CACHE='trail-life-v10.4.1';
const SHELL=[
  './','./index.html','./manifest.webmanifest','./offline.html',
  './css/app.css','./css/fase1.css','./css/aventura.css','./css/pro.css',
  './fonts/barlow-condensed-latin-700-normal.woff2','./fonts/barlow-condensed-latin-800-normal.woff2','./fonts/barlow-condensed-latin-800-italic.woff2','./fonts/barlow-condensed-latin-900-italic.woff2','./fonts/OFL-Barlow-Condensed.txt','./fonts/OFL-DM-Sans.txt','./fonts/OFL-Outfit.txt','./fonts/fontes.css',
  './fonts/dm-sans-latin-wght-normal.woff2','./fonts/dm-sans-latin-ext-wght-normal.woff2','./fonts/outfit-latin-wght-normal.woff2','./fonts/outfit-latin-ext-wght-normal.woff2',
  './js/00-config.js','./js/core.js','./js/01-upgrade.js','./js/02-hotfix.js','./js/03-backup.js','./js/04-final.js',
  './js/05-update.js','./js/06-protection.js','./js/lib-cifra.js','./js/07-cofre.js','./js/08-brand.js','./js/09-fixes-091.js','./js/10-pwa.js','./js/11-backup-plus.js','./js/13-aventura.js','./js/14-upgrade.js','./js/15-mais.js','./js/16-seguranca.js','./js/17-pro.js','./js/18-guarda.js','./js/12-forms-erros.js','./js/19-v104.js',
  './img/icon-192.png','./img/icon-512.png','./img/icon-maskable-512.png','./img/apple-touch-icon.png'
];

self.addEventListener('install',event=>{
  event.waitUntil((async()=>{
    const cache=await caches.open(CACHE);
    await cache.addAll(SHELL.map(u=>new Request(u,{cache:'reload'})));
    // Quem vem da prévia V.09.1 (cache "primeiro do cache") troca na hora,
    // senão a página antiga, sem faixa de atualização, ficaria presa.
    if(await caches.has('trail-life-v091'))await self.skipWaiting();
  })());
});

self.addEventListener('activate',event=>{
  event.waitUntil((async()=>{
    const keys=await caches.keys();
    await Promise.all(keys.filter(k=>k.startsWith('trail-life-')&&k!==CACHE).map(k=>caches.delete(k)));
    await self.clients.claim();
  })());
});

self.addEventListener('message',event=>{if(event.data&&event.data.type==='SKIP_WAITING')self.skipWaiting()});

self.addEventListener('fetch',event=>{
  const req=event.request;
  if(req.method!=='GET')return;
  const url=new URL(req.url);
  if(url.origin!==self.location.origin)return; // ViaCEP e outros serviços nunca vão para o cache
  event.respondWith((async()=>{
    try{
      const fresh=await fetch(req,{cache:'no-cache'});
      if(fresh&&fresh.ok&&fresh.type==='basic'){const copy=fresh.clone();caches.open(CACHE).then(c=>c.put(req,copy)).catch(()=>{})}
      return fresh;
    }catch(err){
      const cached=await caches.match(req,{ignoreSearch:req.mode==='navigate'});
      if(cached)return cached;
      if(req.mode==='navigate')return (await caches.match('./index.html'))||(await caches.match('./offline.html'));
      throw err;
    }
  })());
});

}
