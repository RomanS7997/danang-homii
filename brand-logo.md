# Дом и волна — градиентная версия

Режим: встроенный ImageGen, редактирование выбранного знака. Пользователь выбрал вариант 02 и попросил больше цвета в стиле иллюстраций сайта.

Референсы: выбранный концепт `../homii-logo-options/02-coastal-home.png` — форма знака; `public/assets/glass-keys-v2.png` — материал и палитра.

## Файлы и подключение

- `public/assets/brandmark-coastal-gradient.png` — оригинальная генерация, 1254 × 1254, PNG с прозрачностью.
- `public/assets/brandmark-coastal-gradient.webp` — версия 256 × 256 для шапки и подвала, 20 874 байта.
- `public/assets/favicon-coastal.png` — значок вкладки 64 × 64.
- `src/brand.css` — размеры знака на компьютере и телефоне. Название Danang Homii остаётся живым текстом.

Оптимизированные файлы получены изменением размера и кодированием исходного PNG; форма и цвета знака не перерисовывались кодом.

## Проверка

Сборка `npm run build` успешна. Проверены шапка и тёмный подвал на компьютере, мобильная шапка на ширинах 390 и 320 px, подвал на 320 px. Новый WebP загрузился в обоих местах, горизонтального переполнения нет, значок вкладки подключён. В консоли браузера ошибок не было. Карта при этом использовала предусмотренный OSM fallback; её код в этой итерации не менялся. Скриншоты приложены в `preview/logo/` в папке с готовым кодом.

## Точный промпт

Use case: precise-object-edit / logo-brand.
Asset type: production-ready isolated website logo SYMBOL, PNG with genuine transparent alpha, square 1024x1024.
Inputs: Image 1 is the selected logo design reference and edit target: the "home and wave" symbol at the left of the large Danang Homii wordmark. Preserve that exact symbol's identity and recognizable silhouette. Image 2 is MATERIAL AND COLOR reference only: sapphire-blue glass and warm gold keys from the site's illustration series. Do not include any keys, ribbon backgrounds, lettering or other objects from either reference.
Request: extract and refine ONE standalone home-and-wave symbol. Preserve the upper roof arch, circular curling lower wave, and small inner champagne crescent; preserve their spatial relationship, broad clear strokes and open negative-space separations. Keep the approved design, do not invent a new logo.
Change its finish to a richer luminous blue-and-gold gradient treatment that belongs to the provided glass-and-gold illustration. The roof transitions from deep navy into cobalt with a restrained champagne-gold highlight toward its upper right edge. The main curling wave has bold sapphire/cobalt blue through lighter clear blue highlights, smoothly deepening to navy at its lower edge; add a delicate warm gold reflected edge near the inner curl. The small inner crescent is amber/champagne-gold with a pale ivory highlight. Refined shallow bevels and a restrained glass-like depth, front-on, not an extruded 3D object. Color should feel rich and luminous, much more alive than a flat corporate logo, but remain perfectly legible as a small header mark.
Composition: ONE symbol only centered, straight-on, approximately 86% of canvas width and height, evenly balanced small transparent margins. Do not place the symbol inside a square, circle, plaque, app-icon tile or any backdrop.
Output constraints: true transparent alpha outside symbol and in all interior gaps, crisp clean edges, no glow halos, no drop shadow, no cast shadow, no background color, no floor, no haze. No typography, no wordmark, no letters, no label, no board, no additional miniature logo versions, no watermark. Preserve broad silhouette and avoid tiny fussy lines. The dark navy and pale cream UI backgrounds must show through all negative space.
