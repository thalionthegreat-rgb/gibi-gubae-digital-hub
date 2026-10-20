# Gibi Gubae Offline Hub V6 — bilingual PWA starter

## What is included
- Responsive, phone-friendly Amharic/English interface
- Student directory with internal codes and contact permission
- Monthly contact follow-up records (not confession/Communion records)
- Learning library, announcements, activities
- JSON backup and restore
- PWA manifest, icons, and offline app-shell service worker

## Important limitations
- This is still an offline, single-device prototype; it does NOT sync data across the three team members.
- It is not an APK yet. To install it as a PWA, upload the files to a host that serves HTTPS, then open the HTTPS address in Android Chrome and choose Install app / Add to Home screen.
- Browser storage is not encrypted by this prototype and may be cleared. Do not use it for highly sensitive data.
- Never store Fayda ID numbers, confession details, sins, Communion participation, penances, or private conversations with a priest.
- For real shared access, add a secure backend with individual accounts, an approved-member allowlist, row-level security, and HTTPS. Do not place a database service-role key in this HTML.

## Test on a phone
1. Extract the ZIP while keeping the folder structure.
2. Upload `index.html`, `manifest.webmanifest`, `sw.js`, and the `assets` folder to an HTTPS static host.
3. Open the hosted page in Chrome.
4. Test student add/search, monthly follow-up, language switch, backup export/import, and offline reload after the first online visit.

## Next production stage
Shared cloud access should be implemented only after choosing the hosting/backend and collecting the three team members' approved account emails. Each member should sign in separately. Access must be limited to those approved accounts. Do not collect Fayda IDs in the app; if identity verification is mandatory, use an institution-approved verification process that does not store ID numbers in this student tracker.
