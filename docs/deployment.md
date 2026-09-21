# Публикация и обновление

Сайт: https://romans7997.github.io/danang-homii/

Репозиторий: https://github.com/RomanS7997/danang-homii

## Автоматическая публикация

Каждый push в `main` запускает `.github/workflows/pages.yml`: установка зависимостей из lock-файла, обычная сборка, проверки переводов и worker, сборка Pages, проверки путей и публикация `dist/client`. Pull request проходит проверки без публикации.

В Settings → Pages выбран источник GitHub Actions. Job публикации использует минимальные права `pages: write` и `id-token: write`; отдельные PAT и ключи в репозитории не нужны. Статус и журнал доступны во вкладке Actions.

```powershell
npm ci
npm run dev -- --host 127.0.0.1 --port 4173
```

Полный локальный цикл перед push:

```powershell
npm run build
npm run test:i18n
npm run test:sites
npm run build:pages
npm run test:pages
```

После изменений коммит и push в `main` запускают обновление. Для возврата к прошлой версии используйте `git revert` нужного коммита и обычный push; история сохраняется.

## Почему есть отдельная сборка Pages

GitHub Pages размещает проект под `/danang-homii/`. `vite.config.mjs` задаёт этот base в режиме `github-pages`, а `src/paths.js` применяет его к переходам и изображениям. CSS и HTML обрабатывает Vite. В workflow имя репозитория автоматически передаётся через `PAGES_BASE_PATH`.

Pages не имеет SPA rewrite-сервера: скрипт `prepare-pages-build.mjs` создаёт 42 HTML entry point для всех страниц на RU/EN/VI. Поэтому обновление страницы квартиры возвращает HTML с HTTP 200. Неизвестный путь получает `404.html` и экран 404 приложения. Это клиентский рендеринг, а не полноценный SSR.

Для отдельного домена или размещения в корне используйте базовый путь `/` и соответствующую конфигурацию Pages. DNS и пользовательский домен в этом проекте не настраивались.

Исходная сборка `npm run build` и файлы worker сохранены для размещения в корне на другой платформе. GitHub Pages их не исполняет.

## Источники конфигурации

- [Vite: GitHub Pages](https://vite.dev/guide/static-deploy.html#github-pages)
- [GitHub: custom Pages workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages)

Не коммитьте `.env`, токены и `node_modules`. Сборка `dist` создаётся CI. Исходники изображений и весь необходимый для воспроизведения код включены в репозиторий.
