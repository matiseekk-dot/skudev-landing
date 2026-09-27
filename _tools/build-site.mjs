// _tools/build-site.mjs
//
// Strona aplikacji Spokojny Rodzic / Calm Parent i poradnik w 5 językach:
//   pl: /spokojny-rodzic/  + /poradnik/{slug}/
//   en: /en/               + /en/guide/{slug}/
//   de: /de/               + /de/ratgeber/{slug}/
//   fr: /fr/               + /fr/guide/{slug}/
//   es: /es/               + /es/guia/{slug}/
// Treść w _tools/content/{lang}.mjs. Artykuły łączy wspólne `id`, z niego
// powstają znaczniki hreflang i przełącznik języka.
//
// Mapa tych stron trafia do osobnego pliku sitemap-spokojny-rodzic.xml
// (sitemap.xml prowadzimy ręcznie dla reszty skudev.pl), robots.txt wskazuje oba.
//
// Katalog zaczyna się od "_", więc GitHub Pages (Jekyll) go nie publikuje.
// Run: node _tools/build-site.mjs

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import pl from './content/pl.mjs'
import en from './content/en.mjs'
import de from './content/de.mjs'
import fr from './content/fr.mjs'
import es from './content/es.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://skudev.pl'
const UPDATED = '2026-09-27'
const LANGS = [pl, en, de, fr, es]
const X_DEFAULT = 'en'
const SITEMAP = 'sitemap-spokojny-rodzic.xml'

const play = (medium, campaign) =>
  `https://play.google.com/store/apps/details?id=pl.skudev.spokojnyrodzic&amp;referrer=utm_source%3Dskudev%26utm_medium%3D${medium}%26utm_campaign%3D${campaign}`

const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 2.5v19l10-9.5L4 2.5zm11.4 10.8l2.6 2.5-11.2 6.3 8.6-8.8zm0-2.6L6.8 1.9 18 8.2l-2.6 2.5zm4.3-1.5l3 1.7c.8.5.8 1.7 0 2.2l-3 1.7-2.8-2.8 2.8-2.8z"/></svg>'

