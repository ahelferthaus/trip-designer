# VYBR — UI/UX Design Brief for Kimi (Pass 2)

## Context

This is the second Kimi pass. Pass 1 added gamification (streaks, XP, badges, daily rewards) and a bottom tab bar. The gamification was too prominent and made the app look unprofessional. We've pulled it back — gamification components still exist in the codebase but are no longer shown on the home page.

**The target aesthetic is Polarsteps** — clean, photo-forward, spacious, travel-focused. Not gamified, not flashy. Professional and inviting.

## What's Already Done (Don't Redo)
- Bottom tab bar (Home/Explore/Plan/Feed/Profile) — keep this, it works
- Gamification store + components exist in code — leave them, just don't make them prominent
- All 20+ CSS animations in index.css — keep available but use sparingly
- All functionality (AI trips, voting, write-ins, booking, photos, social) — don't touch

## What Needs Work

### 1. Overall Visual Identity (HIGHEST PRIORITY)
The app needs a cohesive, premium feel across all pages:
- **Clean white space** — Polarsteps uses generous padding and spacing
- **Typography hierarchy** — Clear distinction between headings, body, captions
- **Subtle shadows** — Soft, almost invisible card shadows (not harsh)
- **Rounded corners** — Keep `rounded-2xl` on cards, but ensure consistency
- **No emoji overload** — Reduce emoji usage to icons/accents only, not as primary UI elements
- **Color discipline** — Use `var(--td-accent)` for CTAs and highlights only, not everywhere

### 2. Explore Page (`/explore`) — Make It the Showpiece
This is the discovery page — it should look like a travel magazine:
- **Trip cards**: Larger cover areas with gradient overlay text, not stacked info
- **Filter bar**: Replace `<select>` dropdowns with horizontal pill toggles (All / Budget / Mid / Splurge)
- **Search**: Make it feel premium — subtle border, no harsh outlines
- **Empty state**: Show a curated "Popular destinations" section with placeholder cards
- **Card layout**: Consider 2-column grid for wider screens, single column for mobile

### 3. Trip Detail Page (`/trip/:id`) — The Storefront
When someone views a public trip, this is the first impression:
- **Hero**: Full-bleed cover photo (or rich gradient), title overlay with backdrop blur
- **Author row**: Avatar + name + follow button inline (like Instagram post header)
- **Itinerary section**: More visual — consider timeline/rail design instead of flat list
- **Social proof**: Likes + clones + reviews in a clean horizontal row
- **Comments**: Chat-bubble style, not flat cards

### 4. Feed Page (`/feed`)
- **Feed items**: Richer cards with trip cover thumbnail, not just text
- **Action icons**: Use subtle line icons not emoji (or at minimum, very restrained emoji)
- **Timestamps**: "2h ago" style, muted

### 5. Profile Page (`/profile/:id`)
- **Header**: Centered layout with large avatar, name, bio — like Instagram profile
- **Stats row**: Follower/following/trips in a clean horizontal bar
- **Trip grid**: 2-column image grid (use trip cover or gradient placeholder) instead of a list

### 6. Itinerary Page (`/itinerary`) — Main Trip View
This is where users spend the most time:
- **Day headers**: More prominent, perhaps with a subtle background color band
- **Slot cards**: Tighter spacing, cleaner option layout
- **Photo strip**: Slightly larger thumbnails (48px not 40px)
- **Booking badge**: Current green is good, keep it subtle
- **Vote bubbles**: Current size is good

### 7. Settings Page (`/settings`)
- **Profile section**: Add the avatar preview larger at the top
- **Grouped list style**: iOS Settings-style grouped sections (already close, just tighten)

## Design Rules

1. **Use ONLY `var(--td-*)` CSS variables** — no hardcoded colors except white/black/transparent
2. **Don't add new npm dependencies** — use Tailwind utilities and CSS only
3. **Keep all functional code untouched** — only modify JSX structure and class names
4. **Test with at least 3 themes** (Default, Grand Budapest, Moonrise Kingdom) to ensure nothing breaks
5. **Mobile-first** — design for 390px wide, but look decent on wider screens too
6. **Subtle animations only** — use the existing CSS animations sparingly (fade-scale-in on page load, card-hover on tap, that's it)
7. **No emoji as primary icons** — use emoji as accents only. Prefer text labels.

## Snapchat Integration (Future — Don't Build Yet, Just Design For)
We're considering Snapchat integration. For now, just leave space for:
- A "Share to Snapchat" button on the trip detail page (next to Like/Clone)
- A potential Bitmoji avatar option in the profile avatar picker

Don't implement these — just note them in comments like `{/* TODO: Snapchat share */}`.

## Files to Focus On (in priority order)

1. `src/pages/ExplorePage.tsx` — trip card redesign, filter pills
2. `src/pages/TripDetailPage.tsx` — hero, author row, timeline itinerary
3. `src/pages/ProfilePage.tsx` — centered header, trip grid
4. `src/pages/FeedPage.tsx` — richer feed items
5. `src/pages/ItineraryPage.tsx` — day headers, slot card tightening (CAREFUL — this file has complex logic, only change styling classes)
6. `src/pages/SettingsPage.tsx` — larger avatar preview, tighter grouping
7. `src/pages/HomePage.tsx` — already cleaned up, minor polish only

## What NOT to Change
- `src/lib/*` — all library files, Supabase calls, AI generation
- `src/store/*` — all state management
- `src/components/gamification/*` — leave as-is (used minimally)
- `src/components/BottomTabBar.tsx` — working well, don't change
- Route structure in App.tsx
- Any `import` statements that import from lib/ or store/

## How to Test
```bash
npm install
npm run dev
# Open http://localhost:5173
# Check: HomePage, ExplorePage, TripDetailPage, ProfilePage, FeedPage
# Switch themes at /theme — try Default, Grand Budapest, Moonrise Kingdom
```
