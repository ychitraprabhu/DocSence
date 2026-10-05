# DocSense

Track when your stuff expires — warranties, insurance, subscriptions, documents — before it's too late to do anything about it.

Browser-only. No backend, no accounts, no external APIs. All data is saved in `localStorage` on your device.

## Features
- Add items with a category, expiry date, purchase date, value, notes, and an optional receipt photo
- See at a glance what's expiring soon (color-coded: green / yellow / red)
- Track multiple local profiles (e.g. yourself and a family member) — note: these are just a filter, not real accounts, so data stays on one device/browser
- A running total of how much value is expiring this month

## Files
- `index.html` — page structure
- `styles.css` — layout and styling
- `storage.js` — localStorage read/write
- `items.js` — add/edit/delete items, expiry and risk calculations
- `receiptUpload.js` — reads a receipt photo into base64 for storage
- `app.js` — wires everything together and renders the UI

## Running it
Just open `index.html` in a browser. No build step, no server needed.