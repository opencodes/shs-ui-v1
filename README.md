# Shubhe (Utsav Connect) — Web Frontend

React + Vite web app for **Shubhe**, a wedding and celebration platform for North India (Mithila / Bihar–focused). It serves three audiences on the public site, plus two **complete workspaces** you can mirror in native mobile apps:

| Audience | Web entry | Workspace |
|----------|-----------|-----------|
| Families & guests | Public website | Browse vendors, food, portfolio |
| **Vendors** | `/sign-in` (vendor) → `/profile` | Listing, services, enquiries, settings |
| **Event planners** | `/event-planner/register` or `/sign-in` → `/admin` | Full planning suite (guests, feast, budget, …) |

Backend API: [`subhehesubhe-backend-php-master`](../subhehesubhe-backend-php-master/README.md) (PHP + MongoDB). This README is the feature map for **website + vendor + planner** flows and the API contracts to reuse in **vendor** and **event planner** mobile apps.

---

## Tech stack

- **React 19**, **TypeScript**, **Vite 6**, **Tailwind CSS 4**
- **Motion** (animations), **Lucide** icons
- **History API** routing (`src/routing.ts`) — no React Router
- API client: `src/api/*` → `VITE_API_BASE_URL` (default `http://localhost:8080/api/v1`)

---

## Run locally

**Prerequisites:** Node.js 18+, running [PHP API](../subhehesubhe-backend-php-master/README.md) on port 8080.

```bash
cd utsav-connect-master
npm install
cp .env.example .env.local
# Set VITE_API_BASE_URL=http://localhost:8080/api/v1
npm run dev
```

App: **http://localhost:4000**

| Command | Purpose |
|---------|---------|
| `npm run dev` | Dev server (port 4000) |
| `npm run build` | Production build → `dist/` |
| `npm run lint` | TypeScript check |

---

## Public website (customer & discovery)

Marketing and discovery for families planning weddings, pujas, and receptions.

### Home & discovery

| Route | Feature |
|-------|---------|
| `/` | Landing: hero event search, vendor categories, food categories, featured offers, popular restaurants, how-it-works |
| `/vendors/categories?city=` | Browse vendor categories by city |
| `/vendors?city=&category=&q=` | Vendor search and filters |
| `/vendors/{id}` | Vendor detail: profile, services, reviews, **send enquiry** |
| `/restaurants` | Restaurant listing (veg filter, cuisine) |
| `/restaurants/{id}` | Menu, add to cart, sticky cart footer |
| `/cart` | Cart and checkout (orders API) |
| `/portfolio` | Planned events showcase (API-backed) |
| `/events?event=&location=&date=&type=` | Celebrations / planned events view |

### Account & onboarding

| Route | Feature |
|-------|---------|
| `/sign-in` | Customer (event planner) or **vendor** sign-in (phone + email) |
| `/profile` | Customer profile **or** vendor dashboard (if vendor signed in) |
| `/account` | Customer account settings |
| `/list-your-service` | **Vendor registration** (3-step form → `pending_review`) |
| `/event-planner/register` | **Event planner registration** + optional draft event from homepage |

### Static / legal

`/about`, `/contact`, `/how-it-works`, `/terms`, `/privacy`, `/cancellation`

### Platform operations (not mobile targets)

| Route | Role |
|-------|------|
| `/platform/sign-in` | Root / admin username + password |
| `/admin` | Commerce admin **or** event planner workspace (by JWT role) |
| `/root` | Root console — manage admin users |

---

## Vendor workspace (complete)

**Sign-in:** `POST /api/v1/auth/vendor/sign-in` with `phone`, `email` (optional `vendorId`, `businessName`, `contactName`).

**Web UI:** `/profile` when `isVendorLoggedIn` — implemented in `src/components/web/VendorProfilePage.tsx`.

### Tabs & capabilities

| Tab | Features |
|-----|----------|
| **Overview** | Listing status, stats (new enquiries, services count), quick actions, recent enquiries, preview public listing |
| **Enquiries** | List customer enquiries; statuses: `New`, `Replied`, `Booked`, `Closed` |
| **Services** | Add packages: name, description, price, category, image (upload → data URL); categories from listing |
| **Settings** | Business photo, address (line1/2, landmark, pin, **state/district** India selectors), villages served, save profile |

