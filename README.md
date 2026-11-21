# DocSence

A simple website to track when your warranties, insurance, subscriptions and documents expire.

- Built with plain HTML, CSS and JavaScript
- Items are saved in the browser using localStorage, so no backend or login is needed.
- Your data stays on your device. Nothing is sent to a server.

## Features
- Add an item with a name, category, purchase date and expiry date
- **Scan a receipt**: upload a photo of a receipt or warranty card and the purchase date, warranty period, expiry date and category are filled in for you (on-device OCR using Tesseract.js)
- See how many days are left for each item
- Colors show how soon it expires (green = safe, yellow = within 30 days, red = within 7 days or expired)
- Shows how many items expire this month
- **Search** items by name or category
- **Reminders**: browser notifications for items expiring within 7 days
- **Add to Calendar**: download a `.ics` file for any item (works with Google Calendar, Apple Calendar and Outlook) with an alert 7 days before expiry
- Delete items you don't need

## How the receipt scan works
1. Tesseract.js (an OCR model that runs in the browser) reads the text from the image.
2. The app finds dates in the text (like `12/03/2025` or `12 Mar 2025`). The oldest date is used as the purchase date.
3. It looks for phrases like "2 year warranty" or "warranty: 12 months" and adds that to the purchase date to get the expiry date.
4. Keywords such as "insurance", "subscription" or "warranty" are used to pick the category.
5. You can check and edit everything before adding the item.

The image itself is never uploaded anywhere. The first scan downloads the OCR language data once, so it needs an internet connection.

## Current Limitations
- OCR is not perfect. Blurry or low contrast images may give wrong or missing dates, so always check the form.
- Dates are read as day/month/year.
- Reminders only appear when the page is open in the browser (there is no server to send them in the background). 

## Files
- `index.html` — page structure
- `styles.css` — layout and styling
- `script.js` — add/delete items, search, expiry and risk calculations, receipt scanning, reminders and calendar export

## How to run
Download the files and open `index.html` in any browser.

Notifications work best when the site is served over `https` or `localhost`.

