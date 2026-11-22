# UI-App

The React web application of the Food Delivery platform, written in plain JavaScript (ES6+). It is the
JavaScript version of `front-app` (the TypeScript application): the same screens, the same features, the same
API calls, the same look. It has four areas:

| Area     | Address                | Who                                                       |
| -------- | ---------------------- | --------------------------------------------------------- |
| Customer | `/customer` (also `/`) | anyone; cart, checkout and orders need a customer sign-in |
| Owner    | `/owner`               | a signed-in restaurant owner                              |
| Partner  | `/partner`             | a signed-in delivery partner (mobile-first)               |
| Admin    | `/admin`               | a signed-in platform administrator                        |

The application talks to the Spring Boot microservices only through the **API Gateway**
(`VITE_API_BASE_URL` in the `.env` files).

## Technology

| What                         | Used for                                                          |
| ---------------------------- | ----------------------------------------------------------------- |
| React 19                     | UI components                                                     |
| Vite 8                       | Dev server and builds (one build per environment)                 |
| Tailwind CSS 4               | Styling; the theme (colours, fonts) is in `src/index.css`         |
| React Router 8               | Pages and addresses (`src/App.jsx`)                               |
| TanStack Query (React Query) | Calling the APIs: loading, caching, errors (`src/hooks/api`)      |
| Redux Toolkit                | State that several pages share: who is signed in, list filters    |
| Axios                        | HTTP client, one instance (`src/api/axiosInstance.js`)            |
| React Hook Form + Zod        | Forms and their validation rules (`src/utils/validationUtils.js`) |
| Recharts                     | Dashboard charts                                                  |
| Leaflet / React Leaflet      | The live map of an order                                          |
| lucide-react                 | Icons                                                             |
| ESLint / Prettier            | Code quality / formatting                                         |
| Vitest / Testing Library     | Tests (`*.test.js`, `*.test.jsx`, next to the code they test)     |

There is **no TypeScript**: no `.ts` files, no `tsconfig`, no type packages. `jsconfig.json` only tells the editor
that `@/` means `src/` (so "go to definition" and auto-imports work).

## Running it

Prerequisites: Node.js 22.12 or newer, and the platform running (its API Gateway on `http://localhost:8080`).

```powershell
cd ui-app
npm install     # first time
npm run dev     # http://localhost:5180  ->  the customer home (/customer); the admin area is /admin
```

The dev server uses port 5180 because the API Gateway allows that origin (CORS). `front-app` uses the same port,
so run one of the two at a time.

| Command              | What it does                                                                    |
| -------------------- | ------------------------------------------------------------------------------- |
| `npm run dev`        | Development server with hot reload (reads `.env` + `.env.development`)          |
| `npm run build`      | Production build into `dist/` (`.env` + `.env.production`)                      |
| `npm run build:demo` | Build for the demo environment (`.env.demo`); also `build:uat`, `build:preprod` |
| `npm run preview`    | Serves the last build on http://localhost:4173                                  |
| `npm run lint`       | ESLint (`npm run lint:fix` fixes what it can)                                   |
| `npm run format`     | Prettier formats every file (`format:check` only checks)                        |
| `npm test`           | Runs all tests once (`npm run test:watch` re-runs them as you edit)             |
| `npm run verify`     | lint + format check + tests + build: what to run before a commit                |

### Environments

Settings come from the `.env` files (only variables starting with `VITE_` reach the browser):

- `.env`: shared by every environment (feature flags, timeout, map tiles).
- `.env.development`, `.env.demo`, `.env.uat`, `.env.preprod`, `.env.production`: one per environment, each
  sets `VITE_APP_ENV` and `VITE_API_BASE_URL`.
- `.env.local` / `.env.development.local`: your personal overrides, never committed.

The code never reads `import.meta.env` directly: `src/utils/env.js` reads every setting once and checks it. A
missing setting shows a configuration error page instead of a broken application.

## Project structure

