# DocSence

A simple website to track when your warranties, insurance, subscriptions and documents expire.

- Built with plain HTML, CSS and JavaScript
- Items are saved in the browser using localStorage, so no backend or login is needed.

## Features
- Add an item with a name, category, purchase date and expiry date
- See how many days are left for each item
- Colors show how soon it expires (green = safe, yellow = within 30 days, red = within 7 days or expired)
- Shows how many items expire this month
- Search items by name or category
- Add to Calendar: download a `.ics` file for any item (works with Google Calendar, Apple Calendar and Outlook) with an alert 7 days before expiry
- Delete items you don't need

## Files
- `index.html` — page structure
- `styles.css` — layout and styling
- `script.js` — add/delete items, search, expiry and risk calculations, calendar export

## How to run
Download the files and open `index.html` in any browser.