### Registration (before approval)

`POST /api/v1/vendors/register` — multi-step form at `/list-your-service`:

- Business name, category, years in business
- Contact, phone, email, state/district, description, website, GST
- Listing stays **hidden** until admin sets `status: approved`

### Vendor API (mobile reference)

| Method | Path | Auth | Use in mobile app |
|--------|------|------|-------------------|
| POST | `/auth/vendor/sign-in` | — | Login |
| GET | `/auth/me` | Bearer | Session / `vendorId` |
| GET | `/vendors/{id}` | — | Public listing detail |
| GET | `/vendors/{id}/enquiries` | Bearer | Enquiry inbox |
| PATCH | `/vendors/{id}` | Bearer | Update profile & address |
| POST | `/vendors/{id}/services` | Bearer | Add service |
| POST | `/vendors/register` | — | Onboarding (pre-token) |

**Enquiry payload (customer → vendor):** `guestName`, `eventType`, `eventDate`, `guests`, `message`.

**Profile update payload:** `addressLine1`, `addressLine2`, `landmark`, `pinCode`, `state`, `district`, `primaryLocation`, `villagesServed[]`, `image`.

**Service payload:** `name`, `description`, `price`, `category`, `image`.

**Client code:** `src/api/vendors.ts`, `src/api/auth.ts`.

### Suggested mobile screens (vendor app)

1. Splash / onboarding  
2. Sign in (phone + email)  
3. Registration wizard (if no listing)  
4. Dashboard (overview stats)  
5. Enquiry list + detail  
6. Service list + add/edit service  
7. Profile & address settings  
8. Public listing preview (read-only web view or native)

---

## Event planner workspace (complete)

**Register:** `POST /api/v1/auth/register/planner` — `/event-planner/register`.

**Sign-in:** `POST /api/v1/auth/sign-in` with `customerType: "event-planner"` (web sign-in page uses this for the customer tab).

**Web UI:** `/admin` when user has `customerType: event-planner` — sidebar in `src/components/Admin/Sidebar/AdminSidebar.tsx`, modules under `src/components/Planner*.tsx`.

Data is stored in **localStorage** keys (`src/plannerStorage.ts`) and **debounced-synced** to the API when a Bearer token exists (`PUT /api/v1/planner/workspace`). On sign-in, call `GET /api/v1/planner/workspace` and hydrate local storage (`hydratePlannerFromApi`).

### Planner modules

| Sidebar tab | Component | Features |
|-------------|-----------|----------|
| **Dashboard** | `PlannerDashboard.tsx` | Active event, countdown, guest RSVP summary, sub-events/rituals/vendor/feast counts, budget spent vs limit, quick links |
| **Event details** | `PlannerEvents.tsx` | Multiple events; set active event; sub-events (name, time, venue, notes); rituals (name, duration, linked sub-event) |
| **Guests & RSVP** | `PlannerGuests.tsx` | Guest CRUD: name, gender, age, family count, contact, group (bride/groom/villagers/VIP/friends), RSVP, room, return gift + status, notes; search/filter; estimated uninvited villagers & relatives |
| **Feast & catering** | `PlannerFeast.tsx` | Per-day meal plans (date, meal type, expected guests); menu items with ingredient ratios (paneer, rice, ghee, flour, sugar, milk/yogurt, spices); procurement totals |
| **Vendors** | `PlannerVendors.tsx` | Local vendor contracts (kirana, milk, halwai, tent, etc.): pricing, advance, contact, payment status |
| **Budget & expenses** | `PlannerBudget.tsx` | Master budget limit; expenses by category with paid/pending, date, beneficiary |
| **Chuman (gifts)** | `PlannerChuman.tsx` | Gifts given to guests: cash or physical item, value, date, notes |
| **Inventory** | `PlannerInventory.tsx` | **Misc** supplies; **Bartan** (utensils borrowed/returned); **Gas cylinders** (vendor, qty, price, payment/return status) |

### Planner workspace JSON schema (API body)

Single document at `GET|PUT /api/v1/planner/workspace`:

```json
{
  "events": [],
  "subEvents": [],
  "rituals": [],
  "guests": [],
  "vendors": [],
  "feast": [],
  "misc": [],
  "bartan": [],
  "cylinders": [],
  "expenses": [],
  "chuman": [],
  "budgetLimit": 0,
  "estVillagers": 0,
  "estRelatives": 0
}
```

