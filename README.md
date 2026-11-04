# Concepto Ink — Website

Front-end only (HTML, CSS, vanilla JS). No build step, no dependencies —
just open `index.html` in a browser or upload the whole folder to hosting.

## What changed from the original site

- **Separate pages instead of scroll sections.** Home, Tattoos, Beauty,
  Gallery, About, Contact and Booking are now real pages
  (`index.html`, `tattoos.html`, `beauty.html`, `gallery.html`,
  `about.html`, `contact.html`, `booking.html`).
- **Click-to-open pricing popups.** On the Tattoos and Beauty pages,
  each category (Tattoos, Sessions, Styles, Specialty, Piercings /
  Brows, PMU Brows, Lips, Lashes) is a card — tap it and the full price
  list opens as a popup instead of scrolling through tabs. Every price
  row has a **Book This** button that jumps straight to the booking
  page with that exact service pre-filled.
- **Combined gallery.** `gallery.html` merges all 12 tattoo photos and
  8 beauty photos into one filterable gallery (All / Tattoos / Beauty)
  with a fullscreen lightbox.
- **Pink + gold theme.** The header, footer chrome, and Tattoo pages
  stay black & gold. `beauty.html` (and the booking page, when someone
  arrives from a beauty popup) automatically switches the accent color
  to a dusty rose pink — same layout, same motifs, different accent.
  This is driven by one CSS class (`theme-beauty` on `<body>`), so it's
  easy to adjust the exact pink shade in `styles/variables.css` if your
  client wants it warmer/cooler.
- **Animations throughout.** Every section, card, and image animates in
  as the page is scrolled (fade-up, zoom-in, slide-in, and an "image
  scrolls into place" effect on photos), plus continuous small ambient
  motion (floating scroll indicator, Ken Burns zoom on hero images,
  card tilt on hover). See `styles/animations.css` + `scripts/reveal.js`.
- **R200 booking fee via PayFast** — see setup below.

## ⚠️ Before this goes live — 3 things to do

### 1. PayFast credentials
Open `scripts/booking.js` and replace the placeholder values at the top:

```js
var PAYFAST_CONFIG = {
    SANDBOX: true,   // flip to false once you've tested a real booking
    MERCHANT_ID: "10000100",       // ← replace with your real Merchant ID
    MERCHANT_KEY: "46f0cd694581a", // ← replace with your real Merchant Key
    RETURN_URL: "https://conceptoink.co.za/booking-success.html",
    CANCEL_URL: "https://conceptoink.co.za/booking.html",
    NOTIFY_URL: "https://conceptoink.co.za/booking-notify.php",
    ...
};
```

Get the real Merchant ID and Merchant Key from the PayFast dashboard
under **Settings → Integration**. Right now this is wired to PayFast's
public **sandbox** test credentials, so you can click through the whole
booking flow safely without moving real money — use PayFast's sandbox
card numbers (listed on their docs) to test a full payment end to end
before flipping `SANDBOX` to `false`.

Update `RETURN_URL` / `CANCEL_URL` to match wherever this site actually
ends up hosted (they currently point at a placeholder domain).

**One limitation to know about:** this is a front-end-only site, so it
can redirect to PayFast and collect the R200 correctly, but it can't
run PayFast's server-side ITN (Instant Transaction Notification)
signature check — that needs a small backend endpoint. For a single
booking-fee flow most small studios accept this trade-off (PayFast's
own success/cancel redirect is enough), but if your client wants
airtight automatic payment verification later, that's a small
follow-up job (one PHP or serverless endpoint).

### 2. Real photos
No flyer or photos were attached when this was built, so every image —
logo, hero backgrounds, and all 20 gallery photos — is a placeholder
graphic. Replace these, keeping the exact filenames:

- `images/logo.jpeg`
- `images/home.jpeg`, `images/tattoo-hero.jpeg`, `images/beauty-hero.jpeg`
- `images/tattoo.jpeg`, `images/beauty.jpeg`, `images/about.jpeg`
- `images/gallery/tattoo-1.jpeg` … `tattoo-12.jpeg`
- `images/gallery/beauty-1.jpeg` … `beauty-8.jpeg`

Add more or fewer gallery photos? Duplicate a `<div class="gallery-item">`
block in `gallery.html` and give it a unique filename + `data-category`
of `tattoo` or `beauty`.

### 3. WhatsApp / contact details
Phone, WhatsApp and email are already wired through from the original
site (083 531 9734). If they ever
change, search-and-replace `27835319734` across the `.html` files and
`scripts/booking.js`.

## Structure

```
index.html          Home
tattoos.html         Tattoos + piercing (popups + aftercare)
beauty.html          Beauty bar (popups, pink theme)
gallery.html         Combined 20-photo gallery + filters + lightbox
about.html
contact.html
booking.html         R200 PayFast booking flow

styles/
  variables.css       colors, fonts — gold + pink theme tokens
  animations.css       scroll-reveal + ambient motion
  header.css / footer.css
  modal.css            popup component + service trigger cards
  gallery.css          combined gallery + lightbox
  pages.css            home/hero/about shared layout
  contact.css
  booking.css
  extras.css           piercing list, aftercare grid, beauty benefits

scripts/
  header.js           nav + hamburger + scroll effect
  reveal.js            scroll-animation engine
  modal.js              popup open/close + "Book This" routing
  gallery.js            filter + lightbox
  booking.js            PayFast form + WhatsApp fallback
  tilt.js               card hover tilt
```

## SEO (added)

Built in: unique title + description + canonical + Open Graph/Twitter tags on every page, JSON-LD
(TattooParlor/BeautySalon business with address, hours, phone, price list, FAQ), keyword-rich
copy and visible FAQs, `sitemap.xml`, `robots.txt`, branded `404.html`, `vercel.json`
(old vercel.app address 301-redirects to the main domain, caching, security headers),
favicons, share image, image dimensions, deferred icon CSS.

After you deploy:
1. Google Search Console → add `https://www.concepto-ink-tattoos.online` → submit `sitemap.xml`.
2. Claim/verify the Google Business Profile with the exact name, address, phone and hours used
   on the site (this is the biggest local-ranking lever). Add the website link and photos.
3. Replace the placeholder images (including `images/og-image.jpg` and the favicons) with real
   photos/logo. Name photos descriptively and update `alt` text in the HTML where you can.
4. Ask happy clients for Google reviews. Don't add review stars to the markup unless they are real.
5. In Vercel → Domains, make sure the non-www domain redirects to `www`.

## Legal pages (added)

- `policies.html` (hub, linked in the nav bar as "Policies"), `refund-policy.html`,
  `terms-and-conditions.html`, `privacy-policy.html` — all styled with `styles/policies.css`
  (unchanged) plus `styles/legal.css`. Linked in the footer bottom bar on every page, and from
  the booking page next to the pay button. All four are in `sitemap.xml`.
- The old `policy.html` now redirects (301) to `refund-policy.html` via `vercel.json`.
- The Refund & Exchange Policy is the client's own text. The Terms & Conditions and Privacy
  Policy are drafts based on how the site works — the owner should read them (ideally a lawyer
  too) and edit anything that doesn't match how the studio operates.
- `scripts/booking.js` is the client's working version and is not modified by this update.
