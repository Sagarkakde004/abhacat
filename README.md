# ABHA Catering Campaign (React + Vite)

Pages: `/` (landing) → `/game` (Tic Tac Toe) → `/menu` (rates per kg) → `/order` (WhatsApp order).

## Run locally
```
npm install
npm run dev
```

## Customise
Edit `src/config.js` (business name, WhatsApp number, coupon code, discount %) and `src/data.js` (menu and rates per kg).

## Deploy on Vercel
1. Push this folder to a GitHub repository.
2. On vercel.com choose **Add New → Project**, import the repo. Vercel detects Vite automatically (build: `npm run build`, output: `dist`).
3. Click **Deploy**. `vercel.json` already handles page refreshes on `/game`, `/menu` and `/order`.

Or with the CLI: `npm i -g vercel` then `vercel --prod` inside this folder.

Make the QR code from your final Vercel URL.
