// _tools/ps5vault-og.mjs
//
// Podgląd do udostępniania (og:image, 1200×630) strony PS5 Vault w każdym języku:
// nagłówek z og:title i telefon z pierwszym zrzutem (ps5-vault/img/{lang}/01.webp).
// Facebook, Messenger, Discord, Reddit i X pokazują go przy wklejeniu linku.
// Wymaga Playwright z Chromium. Run: node _tools/ps5vault-og.mjs
// Wynik: ps5-vault/og/{lang}.jpg

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createRequire } from 'module'
import { PAGES } from './content/ps5vault.mjs'

const require = createRequire(import.meta.url)
const { chromium } = (() => {
  try { return require('playwright') } catch { return require('/opt/node22/lib/node_modules/playwright') }
})()
const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;')

const browser = await chromium.launch()
const pg = await browser.newPage({ viewport: { width: 1200, height: 630 } })
fs.mkdirSync(path.join(ROOT, 'ps5-vault', 'og'), { recursive: true })
for (const P of PAGES) {
  const img = fs.readFileSync(path.join(ROOT, 'ps5-vault', 'img', P.lang, '01.webp')).toString('base64')
  const [q, ...rest] = P.ogTitle.split(' · ')
  await pg.setContent(`<!doctype html><html><head><meta charset="utf-8"><style>
    @import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;1,9..144,400&family=JetBrains+Mono:wght@600&display=swap');
    body { margin: 0; width: 1200px; height: 630px; overflow: hidden; background:
      radial-gradient(700px 500px at 0% 0%, rgba(201,90,72,.22), transparent 70%),
      radial-gradient(700px 600px at 100% 100%, rgba(0,212,255,.18), transparent 70%), #141810;
      color: #F5F0E0; font-family: 'Fraunces', serif; position: relative; }
    .t { position: absolute; left: 70px; top: 0; bottom: 0; width: 700px; display: flex; flex-direction: column; justify-content: center; }
    .k { font: 600 22px 'JetBrains Mono', monospace; color: #D4A547; letter-spacing: 2px; text-transform: uppercase; margin-bottom: 26px; }
    h1 { font-size: 64px; font-weight: 500; line-height: 1.06; letter-spacing: -2px; margin: 0; }
    h1 em { color: #D4A547; font-style: italic; font-weight: 400; }
    .s { margin-top: 26px; font: 600 22px 'JetBrains Mono', monospace; color: #C5BFA8; }
    img { position: absolute; right: 70px; top: 40px; height: 700px; border-radius: 28px; transform: rotate(4deg);
      box-shadow: 0 0 0 2px rgba(0,212,255,.4), 0 0 60px rgba(0,212,255,.25), 0 30px 70px rgba(0,0,0,.7); }
  </style></head><body>
    <div class="t"><div class="k">PS5 Vault · Google Play</div><h1>${esc(rest.join(' · ') || q).replace(/(\S+\?)$/, '<em>$1</em>')}</h1><div class="s">${esc(P.status)}</div></div>
    <img src="data:image/webp;base64,${img}">
  </body></html>`, { waitUntil: 'load' })
  await pg.evaluate(() => document.fonts.ready)
  await pg.screenshot({ path: path.join(ROOT, 'ps5-vault', 'og', `${P.lang}.jpg`), type: 'jpeg', quality: 85 })
  console.log(`  og/${P.lang}.jpg`)
}
await browser.close()
