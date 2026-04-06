# nhajuly — Digital Courses & Store

Static site by Panha Lory (nhajuly). GitHub Pages ready.

## Files
- `index.html` — Home page
- `courses.html` — Course listings
- `store.html` — Digital product store
- `portfolio.html` — Portfolio/work showcase
- `checkout.html` — Checkout with cart sync
- `shared.css` — Design system & shared styles
- `shared.js` — Theme, cart, cursor, mobile nav

## Deploy on GitHub Pages
1. Push all files to a GitHub repo
2. Go to **Settings → Pages**
3. Set source to **main branch / root**
4. Your site will be live at `https://yourusername.github.io/repo-name`

## Customise
- **KHQR code**: Replace the placeholder SVG in `checkout.html` with your real KHQR image
- **ABA account**: Update the account number in `checkout.html`
- **Product images**: Add images to an `images/` folder and uncomment the `<img>` tags in each product card
- **Email**: Replace `hello@nhajuly.com` with your real email address
- **Video**: The Gumlet embed in `index.html` uses your existing video ID

## Cart System
All cart state is stored in `localStorage` under the key `nhajuly-cart`.
Buttons on `courses.html` and `store.html` automatically show **"Enrolled ✓"** or **"In Cart ✓"** when items are in the cart — state persists across page navigation.