const attr = s => String(s).replace(/&(?!amp;)/g, '&amp;').replace(/"/g, '&quot;')
const plain = s => String(s).replace(/<[^>]+>/g, '')

// ─── Adresy i odpowiedniki w innych językach ─────────────────────────────────

const landingUrl = L => L.appPath
const indexUrl = L => L.guidePath
const articleUrl = (L, id) => `${L.guidePath}${L.articles.find(a => a.id === id).slug}/`

function alternates(urlFor) {
  return LANGS.map(L => ({ lang: L.lang, href: SITE + urlFor(L) }))
}

// ─── Wspólne kawałki HTML ────────────────────────────────────────────────────

function head({ L, title, description, url, image, alts, jsonLd, type = 'article' }) {
  const xdef = alts.find(a => a.lang === X_DEFAULT)
  return `<!DOCTYPE html>
<html lang="${L.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${plain(title)}</title>
  <meta name="description" content="${attr(description)}">
  <link rel="canonical" href="${SITE}${url}">
${alts.map(a => `  <link rel="alternate" hreflang="${a.lang}" href="${a.href}">`).join('\n')}
  <link rel="alternate" hreflang="x-default" href="${xdef.href}">
  <meta property="og:title" content="${attr(plain(title))}">
  <meta property="og:description" content="${attr(description)}">
  <meta property="og:type" content="${type}">
  <meta property="og:url" content="${SITE}${url}">
  <meta property="og:image" content="${SITE}${image}">
  <meta property="og:locale" content="${L.ogLocale}">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=JetBrains+Mono:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" href="/spokojny-rodzic/icon-192.png">
  <link rel="stylesheet" href="/assets/sr.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>`
}

function header(L, section, alts) {
  const switcher = LANGS.map(X => {
    const href = alts.find(a => a.lang === X.lang).href.replace(SITE, '')
    return X.lang === L.lang
      ? `<span class="lang-current" aria-current="true">${X.lang.toUpperCase()}</span>`
      : `<a href="${href}" hreflang="${X.lang}" lang="${X.lang}">${X.lang.toUpperCase()}</a>`
  }).join('')
  return `
  <header>
    <div class="container">
      <nav class="nav">
        <a href="${L.lang === 'pl' ? '/' : L.appPath}" class="logo">
          <div class="logo-mark">S</div>
          <div class="logo-text">${section}</div>
        </a>
        <div class="nav-links">
          <a href="${L.guidePath}" class="nav-back">${L.ui.navGuide}</a>
          <a href="${L.appPath}" class="nav-back">${L.ui.navApp}</a>
          <div class="lang-switch">${switcher}</div>
        </div>
      </nav>
    </div>
  </header>
  <main>`
}

function footer(L) {
  return `
  </main>
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>${L.ui.footer}</div>
        <ul class="footer-links">
          <li><a href="${L.guidePath}">${L.ui.navGuide}</a></li>
          <li><a href="mailto:skudev6@gmail.com">email</a></li>
          <li><a href="https://matiseekk-dot.github.io/babylog/privacy.html" target="_blank" rel="noopener">${L.ui.privacy}</a></li>
        </ul>
      </div>
    </div>
  </footer>
</body>
</html>
`
}

const guideCard = (L, a) =>
  `<a class="guide-card" href="${L.guidePath}${a.slug}/"><span class="guide-emoji">${a.emoji}</span><h3>${a.title}</h3><p>${a.teaser}</p></a>`

function block(b) {
  if (b.h2) return `<h2>${b.h2}</h2>`
  if (b.p) return `<p>${b.p}</p>`
  if (b.ul) return `<ul>${b.ul.map(li => `<li>${li}</li>`).join('')}</ul>`
  if (b.ol) return `<ol>${b.ol.map(li => `<li>${li}</li>`).join('')}</ol>`
  if (b.callout) return `<div class="callout"><div class="callout-title">${b.callout.title}</div><p>${b.callout.text}</p></div>`
  if (b.table) {
    const n = b.table.head.length
    return `<div class="table-wrap"><table><thead><tr>${b.table.head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${
      b.table.rows.map(r => `<tr${r[n] ? ' class="urgent"' : ''}>${r.slice(0, n).map((c, i) =>
        `<td${i === 1 ? ' class="num"' : ''}>${i === 0 ? `<strong>${c}</strong>` : c}</td>`).join('')}</tr>`).join('')
    }</tbody></table></div>`
  }
  throw new Error('Nieznany blok: ' + JSON.stringify(b))
}

// ─── Strony ──────────────────────────────────────────────────────────────────

function landingPage(L) {
  const T = L.landing
  const url = landingUrl(L)
  const alts = alternates(landingUrl)
  const img = `/assets/sr/${L.lang}`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'MobileApplication',
    name: L.appName,
    alternateName: L.lang === 'pl' ? 'Calm Parent' : 'Spokojny Rodzic',
    operatingSystem: 'Android',
    applicationCategory: 'HealthApplication',
    inLanguage: L.lang,
    description: T.description,
    url: SITE + url,
    installUrl: 'https://play.google.com/store/apps/details?id=pl.skudev.spokojnyrodzic',
    image: `${SITE}${img}/og.jpg`,
    offers: { '@type': 'Offer', price: '0', priceCurrency: L.currency },
    author: { '@type': 'Person', name: 'Mateusz', url: `${SITE}/` },
  }
  return `${head({ L, title: T.title, description: T.description, url, image: `${img}/og.jpg`, alts, jsonLd, type: 'website' })}
${header(L, `skudev · <em>${L.appName.toLowerCase()}</em>`, alts)}

    <section class="hero">
      <div class="container">
        <div class="hero-eyebrow">${T.eyebrow}</div>
        <h1>${T.h1}</h1>
        <p class="hero-lead">${T.lead}</p>
        <div class="hero-ctas">
          <a class="btn btn-play" href="${play('web', `${L.lang}-hero`)}" rel="noopener">${PLAY_ICON}${L.ui.cta}</a>
          <a class="btn btn-ghost" href="${L.guidePath}">${T.guideButton}</a>
        </div>
        <div class="hero-status">${T.status}</div>
      </div>
    </section>

    <section class="story">
      <div class="container">
        <div class="story-inner">
          <div class="story-label">${T.storyLabel}</div>
          <p class="story-quote">${T.story}</p>
          <div class="story-author">${T.storyAuthor}</div>
        </div>
      </div>
    </section>

    <section class="features">
      <div class="container">
        <div class="section-label">${T.featuresLabel}</div>
        <h2 class="section-title">${T.featuresTitle}</h2>
        <div class="features-grid">
          ${T.features.map((f, i) => `<div class="feature">
            <div class="feature-num">${String(i + 1).padStart(2, '0')}</div>
            <span class="feature-emoji">${f.emoji}</span>
            <h3>${f.title}</h3>
            <p>${f.text}</p>
          </div>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="preview">
      <div class="container">
        <div class="section-label">${T.previewLabel}</div>
        <h2 class="section-title">${T.previewTitle}</h2>
        <div class="phones-row">
          ${T.phones.map(p => `<div class="phone">
            <div class="phone-frame">
              <div class="phone-screen">
                <img src="${img}/${p.img}.webp" width="600" height="1200" loading="lazy" alt="${attr(p.alt)}">
              </div>
            </div>
            <div class="phone-meta">
              <div class="phone-label">${p.label}</div>
              <div class="phone-title">${p.title}</div>
              <div class="phone-desc">${p.desc}</div>
            </div>
          </div>`).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="guides">
      <div class="container">
        <div class="section-label">${T.guidesLabel}</div>
        <h2 class="section-title">${L.index.h1}</h2>
        <div class="guide-grid">
          ${L.articles.map(a => guideCard(L, a)).join('\n          ')}
        </div>
      </div>
    </section>

    <section class="cta">
      <div class="container">
        <div class="cta-inner">
          <div class="section-label">${T.ctaLabel}</div>
          <h2 class="cta-title">${T.ctaTitle}</h2>
          <p class="cta-lead">${T.ctaLead}</p>
          <a class="btn btn-play" href="${play('web', `${L.lang}-cta`)}" rel="noopener">${PLAY_ICON}${L.ui.cta}</a>
          <p class="disclaimer">${T.disclaimer}</p>
        </div>
      </div>
    </section>
${footer(L)}`
}

function articlePage(L, a) {
  const url = articleUrl(L, a.id)
  const alts = alternates(X => articleUrl(X, a.id))
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: a.title,
        description: a.description,
        inLanguage: L.lang,
        datePublished: UPDATED,
        dateModified: UPDATED,
        mainEntityOfPage: SITE + url,
        image: `${SITE}/assets/sr/${L.lang}/og.jpg`,
        author: { '@type': 'Person', name: 'Mateusz', url: `${SITE}/` },
        publisher: { '@type': 'Organization', name: 'skudev', url: `${SITE}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: L.ui.guideName, item: SITE + L.guidePath },
          { '@type': 'ListItem', position: 2, name: a.title, item: SITE + url },
        ],
      },
    ],
  }
  const related = a.related.map(id => L.articles.find(x => x.id === id))
  return `${head({ L, title: `${a.metaTitle} | ${L.appName}`, description: a.description, url, image: `/assets/sr/${L.lang}/og.jpg`, alts, jsonLd })}
${header(L, `skudev · <em>${L.ui.guideName.toLowerCase()}</em>`, alts)}
    <article class="article">
      <div class="container">
        <div class="crumbs"><a href="${L.guidePath}">${L.ui.guideName}</a> / ${a.title}</div>
        <h1>${a.title}</h1>
        <div class="article-meta">${L.ui.updated}: ${L.ui.date} · ${L.ui.basedOn}: ${a.basedOn}</div>

        <div class="answer">
          <div class="answer-label">${L.ui.answer}</div>
          <p>${a.answer}</p>
        </div>

        ${a.blocks.map(block).join('\n        ')}

        <div class="app-card">
          <img src="/spokojny-rodzic/icon-192.png" alt="" width="64" height="64">
          <div>
            <h3>${L.appName}</h3>
            <p>${a.app} ${L.ui.appSuffix}</p>
            <a class="btn btn-play" href="${play('poradnik', `${L.lang}-${a.id}`)}" rel="noopener">${L.ui.cta}</a>
          </div>
        </div>

        <div class="sources">
          <h2>${L.ui.sources}</h2>
          <ul>${a.sources.map(s => `<li>${s}</li>`).join('')}</ul>
          <p style="margin-top:14px">${L.ui.articleDisclaimer}</p>
        </div>

        <div class="related">
          <h2>${L.ui.related}</h2>
          <div class="guide-grid">
            ${related.map(r => guideCard(L, r)).join('\n            ')}
          </div>
        </div>
      </div>
    </article>
${footer(L)}`
}

