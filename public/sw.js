const CACHE_PREFIX = `cinemaaddict-cache`;
const CACHE_VER = `v1`;
const CACHE_NAME = `${CACHE_PREFIX}-${CACHE_VER}`;

self.addEventListener(`install`, (evt) => {
  evt.waitUntil(
      caches.open(CACHE_NAME)
        .then((cache) => {
          return cache.addAll([
            `/`,
            `/index.html`,
            `/bundle.js`,
            `/css/normalize.css`,
            `/css/main.css`,
            `/images/emoji/angry.png`,
            `/images/emoji/puke.png`,
            `/images/emoji/sleeping.png`,
            `/images/emoji/smile.png`,
            `/images/icons/icon-favorite-active.svg`,
            `/images/icons/icon-favorite.svg`,
            `/images/icons/icon-watched-active.svg`,
            `/images/icons/icon-watched.svg`,
            `/images/icons/icon-watchlist-active.svg`,
            `/images/icons/icon-watchlist.svg`,
            `/images/background.png`,
            `/images/bitmap.png`,
            `/images/bitmap@2x.png`,
            `/images/bitmap@3x.png`
          ]);
        })
  );
});

self.addEventListener(`activate`, (evt) => {
  evt.waitUntil(
      // Получаем все названия кэшей
      caches.keys()
        .then(
            // Перебираем их и составляем набор промисов на удаление
            (keys) => Promise.all(
                keys.map(
                    (key) => {
                      // Удаляем только те кэши,
                      // которые начинаются с нашего префикса,
                      // но не совпадают по версии
                      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) {
                        return caches.delete(key);
                      }

                      // Остальные не обрабатываем
                      return null;
                    })
                  .filter((key) => key !== null)
            )
        )
  );
});

self.addEventListener(`fetch`, (evt) => {
  const {request} = evt;

  evt.respondWith(
      caches.match(request)
        .then((cacheResponse) => {
          // Если в кэше нашёлся ответ на запрос (request),
          // возвращаем его (cacheResponse) вместо запроса к серверу
          if (cacheResponse) {
            return cacheResponse;
          }

          // Если в кэше не нашёлся ответ,
          // повторно вызываем fetch
          // с тем же запросом (request),
          // и возвращаем его
          return fetch(request)
            .then((response) => {
              // Оригинал передаём дальше
              return response;
            });
        })
  );
});
