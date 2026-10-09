// _tools/build-ps5vault.mjs
//
// Strona aplikacji PS5 Vault w 7 językach apki:
//   pl: /ps5-vault/   en/es/de/fr/it/pt: /ps5-vault/{lang}/
// Treść: _tools/content/ps5vault.mjs. Styl: assets/ps5.css.
// Zasoby (z repo matiseekk-dot/Games, marketing/): ps5-vault/img/{lang}/01..08.webp (zrzuty do Google Play),
// ps5-vault/video/{lang}.mp4 + .jpg (short „kupka wstydu”), ps5-vault/og/{lang}.jpg (podgląd do udostępniania,
// _tools/ps5vault-og.mjs).
//
// Na stronie: film, dwa kalkulatory dla graczy (kupka wstydu, koszt godziny) z linkiem do wyniku,
// FAQ z pytaniami, które gracze wpisują w Google, i dane strukturalne (SoftwareApplication + FAQPage).
// Adresy stron PS5 Vault w sitemap.xml aktualizuje ten skrypt.
// Run: node _tools/build-ps5vault.mjs

import fs from 'fs'
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import { PAGES } from './content/ps5vault.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://skudev.pl'
const UPDATED = '2026-10-09'
const BASE = '/ps5-vault/'
const CSS_VERSION = crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, 'assets', 'ps5.css'))).digest('hex').slice(0, 8)
const urlOf = P => `${BASE}${P.dir ? P.dir + '/' : ''}`

const play = campaign =>
  `https://play.google.com/store/apps/details?id=com.skudev.ps5vault&amp;referrer=utm_source%3Dskudev%26utm_medium%3Dweb%26utm_campaign%3D${campaign}`
const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 2.5v19l10-9.5L4 2.5zm11.4 10.8l2.6 2.5-11.2 6.3 8.6-8.8zm0-2.6L6.8 1.9 18 8.2l-2.6 2.5zm4.3-1.5l3 1.7c.8.5.8 1.7 0 2.2l-3 1.7-2.8-2.8 2.8-2.8z"/></svg>'

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')
const em = s => esc(s).replace(/\*\*(.+?)\*\*/g, '<em>$1</em>')
const plain = s => String(s).replace(/\*\*/g, '')

function head(P) {
  const alt = PAGES.map(Q => `  <link rel="alternate" hreflang="${Q.lang === 'pt' ? 'pt-BR' : Q.lang}" href="${SITE}${urlOf(Q)}">`).join('\n')
  const ld = [
    {
      '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'PS5 Vault', operatingSystem: 'Android',
      applicationCategory: 'EntertainmentApplication', description: P.desc, inLanguage: P.locale, url: SITE + urlOf(P),
      downloadUrl: 'https://play.google.com/store/apps/details?id=com.skudev.ps5vault',
      offers: { '@type': 'Offer', price: '0', priceCurrency: 'PLN' },
      author: { '@type': 'Person', name: 'Mateusz', url: SITE + '/' },
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage',
      mainEntity: P.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: a } })),
    },
  ]
  return `<!DOCTYPE html>
<html lang="${P.locale}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(P.title)}</title>
  <meta name="description" content="${esc(P.desc)}">
  <link rel="canonical" href="${SITE}${urlOf(P)}">
${alt}
  <link rel="alternate" hreflang="x-default" href="${SITE}${BASE}en/">
  <meta property="og:title" content="${esc(P.ogTitle)}">
  <meta property="og:description" content="${esc(P.ogDesc)}">
  <meta property="og:type" content="website">
  <meta property="og:url" content="${SITE}${urlOf(P)}">
  <meta property="og:image" content="${SITE}${BASE}og/${P.lang}.jpg">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:locale" content="${P.locale.replace('-', '_')}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=JetBrains+Mono:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%231A1F18'/%3E%3Ctext x='50' y='68' font-size='52' text-anchor='middle' fill='%23D4A547' font-family='monospace' font-weight='700'%3EV%3C/text%3E%3C/svg%3E">
  <link rel="stylesheet" href="/assets/ps5.css?v=${CSS_VERSION}">
  <script type="application/ld+json">${JSON.stringify(ld)}</script>
</head>`
}

