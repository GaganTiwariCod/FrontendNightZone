# 🪔 Shubhkaal Frontend (WebNightZone) — Master Documentation

Premium, state-of-the-art Web Application for **Shubhkaal** (Sanatan Community Hub, Matrimony, Verified Pandit Directory, Spiritual Wisdom CMS, Vedic Astrology & Kundli, Local Updates & News, and Spiritual Events & Meetups).

Built with **React 18**, **Vite**, **Tailwind CSS**, and **Axios**.

---

## 📑 Table of Contents

1. [Architecture & Screen Flow](#1-architecture--screen-flow)
2. [State Management & Routing (`AuthContext`)](#2-state-management--routing-authcontext)
3. [Frontend Service Modules](#3-frontend-service-modules)
   - [1. Authentication & User Profile](#1-authentication--user-profile)
   - [2. Matrimony Hub & Onboarding Wizard](#2-matrimony-hub--onboarding-wizard)
   - [3. Verified Pandit Directory & Booking](#3-verified-pandit-directory--booking)
   - [4. Spiritual / Dharmik Content CMS](#4-spiritual--dharmik-content-cms)
   - [5. Vedic Astrology & Kundli 36-Guna Matching](#5-vedic-astrology--kundli-36-guna-matching)
   - [6. Local Updates & News Aggregator](#6-local-updates--news-aggregator)
   - [7. Spiritual Events & Connected Meetups](#7-spiritual-events--connected-meetups)
   - [8. Service Tiles & Coming Soon Handling](#8-service-tiles--coming-soon-handling)
4. [API Client Layer & Request Payloads](#4-api-client-layer--request-payloads)
5. [Installation, Development & Build](#5-installation-development--build)

---

## 1. Architecture & Screen Flow

```
                               ┌───────────────────────────┐
                               │   App.jsx (MainLayout)    │
                               └─────────────┬─────────────┘
                                             │
               ┌─────────────────────────────┼─────────────────────────────┐
               ▼                             ▼                             ▼
       Header Navigation             Dynamic Screen View             Footer & Mobile Tabbar
   (Search, City, User Menu)     (Driven by `currentScreen`)       (Quick links & Nav)
                                             │
   ┌───────────────────┬─────────────────────┼───────────────────┬─────────────────────┐
   ▼                   ▼                     ▼                   ▼                     ▼
Dashboard / Tiles   Matrimony Hub       Pandit Directory    Spiritual CMS         Astrology Portal
('dashboard')       ('matrimony')       ('pandit-directory')('spiritual')         ('astrology')
   │                   │                     │                   │                     │
   ▼                   ▼                     ▼                   ▼                     ▼
Local Updates Feed  Events Discovery    Host Wizard         Organizer Portal      Admin Consoles
('local-updates')   ('events')          ('event-create')    ('organizer-events')  ('admin-*')
```

---

## 2. State Management & Routing (`AuthContext`)

The application utilizes a centralized React Context (`src/context/AuthContext.jsx`) for seamless state and screen orchestration without page reloads:

### Core Context State
- `user`: Authenticated user profile (ID, name, email, avatar, role `CUSTOMER`/`ADMIN`).
- `accessToken`: JWT Bearer token stored in `localStorage`.
- `currentScreen`: Active screen identifier:
  - `'dashboard'` — Home page with Panchang banner, service tiles, and community bands.
  - `'auth'` — Sign in, registration, and OTP verification modal.
  - `'matrimony'`, `'matrimony-wizard'`, `'matrimony-preview'`, `'matrimony-browse'`, `'matrimony-admin'`
  - `'pandit-directory'`, `'pandit-profile'`, `'pandit-wizard'`, `'pandit-admin'`
  - `'spiritual'`, `'spiritual-detail'`, `'spiritual-admin'`
  - `'astrology'`, `'astrology-dashboard'`, `'astrology-kundli'`, `'astrology-matching'`, `'astrologer-directory'`, `'astrologer-profile'`, `'astrologer-wizard'`, `'consultation-room'`, `'astrology-admin'`
  - `'local-updates'`, `'local-updates-detail'`, `'admin-news'`
  - `'events'`, `'event-detail'`, `'event-create'`, `'organizer-events'`, `'admin-events'`
- `showToast(message, type)`: Global toast feedback notification system (`success`, `error`, `info`, `warning`).

---

## 3. Frontend Service Modules

### 1. Authentication & User Profile
- **Component**: `src/components/AuthScreen.jsx`
- **Features**:
  - Email/Password login and account registration.
  - 6-digit Email OTP instant verification.
  - One-click Google OAuth 2.0 social login.
  - Automatic session restore on browser refresh.

### 2. Matrimony Hub & Onboarding Wizard
- **Components**: `src/components/matrimony/`
  - `MatrimonyDashboard.jsx`: Profile overview, verification badge, and match recommendations.
  - `MatrimonyOnboardingWizard.jsx`: 5-step wizard (Basic Info -> Religion & Gotra -> Education & Career -> Family Details -> Partner Preferences).
  - `MatrimonyBrowseProfiles.jsx`: Search directory with filters (Age, Height, Gotra, City, Education, Manglik).
  - `MatrimonyProfilePreview.jsx`: Confidential biodata viewer with photo gallery.
  - `MatrimonyAdminModeration.jsx`: Profile verification and photo moderation.

### 3. Verified Pandit Directory & Booking
- **Components**: `src/components/pandit/`
  - `PanditDirectory.jsx`: Verified Vedic priests directory filtered by City, Language, and Vedic Tradition.
  - `PanditProfileDetail.jsx`: Profile page with pooja list, experience, and booking modal.
  - `PanditRegistrationWizard.jsx`: Multi-step registration for Acharyas and Pandits.
  - `PanditAdminModeration.jsx`: Verification approval console.

### 4. Spiritual / Dharmik Content CMS
- **Components**: `src/components/spiritual/`
  - `SpiritualPortal.jsx`: Sacred portal with tabs for Pooja Vidhi, Katha, Mantra, Aarti, Stotra, Chalisa, Vrat, and Festivals.
  - `SpiritualContentDetail.jsx`: High-contrast reader with live language switcher (`Hindi`, `Marathi`, `English`).
  - `SpiritualAdminDashboard.jsx`: Content management console for editing and publishing scriptures.

### 5. Vedic Astrology & Kundli 36-Guna Matching
- **Components**: `src/components/astrology/`
  - `AstrologyLanding.jsx`: Hub showcasing Daily Rashi, Kundli generation, and Matchmaking.
  - `KundliViewer.jsx`: SVG-based Vedic Janam Kundli chart renderer with Lagna and planetary positions.
  - `KundliMatching.jsx`: 36 Guna Ashtakoot Milan matchmaker for prospective couples.
  - `AstrologerDirectory.jsx`: Directory of certified Jyotishis with instant booking.
  - `ConsultationRoom.jsx`: Interactive consultation session with remedy notes.

### 6. Local Updates & News Aggregator
- **Components**: `src/components/news/`
  - `LocalUpdatesPage.jsx`: Filterable feed of local community notices and temple news.
  - `NewsDetailsPage.jsx`: Full article viewer with original source citations.
  - `AdminNewsDashboard.jsx`: Source manager and manual RSS scraper sync trigger.

### 7. Spiritual Events & Connected Meetups
- **Components**: `src/components/events/`
  - `EventsDiscoveryPage.jsx`:
    - "📍 Find Events Near Me" browser GPS detection.
    - Haversine proximity radius filtering (`5km`, `10km`, `25km`, `50km`, `100km`).
    - 16 Category pill filter and Yatra pilgrimage toggle.
  - `EventDetailsPage.jsx`:
    - Hero banner, full schedule, deity, and dress code guidelines.
    - Interactive **🙋 Raise Hand** RSVP modal (Guests 0-10, emergency contact, Prasad diet).
    - Capacity progress bar with automated waitlist positioning.
    - Embedded Yatra assembly coordinates.
  - `MeetupSection.jsx`:
    - Connected carpool and group travel coordinator per event.
    - Create/Join travel groups (Carpool, Bus, Train, Padyatra) with route details.
  - `EventCreationWizard.jsx`:
    - 6-step organizer wizard with GPS detection, banner upload, Yatra assembly, and capacity limits.
  - `OrganizerDashboard.jsx`:
    - Real-time devotee check-in attendance marker, participant moderation, and broadcast announcements.
  - `AdminEventDashboard.jsx`:
    - Platform analytics, event status moderation overrides, category taxonomy manager, and reports resolution.

### 8. Service Tiles & Coming Soon Handling
- **Component**: `src/components/ServiceTiles.jsx`
- The following 3 service tiles are marked as **🚀 Coming Soon**:
  1. **Find People** — Gotra & community directory
  2. **Services** — Hall, caterer, decorator, and band directory
  3. **Community Help** — Emergency assistance & Seva board
- Clicking any of these tiles triggers an immediate friendly notification:
  > *"🚀 Coming Soon: [Service Name] is under active development and will be available in a future update!"*

---

## 4. API Client Layer & Request Payloads

All frontend API calls are structured under `src/api/` using an Axios instance with automatic JWT Authorization header injection:

### 1. `authApi.js`
- `authApi.login(email, password)`
- `authApi.register(name, email, password, phone)`
- `authApi.sendEmailOtp(email, type)`
- `authApi.verifyEmailOtp(email, otp)`
- `authApi.googleAuth(idToken)`

### 2. `matrimonyApi.js`
- `matrimonyApi.getProfiles(params)`
- `matrimonyApi.saveProfile(formData)`
- `matrimonyApi.sendInterest(profileId)`

### 3. `panditApi.js`
- `panditApi.getDirectory(params)`
- `panditApi.getPanditBySlug(slug)`
- `panditApi.registerPandit(data)`

### 4. `spiritualApi.js`
- `spiritualApi.getDirectory(params)`
- `spiritualApi.getContentBySlug(slug, lang)`
- `spiritualApi.submitRequest(data)`

### 5. `astrologyApi.js`
- `astrologyApi.saveProfile(profileData)`
- `astrologyApi.getKundli(profileId)`
- `astrologyApi.matchKundli({ boy_profile_id, girl_profile_id })`

### 6. `newsApi.js`
- `newsApi.getArticles(params)`
- `newsApi.getArticleBySlug(slug)`

### 8. `statsApi.js`
- `statsApi.getHomepageStats()` — Real database counts for live service cards
- `statsApi.getCommunityFeed()` — Live local updates, upcoming events, and featured Kathas

### 9. Dynamic SEO, Geo-Targeting & Schema.org JSON-LD (`SEOHead.jsx`)
- Dynamic `<title>` and `<meta name="description">` generation per route & article
- Geo meta tags (`geo.region: IN-MH`, `geo.placename: Mumbai, Maharashtra`, `geo.position: 19.0760;72.8777`, `ICBM`)
- OpenGraph (`og:title`, `og:image`, `og:type`) & Twitter Cards
- Schema.org JSON-LD Structured Data for search engines & AI assistants

---

## 5. Installation, Development & Build

```bash
# 1. Navigate to frontend directory
cd WebNightZone/frontendWebNightZone

# 2. Install npm packages
npm install

# 3. Start Vite local development server
npm run dev

# 4. Compile optimized production bundle
npm run build
```

---

## 🌐 Application URL
- **Frontend App**: `http://localhost:5173`
- **Backend API**: `http://localhost:5001`