function indexPage(L) {
  const url = indexUrl(L)
  const alts = alternates(indexUrl)
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: L.index.title,
    url: SITE + url,
    inLanguage: L.lang,
    hasPart: L.articles.map(a => ({ '@type': 'Article', headline: a.title, url: SITE + articleUrl(L, a.id) })),
  }
  return `${head({ L, title: `${L.index.title} | ${L.appName}`, description: L.index.description, url, image: `/assets/sr/${L.lang}/og.jpg`, alts, jsonLd, type: 'website' })}
${header(L, `skudev · <em>${L.ui.guideName.toLowerCase()}</em>`, alts)}
    <section class="hero">
      <div class="container">
        <div class="hero-eyebrow">${L.index.eyebrow}</div>
        <h1>${L.index.h1}</h1>
        <p class="hero-lead">${L.index.lead}</p>
      </div>
    </section>
    <section class="guides" style="border-top:none;padding-top:0">
      <div class="container">
        <div class="guide-grid">
          ${L.articles.map(a => guideCard(L, a)).join('\n          ')}
        </div>
        <p class="disclaimer">${L.index.disclaimer}</p>
      </div>
    </section>
${footer(L)}`
}

// ─── Mapa stron ──────────────────────────────────────────────────────────────

function sitemap() {
  const groups = [
    alternates(landingUrl),
    alternates(indexUrl),
    ...pl.articles.map(a => alternates(X => articleUrl(X, a.id))),
  ]
  const entries = groups.flatMap(alts => alts.map(a => `  <url>
    <loc>${a.href}</loc>
    <lastmod>${UPDATED}</lastmod>
${alts.map(x => `    <xhtml:link rel="alternate" hreflang="${x.lang}" href="${x.href}"/>`).join('\n')}
  </url>`))
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${entries.join('\n')}
</urlset>
`
}

// ─── Zapis ───────────────────────────────────────────────────────────────────

// Po francusku spacja przed ? : ! ; ma się nie łamać (typografia francuska).
const NBSP = String.fromCharCode(160)
const frenchSpaces = html => html.replace(/ ([?:!;])/g, (m, p) => NBSP + p)

function write(L, rel, html) {
  const file = path.join(ROOT, rel, 'index.html')
  fs.mkdirSync(path.dirname(file), { recursive: true })
  fs.writeFileSync(file, L.lang === 'fr' ? frenchSpaces(html) : html)
}

for (const L of LANGS) {
  if (L.articles.length !== pl.articles.length) throw new Error(`${L.lang}: brak artykułów`)
  write(L, L.appPath, landingPage(L))
  write(L, L.guidePath, indexPage(L))
  for (const a of L.articles) write(L, `${L.guidePath}${a.slug}/`, articlePage(L, a))
}
fs.writeFileSync(path.join(ROOT, SITEMAP), sitemap())

const robotsFile = path.join(ROOT, 'robots.txt')
const robots = fs.readFileSync(robotsFile, 'utf8')
if (!robots.includes(SITEMAP)) fs.writeFileSync(robotsFile, robots.trimEnd() + `\nSitemap: ${SITE}/${SITEMAP}\n`)

console.log(`${LANGS.length} języków: strona aplikacji, poradnik i ${pl.articles.length} artykułów w każdym; ${SITEMAP}`)
