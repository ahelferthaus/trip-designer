# Travel form release candidate — not deployed

Base: live f5c092634d8d7c9910ef61ff4a6e5a7121eaab12. Scope: traveler/organizer purpose text, sharing audience, optional calendar controls, and transfer/meeting wording. Existing invitation-copy fix retained. No AI, journey, map, roster, schema, permissions, trip data, date or timezone changes.

Interactive QA used the actual ArrivalWindowField and release CSS in an ignored synthetic fixture, with no auth or network backend. Verified old free text preserved on opening; native segmented keyboard date 2030-11-06 and time 14:30; explicit apply creates a timezone-labelled draft without saving; date-only/unknown/flexible states; validation error; failed synthetic save preserves draft; repeated save, reload, navigation back, and fixture cancel. Cancel and simulated persistence belong to the test adapter, not new production features. No new hosted write coverage claimed.

Caught and fixed: incomplete optional native calendar input could prevent the enclosing form from submitting its flexible text. Draft pickers are now explicitly unassociated with the parent form; explicit Apply validates them. Verified invalid draft does not block saving text. Regression checks cover the form association.

Visual checks: desktop, 390px and 320px viewports; controls stack without horizontal overflow, visible keyboard focus, timezone/help text wraps. Native date/time keyboard entry verified; separate OS calendar popup and physical mobile-device behavior not independently exercised. Viewport restored afterward.

Group overview visual QA remains blocked by the previously denied navigation from its browser-generated data:errorpage. No new evidence resolves that target-identification restriction; no retry or alternate-origin bypass attempted. Group code excluded from this release.

Release requires approval after final CI. Live site remains f5c0926.