**localStorage keys** (same shapes): `utsav_planner_*` — see `PLANNER_STORAGE_KEYS` in `src/plannerStorage.ts`.

**Client code:** `src/api/planner.ts`, `src/plannerStorage.ts`.

### Planner API (mobile reference)

| Method | Path | Auth | Use in mobile app |
|--------|------|------|-------------------|
| POST | `/auth/register/planner` | — | Sign up |
| POST | `/auth/sign-in` | — | Login (`customerType: event-planner`) |
| GET | `/auth/me` | Bearer | Session |
| GET | `/planner/workspace` | Bearer | Load all planner data |
| PUT | `/planner/workspace` | Bearer | Save full workspace (prefer debounced bulk save) |

### Suggested mobile screens (event planner app)

1. Onboarding / register (with optional draft event)  
2. Sign in  
3. Planner home (dashboard)  
4. Events & timeline (events + sub-events + rituals)  
5. Guest list (RSVP, filters, room/gift tracking)  
6. Feast planner (menus + shopping list)  
7. Vendor contracts  
8. Budget & expenses  
9. Chuman ledger  
10. Inventory (misc / bartan / cylinders)  
11. Settings / sync status

---

## Authentication summary (mobile)

| Role | Sign-in endpoint | JWT `role` | Token storage (web) |
|------|------------------|------------|---------------------|
| Event planner | `POST /auth/sign-in` + `customerType: event-planner` | `customer` | `localStorage` key `utsav.api.token` |
| Vendor | `POST /auth/vendor/sign-in` | `vendor` | Same |
| Platform admin | `POST /auth/platform/sign-in` | `admin` / `root` | Same |

All authenticated requests:

```http
Authorization: Bearer <token>
```

**Mobile recommendation:** use secure platform storage (Keychain / Keystore), not plain `localStorage`. Reuse the same endpoints and payloads as `src/api/client.ts`.

---

## URL routes (quick reference)

| Path | Page |
|------|------|
| `/` | Landing |
| `/vendors`, `/vendors/categories`, `/vendors/{id}` | Vendor discovery |
| `/restaurants`, `/restaurants/{id}` | Food ordering |
| `/cart` | Cart |
| `/sign-in` | Vendor or planner sign-in |
| `/profile` | Vendor workspace |
| `/event-planner/register` | Planner registration |
| `/admin` | Planner workspace (planner JWT) or platform admin |
| `/list-your-service` | Vendor registration |

Full routing logic: `src/routing.ts`.

---

## Project structure (relevant paths)

```
src/
  api/              # HTTP client + auth, vendors, planner, orders, …
  components/
    web/            # Public site + VendorProfilePage
    Planner*.tsx    # Event planner workspace modules
    Admin/          # Platform admin (commerce)
  plannerStorage.ts # Planner persistence + API sync
  routing.ts        # Paths ↔ page ids
  types.ts          # Shared TS types
```

---

## Backend & seed data

1. Start API: see [backend README](../subhehesubhe-backend-php-master/README.md).  
2. Set `VITE_API_BASE_URL` in `.env.local`.  
3. Optional: `composer seed` in backend for demo restaurants/vendors.

Full API table (orders, admin, catalog): backend README **API reference** section.

---

## Notes for mobile parity

- **Vendor enquiries:** Web lists enquiries; status updates may be UI-only today — confirm backend support before implementing reply/status in mobile.  
- **Planner sync:** Web writes to localStorage first, then PUT workspace after ~900ms debounce. Mobile can PUT on each save or use the same debounce pattern.  
- **Images:** Vendor services/profile use client-side image read as data URLs on web; mobile should upload URLs or multipart if you add server upload later.  
- **India locations:** State/district slugs align with `src/data/india-states-districts.json` and `src/indiaLocations.ts`.  
- **Brand:** UI name `Shubhe` (`src/brand.ts`), support `care@shubhe.in`.

---

## Related repositories

| Repo | Role |
|------|------|
| `utsav-connect-master` (this) | React web — reference UI for mobile |
| `subhehesubhe-backend-php-master` | REST API + MongoDB |

When adding mobile features, treat this README plus the backend API table as the contract; mirror screen flows from `VendorProfilePage` and `Planner*` components.