function page(P) {
  const C = P.calcs
  const langs = PAGES.map(Q => `<a href="${urlOf(Q)}" class="nav-lang" hreflang="${Q.lang}" lang="${Q.lang}"${Q === P ? ' aria-current="page"' : ''}>${Q.lang.toUpperCase()}</a>`).join('\n            ')
  const features = P.features.map(([emo, h, p], i) => `
          <div class="feature">
            <div class="feature-num">${String(i + 1).padStart(2, '0')}</div>
            <span class="feature-emoji">${emo}</span>
            <h3>${esc(h)}</h3>
            <p>${esc(p)}</p>
          </div>`).join('')
  const shots = P.alts.map((a, i) => `<img src="${BASE}img/${P.lang}/${String(i + 1).padStart(2, '0')}.webp" width="540" height="960" loading="lazy" alt="${esc(a)}">`).join('\n          ')
  const faq = P.faq.map(([q, a]) => `
        <details>
          <summary>${esc(q)}</summary>
          <p>${esc(a)}</p>
        </details>`).join('')
  // Teksty kalkulatorów dla skryptu na stronie (funkcje out zamieniamy na szablony).
  const calcData = {
    locale: P.locale, cur: P.cur, after: P.curAfter, thr: P.thr,
    shameOut: C.shame.out('{m}', '{h}', '{d}'), shameShare: C.shame.share,
    hourOut: C.hour.out('{v}'), great: C.hour.great, ok: C.hour.ok, bad: C.hour.bad, hourShare: C.hour.share,
    copied: C.copied, shareBtn: C.shareBtn,
  }
  const curLabel = ` (${P.cur})`

  return `${head(P)}
<body>

  <header>
    <div class="container">
      <nav class="nav">
        <a href="/" class="logo">
          <div class="logo-mark">S</div>
          <div class="logo-text">skudev · <em>ps5 vault</em></div>
        </a>
        <div class="nav-links">
          <div class="nav-langs">
            ${langs}
          </div>
          <a href="/" class="nav-back">${esc(P.back)}</a>
        </div>
      </nav>
    </div>
  </header>

  <main>

    <section class="hero">
      <div class="container hero-grid">
        <div>
          <div class="hero-eyebrow">${esc(P.eyebrow)}</div>
          <h1>${em(P.h1)}</h1>
          <p class="hero-lead">${esc(P.lead)}</p>
          <div class="hero-ctas">
            <a class="btn btn-play" href="${play('hero')}" rel="noopener">${PLAY_ICON}${esc(P.cta)}</a>
            <a class="btn btn-ghost" href="#kalkulator">${esc(P.calcJump)}</a>
          </div>
          <div class="hero-status">${esc(P.status)}</div>
        </div>
        <div class="hero-video">
          <video src="${BASE}video/${P.lang}.mp4" poster="${BASE}video/${P.lang}.jpg" autoplay muted loop playsinline preload="metadata" width="540" height="960" aria-label="${esc(P.alts[0])}"></video>
          <div class="hero-video-note">${esc(P.videoNote)}</div>
        </div>
      </div>
    </section>

    <section class="story">
      <div class="container">
        <div class="story-inner">
          <div class="story-label">${esc(P.storyLabel)}</div>
          <p class="story-quote">${em(P.story)}</p>
          <div class="story-author">${esc(P.storyAuthor)}</div>
        </div>
      </div>
    </section>

    <section class="calcs" id="kalkulator">
      <div class="container">
        <div class="section-label">${esc(P.calcLabel)}</div>
        <h2 class="section-title">${em(P.calcTitle)}</h2>
        <div class="calc-grid">
          <form class="calc" id="calc-shame" onsubmit="return false">
            <h3>${esc(C.shame.title)}</h3>
            <label for="s-n">${esc(C.shame.n)}</label>
            <input id="s-n" name="n" type="number" inputmode="numeric" min="0" max="5000" value="12">
            <label for="s-p">${esc(C.shame.price)}${esc(curLabel)}</label>
            <input id="s-p" name="p" type="number" inputmode="decimal" min="0" max="10000" step="any" value="${P.avgPrice}">
            <label for="s-h">${esc(C.shame.hours)}</label>
            <input id="s-h" name="h" type="number" inputmode="numeric" min="0" max="1000" value="25">
            <div class="calc-out" aria-live="polite"></div>
            <button type="button" class="calc-share">${esc(C.shareBtn)}</button>
          </form>
          <form class="calc" id="calc-hour" onsubmit="return false">
            <h3>${esc(C.hour.title)}</h3>
            <label for="h-p">${esc(C.hour.price)}${esc(curLabel)}</label>
            <input id="h-p" name="hp" type="number" inputmode="decimal" min="0" max="10000" step="any" value="${P.avgPrice * 2}">
            <label for="h-h">${esc(C.hour.hours)}</label>
            <input id="h-h" name="hh" type="number" inputmode="decimal" min="0" max="10000" step="any" value="40">
            <div class="calc-out" aria-live="polite"></div>
            <button type="button" class="calc-share">${esc(C.shareBtn)}</button>
          </form>
        </div>
        <p class="calc-cta">${esc(C.cta)} <a href="${play('kalkulator')}" rel="noopener">${esc(P.cta)} →</a></p>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <div class="section-label">${esc(P.featLabel)}</div>
        <h2 class="section-title">${em(P.featTitle)}</h2>
        <div class="features-grid">${features}
        </div>
      </div>
    </section>

    <section class="pro">
      <div class="container">
        <div class="pro-box">
          <div class="section-label">${esc(P.proLabel)}</div>
          <h2 class="section-title">${em(P.proTitle)}</h2>
          <p class="pro-lead">${esc(P.proLead)}</p>
          <ul class="pro-list">${P.pro.map(x => `<li>${esc(x)}</li>`).join('')}</ul>
        </div>
      </div>
    </section>

    <section class="preview">
      <div class="container">
        <div class="section-label">${esc(P.shotsLabel)}</div>
        <h2 class="section-title">${em(P.shotsTitle)}</h2>
        <div class="shots shots-4">
          ${shots}
        </div>
      </div>
    </section>

    <section class="faq">
      <div class="container">
        <div class="section-label">${esc(P.faqLabel)}</div>
        <h2 class="section-title">${em(P.faqTitle)}</h2>${faq}
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <div class="cta-inner">
          <div class="section-label">${esc(P.ctaLabel)}</div>
          <h2 class="cta-title">${em(P.ctaTitle)}</h2>
          <p class="cta-lead">${esc(P.ctaLead)}</p>
          <a class="btn btn-play" href="${play('cta')}" rel="noopener">${PLAY_ICON}${esc(P.cta)}</a>
          <div class="cta-meta">${esc(P.ctaMeta)} <a href="mailto:skudev6@gmail.com">skudev6@gmail.com</a>.</div>
        </div>
      </div>
    </section>

  </main>

  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>PS5 Vault · ${esc(P.footer)} <a href="/" style="color:var(--accent-dim);text-decoration:none;">skudev</a> · 2026</div>
        <ul class="footer-links">
          <li><a href="mailto:skudev6@gmail.com">email</a></li>
          <li><a href="https://matiseekk-dot.github.io/Games/privacy.html" target="_blank" rel="noopener">privacy</a></li>
          <li><a href="https://github.com/matiseekk-dot/Games" target="_blank" rel="noopener">github</a></li>
        </ul>
      </div>
    </div>
  </footer>

<script>
(() => {
  const T = ${JSON.stringify(calcData)}
  const nf = new Intl.NumberFormat(T.locale, { maximumFractionDigits: 2 })
  const nf0 = new Intl.NumberFormat(T.locale, { maximumFractionDigits: 0 })
  const money = (v, f) => { const s = (f || nf).format(v); return T.after ? s + '\\u00a0' + T.cur : T.cur + '\\u00a0' + s }
  const num = el => Math.max(0, parseFloat(String(el.value).replace(',', '.')) || 0)
  const fill = (s, o) => s.replace(/\\{(\\w)\\}/g, (_, k) => o[k])
  const strip = s => s.replace(/<[^>]+>/g, '')
  // Wynik da się udostępnić linkiem: liczby lądują w adresie (?n=12&p=150...), a strona je wczytuje.
  const q = new URLSearchParams(location.search)
  for (const el of document.querySelectorAll('.calc input')) if (q.has(el.name)) el.value = q.get(el.name)
  const forms = {
    'calc-shame': f => {
      const [n, p, h] = ['n', 'p', 'h'].map(k => num(f.elements[k]))
      const m = money(n * p, nf0), hh = Math.round(n * h)
      return { html: fill(T.shameOut, { m, h: nf0.format(hh), d: nf0.format(Math.ceil(hh / 2)) }), share: fill(T.shameShare, { m }) }
    },
    'calc-hour': f => {
      const p = num(f.elements.hp), h = num(f.elements.hh)
      if (!h) return { html: '', share: '' }
      const v = p / h, vs = money(v)
      const verdict = v < T.thr[0] ? T.great : v < T.thr[1] ? T.ok : T.bad
      return { html: fill(T.hourOut, { v: vs }) + '<span class="calc-verdict">' + verdict + '</span>', share: fill(T.hourShare, { v: vs }) }
    },
  }
  for (const [id, calc] of Object.entries(forms)) {
    const f = document.getElementById(id), out = f.querySelector('.calc-out'), btn = f.querySelector('.calc-share')
    const run = () => { const r = calc(f); out.innerHTML = r.html; f.dataset.share = r.share }
    f.addEventListener('input', run)
    run()
    btn.addEventListener('click', async () => {
      const u = new URL(location.href.split('#')[0].split('?')[0])
      for (const el of f.querySelectorAll('input')) u.searchParams.set(el.name, el.value)
      u.hash = 'kalkulator'
      const text = strip(f.dataset.share)
      try { if (navigator.share) { await navigator.share({ text, url: u.href }); return } } catch (e) { if (e && e.name === 'AbortError') return }
      try { await navigator.clipboard.writeText(text + ' ' + u.href); btn.textContent = T.copied; setTimeout(() => { btn.textContent = T.shareBtn }, 1800) } catch {}
    })
  }
})()
</script>
</body>
</html>
`
}

for (const P of PAGES) {
  const dir = path.join(ROOT, 'ps5-vault', P.dir)
  fs.mkdirSync(dir, { recursive: true })
  const html = page(P)
  if (/[–—]/.test(html)) throw new Error(`Długi myślnik na stronie ${P.lang}`)
  fs.writeFileSync(path.join(dir, 'index.html'), html)
  console.log(`  ${urlOf(P)}`)
}

// sitemap.xml: podmień wpisy /ps5-vault/ na aktualną listę języków.
const smFile = path.join(ROOT, 'sitemap.xml')
const sm = fs.readFileSync(smFile, 'utf8').split('\n')
const keep = sm.filter(l => !l.includes(`${SITE}${BASE}`))
const at = sm.findIndex(l => l.includes(`${SITE}${BASE}`))
const rows = PAGES.map(P => `  <url><loc>${SITE}${urlOf(P)}</loc><lastmod>${UPDATED}</lastmod></url>`)
keep.splice(at < 0 ? keep.length - 2 : at, 0, ...rows)
fs.writeFileSync(smFile, keep.join('\n'))
console.log('  sitemap.xml')
