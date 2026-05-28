# KFA Vercel Deployment Checklist

## Project

- GitHub repository root: this repository
- Vercel project root directory: `official-site`
- Build command: `node build-static.mjs`
- Output directory: `dist`
- Framework preset: Other / Static

`official-site/build-static.mjs` creates a public-only `dist` folder.
It excludes private setup files, Apps Script source, PDFs, and old internal pages.

## Domain

Primary domain:

- `www.koreafruit.kr`

Redirect / apex domain:

- `koreafruit.kr`

## DNS Safety Rule

The domain is registered at Gabia and mail is handled by Hiworks.

Do not delete or modify:

- `MX`
- SPF `TXT`
- DKIM `TXT`
- DMARC `TXT`
- any `mail`, `webmail`, `hiworks`, `smtp`, `pop`, `imap` related records

Only add or edit website-related records requested by Vercel:

- apex `A`
- `www` `CNAME`
- Vercel ownership verification `TXT`, if shown by Vercel

## Typical Vercel DNS Records

Use the exact values shown in the Vercel dashboard when possible.
As of Vercel's current documentation, the general records are:

| Host | Type | Value |
| --- | --- | --- |
| `@` | `A` | `76.76.21.21` |
| `www` | `CNAME` | `cname.vercel-dns-0.com` |

If Vercel shows a `_vercel` TXT verification record, add it exactly as shown.

## Verification

After DNS changes:

1. Wait for propagation.
2. Confirm Vercel domain status is valid.
3. Open `https://www.koreafruit.kr`.
4. Confirm SSL certificate is active.
5. Test navigation: Home, TSTC, Fruit Coordinator, Association, ESG, Media, Member pages.
