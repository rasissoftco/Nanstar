//sw version
const Version = '1.0';

//static cache - app shell
const appAssets = ['about.html', 'bannerSliderTcdy.html', 'BestSellTCDY.html', 'contact.html', 'index.html',
    'LatestTCDY.html', 'Layout.html', 'LoadLayout.js', 'search.html', 'style.css', 'tcdyList.html',
    'images/logo.png'];

//sw install
self.addEventListener('install', e => {
    e.waitUntil(caches.open(`static-${Version}`).then(cache => cache.addAll(appAssets))
    );
})

//sw activate
self.addEventListener('activate', e => {
    //clean static cache
    let cleaned = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== `static-${Version}` && key.match('static-')) {
                return caches.delete(key);
            }
        });
    });
    e.waitUntil(cleaned);
})

//static cache strategy - cache with network fallback
const staticCache = (req) => {
    return caches.match(req).then(cachedRes => {
        //return cached response if found
        if (cachedRes) return cachedRes;

        //fallback to network
        return fetch(req).then(networkRes => {
            //update cache with response
            caches.open(`static-${Version}`).then(cache => cache.put(req, networkRes));

            //return clone of network response
            return networkRes.clone();
        });
    });
};

//sw fetch
self.addEventListener('fetch', e => {
    //app shell
    if (e.request.url.match(location.origin)) {
        e.respondWith(staticCache(e.request));
    }
});