```
src/
  main.jsx            Starts React: providers (theme, Redux, React Query, toasts, router) around <App />
  App.jsx             Every page and its address (React Router); pages load lazily
  index.css           Tailwind CSS and the theme: colours, fonts, dark mode, animations
  api/                Talking to the API Gateway: axios instance, apiClient, errors (ApiError), access tokens
  services/           One file per backend service: the API calls (orderService.getOrder(id), ...)
  hooks/api/          React Query hooks the pages use (useOrders(), useCancelOrder(), ...)
  hooks/              Other reusable hooks (useDebounce, useMediaQuery, useQueryParams, ...)
  store/              Redux: who is signed in (sessionSlice) and the filters/page of each admin list
  context/            React Context for UI state: toasts, the mobile sidebar, live location
  realtime/           Live updates over a WebSocket (orders, deliveries change without a refresh)
  layouts/            The frame of each area: headers, sidebar, account menus, "sign in first" guards
  pages/              One folder per screen group; a page puts components together and loads data
  components/common/    Reusable building blocks: Button, Input, Select, Modal, Table, Pagination, ...
  components/business/  Components of one feature: Cart, Checkout, Order, Food, Delivery, Chat, ...
  utils/              Pure helpers: constants (ROUTES), formatting, dates, validation rules, ...
  types/              The allowed values of the API's data: ORDER_STATUSES, USER_ROLES, VEHICLE_TYPES, ...
  theme/              Light / dark theme (saved in localStorage)
  test/               Helpers for the tests (render with providers, fixtures)
public/               Static files: favicon, images of foods and categories
```

### How a screen gets its data

1. A **page** (for example `pages/Order/OrderListPage.jsx`) calls a hook: `useOrders(filters, page, size)`.
2. The **hook** (`hooks/api/orderHooks.js`) is a React Query `useQuery` that calls a service and caches the answer.
3. The **service** (`services/orderService.js`) builds the URL (`utils/apiEndpoints.js`) and calls `apiClient`.
4. **apiClient** (`api/apiClient.js`) uses the one Axios instance, which adds the access token and turns every
   failure into an `ApiError` (`api/apiErrorHandler.js`) with a message the screen can show.

Changes (create, update, delete) use `useMutation` in the same hook files and then tell React Query which cached
data is now out of date, so every screen refreshes itself.

### State

- **Server data** (orders, restaurants, ...) lives in React Query: nothing is copied into Redux.
- **Redux** keeps only what several pages share and that must survive navigation: who is signed in to each
  area (`store/slices/sessionSlice.js`) and the filters and page of every admin list (`createListSlice.js`).
- **Context** holds UI state: toasts (`context/ToastProvider.jsx`), the mobile sidebar, the partner's live location.
- A component's own state (an open dialog, a typed value) stays in the component with `useState`.

### Routing

Every address is a constant in `src/utils/constants.js` (`ROUTES`, `CUSTOMER_ROUTES`, `OWNER_ROUTES`,
`PARTNER_ROUTES`); `src/App.jsx` maps them to pages. Pages that need a signed-in person sit under a guard
(`RequireCustomer`, `RequireOwner`, `RequirePartner`, `RequireAdmin`) that sends visitors to the sign-in page.

### Forms, validation and errors

- Forms use React Hook Form; their rules are Zod schemas in `src/utils/validationUtils.js`, shared by every
  form so the browser rejects a bad value before it is sent (the server still checks everything).
- A refusal from the server (400 with field errors, 409 conflict, ...) is shown on the field it is about by
  `showServerErrors()` and as a message above the form.
- Every API failure is an `ApiError` with a `userMessage`; pages show it with `<ErrorMessage />` or a toast.
- `ErrorBoundary` (around the whole application and around each page) shows a message instead of a blank page
  when a component crashes.

### Styling and responsive design

Tailwind CSS 4 utility classes, with the theme (colour tokens such as `brand-500`, fonts, dark mode) defined in
`src/index.css`. Layouts are mobile-first: the admin sidebar collapses into a drawer on small screens, the
partner area has a bottom tab bar on phones, and tables scroll horizontally when narrow.

## Tests

The tests of `front-app` were brought over too (they run without TypeScript). They render pages with fake API
answers and check what the screen shows and sends, so they are a safety net when you change something:

```powershell
npm test
```

## Differences from front-app

- Every `.ts` / `.tsx` file became a `.js` / `.jsx` file with the same name and the same code, minus the types.
- Files of `src/types/` that held only types are gone; the ones that also hold lists of allowed values
  (`ORDER_STATUSES`, `USER_ROLES`, ...) stay, because the code uses them.
- `npm run build` no longer runs a type check first: ESLint (`npm run lint`) and the tests are the checks.
