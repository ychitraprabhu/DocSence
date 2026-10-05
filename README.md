# DocSence

A lightweight, privacy-first, browser-based expiry tracker for your warranties, insurance policies, subscriptions, and crucial documents. Track everything before it's too late. Completely local, secure, and fast.

Browser-only. No backend, no accounts, no external APIs. All data is saved in `localStorage` on your device.

## Features
- Add items with a category, expiry date, purchase date, value, notes, and an optional receipt photo
- See at a glance what's expiring soon (color-coded: green / yellow / red)
- Track multiple local profiles e.g. yourself and a family member
  (note: these are just a filter, not real accounts, so data stays on one device/browser)
- Displays a total of how many documents are expiring this month

## Files
- `index.html` — page structure
- `styles.css` — layout and styling
- `storage.js` — localStorage read/write
- `items.js` — add/edit/delete items, expiry and risk calculations
- `receiptUpload.js` — reads a receipt photo into base64 for storage
- `app.js` — connects everything together and renders the UI

## Running it
DocSence has **zero build steps** and zero dependencies. To launch it:

1. **Clone the repository:**
   ```bash
   git clone https://github.com
   ```
2. **Launch the application:**
   Simply double-click `index.html` to open it in any modern web browser. No local servers are required.

## Future Enhancements
- [ ] Native Browser Push Notifications before items expire.
- [ ] Secure backup configuration (Export/Import data via JSON files).
- [ ] Dark Mode UI toggle.
