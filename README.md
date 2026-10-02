# QuickQR

A free, browser-only QR code generator. Content is encoded on your device; the app has no API, account, or database.

## Run locally

```sh
npm install
npm run dev
```

## Build

```sh
npm run build
npm run preview
```

The static production site is written to `dist/` and can be deployed to Cloudflare Pages with build command `npm run build` and output directory `dist`.

## Supported formats

Website URLs, plain text, Wi-Fi, vCards, email, SMS, phone numbers, WhatsApp, map locations, and calendar events. Customize colors, dot and corner styles, error correction, export dimensions, and an optional logo. Download PNG or SVG.