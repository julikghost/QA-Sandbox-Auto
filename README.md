# E2E tests (Playwright + TypeScript)

UI-автотесты для [QA Automation Sandbox](../qa-automation-sandbox) (BuzzHive).

## Stack

- Playwright Test
- TypeScript
- Page Object + Component Object
- API helpers для seed / cleanup
- Auth через `storageState` (setup-проекты)

## Prerequisites

1. Подняты frontend и backend sandbox:
   - UI: `http://localhost:3000`
   - API: `http://localhost:8000/api`
2. Node.js 18+

## Setup

```bash
cd e2etests
npm install
npx playwright install chromium
cp .env.example .env
```

Проверь `.env`: `BASE_URL`, `API_URL`, креды seed-пользователей (alice, frank и др.).

## Run

```bash
npm test                 # все тесты
npm run test:ui          # Playwright UI mode
npx playwright test login.spec.ts
npx playwright test --project=auth-ui
npx playwright test --project=chromium
npm run report           # HTML-отчёт
```

## Lint & format

```bash
npm run lint             # ESLint
npm run format           # Prettier write
npm run format:check     # Prettier check only
npm run check            # lint + format:check
```

Перед `git commit` автоматически вызывается husky-hook `.husky/pre-commit` → `npm run check`.  
После `npm install` хук ставится скриптом `prepare`.

Окончания строк: LF (см. `.gitattributes`, Prettier `endOfLine: "lf"`).

## Projects

| Project      | Назначение                                                         |
| ------------ | ------------------------------------------------------------------ |
| `auth-alice` | Логин alice через API → `playwright/.auth/auth-alice.json`         |
| `auth-admin` | То же для admin                                                    |
| `chromium`   | Тесты с `storageState` alice (feed и т.п.); **без** login/register |
| `auth-ui`    | login / register **без** storageState (чистая сессия)              |

## Structure

```
e2e/
  components/     # Sidebar и др.
  pages/          # Page Objects (Login, Register, Feed, Post…)
  setup/          # auth-*.setup.ts
  tests/          # *.spec.ts
  testdata/       # payloads, AUTH_ERRORS
  utils/api/      # login, posts, credentials from .env
playwright.config.ts
.env.example
```

## Conventions

- В тестах нет селекторов — только Page Object / Component.
- Повторяющийся setup → fixtures / setup-проекты / `storageState`.
- Seed данных предпочтительно через API (`createAlicePost` и т.п.).
- Уникальные пользователи для register → `buildRegisterPayload()`.
- Тексты auth-ошибок → `testdata/errors.ts` (`AUTH_ERRORS`).
- Login/register не используют alice `storageState`.

## Seed users (кратко)

| User  | Email                | Notes                          |
| ----- | -------------------- | ------------------------------ |
| alice | `alice@buzzhive.com` | основной UI-юзер, storageState |
| frank | `frank@buzzhive.com` | banned (`is_active=false`)     |
| admin | `admin@buzzhive.com` | админ                          |

Полный список — в `.env.example`.

## Notes

- Viewport `1280×720` — сайдбар виден с breakpoint `lg`.
- Сообщения в `auth-error-message` приходят из API на английском (локаль UI их не переводит).
