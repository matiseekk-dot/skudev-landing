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
import crypto from 'crypto'
import path from 'path'
import { fileURLToPath } from 'url'
import pl from './content/pl.mjs'
import en from './content/en.mjs'
import de from './content/de.mjs'
import fr from './content/fr.mjs'
import es from './content/es.mjs'
import { VIDEOS, VIDEO_UI } from './content/videos.mjs'
import PREGNANCY from './content/pregnancy.mjs'
import { EXAM_PERIODS, EXAM_VISITS_NOTE } from './content/exams-pl.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://skudev.pl'
const UPDATED = '2026-09-27'
// Artykuł z własną datą (pole published, ISO) pokazuje ją w języku strony.
const articleDate = (L, a) => (a.published
  ? new Intl.DateTimeFormat(L.lang, { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(`${a.published}T12:00:00`))
  : L.ui.date)
const LANGS = [pl, en, de, fr, es]
// Ciąża (paź 2026): narzędzia i artykuły ciążowe przed artykułami o niemowlęciu.
for (const L of LANGS) {
  const P = PREGNANCY[L.lang]
  L.pui = P.ui
  L.tools = P.tools
  L.articles = [...P.articles, ...L.articles.filter(a => !P.articles.some(x => x.id === a.id))]
}
const X_DEFAULT = 'en'
const SITEMAP = 'sitemap-spokojny-rodzic.xml'

// Wersja w adresie arkusza stylów: po każdej zmianie sr.css przeglądarki
// pobierają nowy plik zamiast trzymać stary w pamięci (GitHub Pages: 10 min).
const CSS_VERSION = crypto.createHash('md5').update(fs.readFileSync(path.join(ROOT, 'assets', 'sr.css'))).digest('hex').slice(0, 8)

const play = (medium, campaign) =>
  `https://play.google.com/store/apps/details?id=pl.skudev.spokojnyrodzic&amp;referrer=utm_source%3Dskudev%26utm_medium%3D${medium}%26utm_campaign%3D${campaign}`

const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 2.5v19l10-9.5L4 2.5zm11.4 10.8l2.6 2.5-11.2 6.3 8.6-8.8zm0-2.6L6.8 1.9 18 8.2l-2.6 2.5zm4.3-1.5l3 1.7c.8.5.8 1.7 0 2.2l-3 1.7-2.8-2.8 2.8-2.8z"/></svg>'

const attr = s => String(s).replace(/&(?!amp;)/g, '&amp;').replace(/"/g, '&quot;')
const plain = s => String(s).replace(/<[^>]+>/g, '')

// ─── Adresy i odpowiedniki w innych językach ─────────────────────────────────

const landingUrl = L => L.appPath
const indexUrl = L => L.guidePath
const articleUrl = (L, id) => `${L.guidePath}${L.articles.find(a => a.id === id).slug}/`
const articleUrlOrNull = (L, id) => (hasArticle(L, id) ? articleUrl(L, id) : null)
const toolUrl = (L, id) => `${L.guidePath}${L.tools.find(t => t.id === id).slug}/`

function alternates(urlFor) {
  return LANGS.map(L => {
    const rel = urlFor(L)
    return rel ? { lang: L.lang, href: SITE + rel } : { lang: L.lang, href: SITE + L.guidePath, missing: true }
  })
}
const hasArticle = (L, id) => L.articles.some(a => a.id === id)

// ─── Wspólne kawałki HTML ────────────────────────────────────────────────────

function head({ L, title, description, url, image, alts, jsonLd, type = 'article' }) {
  const real = alts.filter(a => !a.missing)
  const xdef = real.find(a => a.lang === X_DEFAULT) || real[0]
  return `<!DOCTYPE html>
<html lang="${L.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${plain(title)}</title>
  <meta name="description" content="${attr(description)}">
  <link rel="canonical" href="${SITE}${url}">
${real.map(a => `  <link rel="alternate" hreflang="${a.lang}" href="${a.href}">`).join('\n')}
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
  <link rel="stylesheet" href="/assets/sr.css?v=${CSS_VERSION}">
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

// Ściągawka do druku (PDF w assets/sr/{lang}/), na stronie poradnika i przy gorączce/objawach.
const cheatsheetBox = L => (L.cheatsheet
  ? `<div class="callout"><div class="callout-title">${L.cheatsheet.title}</div><p>${L.cheatsheet.text} <a href="/assets/sr/${L.lang}/sciagawka.pdf" download>${L.cheatsheet.link}</a></p></div>`
  : '')
const CHEATSHEET_ARTICLES = new Set(['fever', 'warning', 'thermometer', 'glass'])

// Film z YouTube (content/videos.mjs): na stronie najpierw nasza okładka,
// odtwarzacz youtube-nocookie ładuje się dopiero po kliknięciu.
const videoFor = (L, a) => VIDEOS[L.lang]?.[a.id]
const videoBlock = (L, a, v) => `<figure class="video">
          <a class="video-link" href="https://www.youtube.com/shorts/${v.id}" data-yt="${v.id}" aria-label="${attr(`${VIDEO_UI[L.lang].play}: ${v.title}`)}">
            <img src="/assets/sr/${L.lang}/video/${a.id}.jpg" alt="" width="360" height="640">
            <span class="video-play" aria-hidden="true"></span>
          </a>
          <figcaption>${VIDEO_UI[L.lang].note(v.sec)}</figcaption>
        </figure>
        <script>
          document.addEventListener('click', function (e) {
            var a = e.target.closest && e.target.closest('a[data-yt]')
            if (!a || e.ctrlKey || e.metaKey || e.shiftKey || e.button) return
            e.preventDefault()
            var f = document.createElement('iframe')
            f.src = 'https://www.youtube-nocookie.com/embed/' + a.getAttribute('data-yt') + '?autoplay=1&playsinline=1&rel=0'
            f.title = a.getAttribute('aria-label')
            f.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen'
            f.allowFullscreen = true
            f.className = 'video-frame'
            a.replaceWith(f)
          })
        </script>`
const videoLd = (L, a, v) => ({
  '@type': 'VideoObject',
  name: v.title,
  description: a.description,
  thumbnailUrl: `${SITE}/assets/sr/${L.lang}/video/${a.id}.jpg`,
  uploadDate: v.date,
  duration: `PT${v.sec}S`,
  embedUrl: `https://www.youtube.com/embed/${v.id}`,
  url: `https://www.youtube.com/shorts/${v.id}`,
  inLanguage: L.lang,
})

const guideCard = (L, a) => {
  const v = videoFor(L, a)
  const badge = v ? `<span class="guide-video" aria-hidden="true">▶ ${v.sec} s</span>` : ''
  return `<a class="guide-card" href="${L.guidePath}${a.slug}/"><span class="guide-emoji">${a.emoji}</span>${badge}<h3>${a.title}</h3><p>${a.teaser}</p></a>`
}

const toolCard = (L, tool) =>
  `<a class="guide-card tool-card" href="${toolUrl(L, tool.id)}"><span class="guide-emoji">${tool.emoji}</span><span class="guide-video" aria-hidden="true">${L.pui.tools}</span><h3>${tool.title}</h3><p>${tool.teaser}</p></a>`

// Odnośnik z artykułu do narzędzia (np. torba do szpitala → kalkulator terminu).
const toolBox = (L, id) => {
  const tool = L.tools.find(t => t.id === id)
  return tool ? `<a class="tool-box" href="${toolUrl(L, id)}"><span class="tool-box-emoji">${tool.emoji}</span><span>${L.pui.toolCta}</span><span aria-hidden="true">›</span></a>` : ''
}

// Sekcje poradnika: ciąża i niemowlę osobno.
const sectionGrid = (L, section) => {
  const list = L.articles.filter(a => (a.section || 'baby') === section)
  return list.length ? `<h2 class="guide-section-title">${L.pui[section]}</h2>
        <div class="guide-grid">
          ${list.map(a => guideCard(L, a)).join('\n          ')}
        </div>` : ''
}

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
                <img src="${img}/${p.img}.webp" width="600" height="1200" alt="${attr(p.alt)}">
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
          ${L.tools.map(tool => toolCard(L, tool)).join('\n          ')}
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
  const alts = alternates(X => articleUrlOrNull(X, a.id))
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: a.title,
        description: a.description,
        inLanguage: L.lang,
        datePublished: a.published || UPDATED,
        dateModified: a.published || UPDATED,
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
  const video = videoFor(L, a)
  if (video) jsonLd['@graph'].push(videoLd(L, a, video))
  const related = a.related.map(id => L.articles.find(x => x.id === id))
  return `${head({ L, title: `${a.metaTitle} | ${L.appName}`, description: a.description, url, image: `/assets/sr/${L.lang}/og.jpg`, alts, jsonLd })}
${header(L, `skudev · <em>${L.ui.guideName.toLowerCase()}</em>`, alts)}
    <article class="article">
      <div class="container">
        <div class="crumbs"><a href="${L.guidePath}">${L.ui.guideName}</a> / ${a.title}</div>
        <h1>${a.title}</h1>
        <div class="article-meta">${L.ui.updated}: ${articleDate(L, a)} · ${L.ui.basedOn}: ${a.basedOn}</div>

        <div class="answer">
          <div class="answer-label">${L.ui.answer}</div>
          <p>${a.answer}</p>
        </div>

        ${video ? videoBlock(L, a, video) : ''}
        ${a.tool ? toolBox(L, a.tool) : ''}
        ${a.blocks.map(b => articleBlock(L, b)).join('\n        ')}
        ${CHEATSHEET_ARTICLES.has(a.id) ? cheatsheetBox(L) : ''}

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
    hasPart: [
      ...L.tools.map(tool => ({ '@type': 'WebApplication', name: tool.title, url: SITE + toolUrl(L, tool.id) })),
      ...L.articles.map(a => ({ '@type': 'Article', headline: a.title, url: SITE + articleUrl(L, a.id) })),
    ],
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
        <h2 class="guide-section-title">${L.pui.tools}</h2>
        <div class="guide-grid">
          ${L.tools.map(tool => toolCard(L, tool)).join('\n          ')}
        </div>
        ${sectionGrid(L, 'pregnancy')}
        ${sectionGrid(L, 'baby')}
        ${cheatsheetBox(L)}
        <p class="disclaimer">${L.index.disclaimer}</p>
      </div>
    </section>
${footer(L)}`
}

// ─── Harmonogram badań (PL) i plik .ics ─────────────────────────────────────
// Dane: content/exams-pl.mjs (kopia babylog/src/data/pregnancyExamsPl.js).
// Plik .ics powstaje w przeglądarce z terminu porodu: jedno wydarzenie całodniowe
// na początek każdego okresu badań, z przypomnieniem dzień wcześniej.

const scheduleHtml = () => `<div class="exam-list">
          ${EXAM_PERIODS.map(p => `<div class="exam-period"><div class="exam-when">${p.when}</div><ul>${p.tests.map(x => `<li>${x}</li>`).join('')}</ul></div>`).join('\n          ')}
        </div>
        <p>${EXAM_VISITS_NOTE}</p>`

const ICS_JS = String.raw`(function () {
  var C = JSON.parse(document.getElementById('ics-data').textContent)
  var $ = function (id) { return document.getElementById(id) }
  var DAY = 864e5
  function pad(n) { return (n < 10 ? '0' : '') + n }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) }
  function noon(s) { var d = new Date(s + 'T12:00:00'); return isNaN(d.getTime()) ? null : d }
  function add(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x }
  function diff(a, b) { return Math.round((noon(ymd(b)) - noon(ymd(a))) / DAY) }
  function icsDate(d) { return d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) }
  function esc(s) { return String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n') }
  // Linie .ics najwyżej 75 bajtów: dłuższe łamiemy (kontynuacja od spacji).
  function fold(line) {
    var out = [], cur = '', bytes = 0
    for (var i = 0; i < line.length; i++) {
      var ch = line[i], b = unescape(encodeURIComponent(ch)).length
      if (bytes + b > 73) { out.push(cur); cur = ' '; bytes = 1 }
      cur += ch; bytes += b
    }
    out.push(cur)
    return out.join('\r\n')
  }
  var today = noon(ymd(new Date()))
  var input = $('ics-due')
  input.min = ymd(add(today, -14))
  input.max = ymd(add(today, 280))
  $('ics-form').addEventListener('submit', function (e) {
    e.preventDefault()
    var due = noon(input.value)
    $('ics-msg').textContent = ''
    if (!due || diff(today, due) < -14 || diff(today, due) > 280) { $('ics-msg').textContent = C.error; return }
    var lmp = add(due, -280)
    var stamp = new Date().toISOString().replace(/[-:]/g, '').replace(/\.\d+Z$/, 'Z')
    var lines = ['BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//skudev.pl//Spokojny Rodzic//PL', 'CALSCALE:GREGORIAN', 'METHOD:PUBLISH', 'X-WR-CALNAME:' + esc(C.eventPrefix)]
    C.periods.forEach(function (p) {
      var start = add(lmp, p.startWeek * 7)
      var end = add(lmp, p.endWeek * 7 + 6)
      if (diff(end, today) > 0) return
      if (diff(start, today) > 0) start = today
      lines.push('BEGIN:VEVENT', 'UID:' + p.id + '-' + ymd(due) + '@skudev.pl', 'DTSTAMP:' + stamp,
        'DTSTART;VALUE=DATE:' + icsDate(start), 'DTEND;VALUE=DATE:' + icsDate(add(start, 1)),
        'SUMMARY:' + esc(C.eventPrefix + ': ' + p.when),
        'DESCRIPTION:' + esc(p.tests.map(function (x) { return '• ' + x }).join('\n')),
        'BEGIN:VALARM', 'ACTION:DISPLAY', 'DESCRIPTION:' + esc(C.eventPrefix), 'TRIGGER:-PT15H', 'END:VALARM',
        'END:VEVENT')
    })
    lines.push('END:VCALENDAR')
    var blob = new Blob([lines.map(fold).join('\r\n') + '\r\n'], { type: 'text/calendar;charset=utf-8' })
    var a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = C.fileName
    document.body.appendChild(a)
    a.click()
    setTimeout(function () { URL.revokeObjectURL(a.href); a.remove() }, 1000)
    $('ics-msg').textContent = C.done
  })
})()`

const icsHtml = c => `<form class="calc" id="ics-form" novalidate>
          <h2 style="margin:0">${c.title}</h2>
          <div class="calc-row">
            <label for="ics-due">${c.label}</label>
            <input type="date" id="ics-due" required>
            <p class="calc-hint">${c.noDue}</p>
          </div>
          <button type="submit" class="btn btn-play calc-btn">${c.button}</button>
          <p class="calc-hint" id="ics-msg" role="status" aria-live="polite"></p>
          <p class="calc-hint">${c.note}</p>
        </form>
        <script type="application/json" id="ics-data">${jsonForScript({ ...c, periods: EXAM_PERIODS })}</script>
        <script>${ICS_JS}</script>`

function articleBlock(L, b) {
  if (b.schedule) return scheduleHtml()
  if (b.ics) return icsHtml(b.ics)
  return block(b)
}

// ─── Kalkulator terminu porodu ──────────────────────────────────────────────
// Liczy w przeglądarce, daty nigdzie nie wychodzą. Teksty z content/pregnancy.mjs
// lecą w <script type="application/json">, logika w DUE_DATE_JS.

const jsonForScript = obj => JSON.stringify(obj).replace(/</g, '\\u003c')

const DUE_DATE_JS = String.raw`(function () {
  var C = JSON.parse(document.getElementById('calc-data').textContent)
  var $ = function (id) { return document.getElementById(id) }
  var DAY = 864e5
  function pad(n) { return (n < 10 ? '0' : '') + n }
  function ymd(d) { return d.getFullYear() + '-' + pad(d.getMonth() + 1) + '-' + pad(d.getDate()) }
  function noon(s) { var d = new Date(s + 'T12:00:00'); return isNaN(d.getTime()) ? null : d }
  function add(d, n) { var x = new Date(d.getTime()); x.setDate(x.getDate() + n); return x }
  function diff(a, b) { return Math.round((noon(ymd(b)) - noon(ymd(a))) / DAY) }
  function tpl(s, v) { return s.replace(/\{(\w+)\}/g, function (m, k) { return v[k] }) }
  function plural(arr, n) { return tpl(n === 1 ? arr[0] : arr[1], { n: n }) }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c] }) }
  var fmt = new Intl.DateTimeFormat(C.lang, { day: 'numeric', month: 'long', year: 'numeric' })
  var today = noon(ymd(new Date()))
  var method = $('calc-method'), date = $('calc-date'), res = $('calc-res'), err = $('calc-err')
  function sync() {
    var m = method.value
    $('calc-date-label').textContent = C.form.dateLabels[m]
    $('calc-cycle-row').hidden = m !== 'lmp'
    date.max = ymd(m === 'due' ? add(today, C.termDays) : today)
    date.min = ymd(m === 'due' ? add(today, -28) : add(today, -44 * 7))
  }
  method.addEventListener('change', function () { sync(); res.hidden = true; err.textContent = '' })
  sync()
  $('calc-form').addEventListener('submit', function (e) {
    e.preventDefault()
    err.textContent = ''
    var m = method.value, d = noon(date.value)
    if (!d) { err.textContent = C.errors.empty; res.hidden = true; return }
    var cycle = Math.min(45, Math.max(21, parseInt($('calc-cycle').value, 10) || 28))
    var lmp = m === 'lmp' ? add(d, cycle - 28) : m === 'conception' ? add(d, -14) : add(d, -C.termDays)
    var elapsed = diff(lmp, today)
    if (elapsed < 0 || elapsed > 44 * 7) { err.textContent = C.errors.range; res.hidden = true; return }
    var due = add(lmp, C.termDays)
    var w = Math.floor(elapsed / 7), v = { week: w + 1, w: w, d: elapsed % 7 }
    var left = diff(today, due)
    var tri = w < 14 ? 1 : w < 28 ? 2 : 3
    $('r-due').textContent = fmt.format(due)
    $('r-week').textContent = tpl(C.fmt.weekBig, v)
    $('r-week-small').textContent = tpl(C.fmt.weekSmall, v)
    $('r-tri').textContent = Array.isArray(C.fmt.trimester) ? C.fmt.trimester[tri - 1] : tpl(C.fmt.trimester, { n: tri })
    $('r-left').textContent = left > 0 ? plural(C.fmt.days, left) : left === 0 ? C.fmt.today : plural(C.fmt.overdue, -left)
    var at = { t1: 13 * 7 + 6, t2: 27 * 7 + 6, term: 37 * 7, due: C.termDays, post: 42 * 7 }
    $('r-ms').innerHTML = C.milestones.map(function (k) {
      var dt = add(lmp, at[k])
      return '<li' + (diff(dt, today) > 0 ? ' class="past"' : '') + '><span>' + esc(C.result.ms[k]) + '</span><strong>' + esc(fmt.format(dt)) + '</strong></li>'
    }).join('')
    res.hidden = false
    res.scrollIntoView({ behavior: 'smooth', block: 'start' })
  })
})()`

function dueDatePage(L, tool) {
  const url = toolUrl(L, tool.id)
  const alts = alternates(X => toolUrl(X, tool.id))
  const F = tool.form
  const R = tool.result
  const milestones = tool.milestones || ['t1', 't2', 'term', 'due', 'post']
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'WebApplication',
        name: tool.title,
        description: tool.description,
        url: SITE + url,
        inLanguage: L.lang,
        applicationCategory: 'HealthApplication',
        operatingSystem: 'Any',
        offers: { '@type': 'Offer', price: '0', priceCurrency: L.currency },
      },
      {
        '@type': 'FAQPage',
        mainEntity: tool.faq.map(x => ({ '@type': 'Question', name: x.q, acceptedAnswer: { '@type': 'Answer', text: x.a } })),
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: L.ui.guideName, item: SITE + L.guidePath },
          { '@type': 'ListItem', position: 2, name: tool.title, item: SITE + url },
        ],
      },
    ],
  }
  const data = { lang: L.lang, termDays: tool.termDays, form: F, result: R, fmt: tool.fmt, errors: tool.errors, milestones }
  const related = tool.related.map(id => L.articles.find(x => x.id === id))
  return `${head({ L, title: `${tool.metaTitle} | ${L.appName}`, description: tool.description, url, image: `/assets/sr/${L.lang}/og.jpg`, alts, jsonLd, type: 'website' })}
${header(L, `skudev · <em>${L.ui.guideName.toLowerCase()}</em>`, alts)}
    <article class="article">
      <div class="container">
        <div class="crumbs"><a href="${L.guidePath}">${L.ui.guideName}</a> / ${tool.title}</div>
        <h1>${tool.title}</h1>
        <div class="answer">
          <div class="answer-label">${L.ui.answer}</div>
          <p>${tool.answer}</p>
        </div>

        <form class="calc" id="calc-form" novalidate>
          <div class="calc-row">
            <label for="calc-method">${F.method}</label>
            <select id="calc-method">
              ${['lmp', 'conception', 'due'].map(m => `<option value="${m}">${F.methods[m]}</option>`).join('')}
            </select>
          </div>
          <div class="calc-row">
            <label for="calc-date" id="calc-date-label">${F.dateLabels.lmp}</label>
            <input type="date" id="calc-date" required>
          </div>
          <div class="calc-row" id="calc-cycle-row">
            <label for="calc-cycle">${F.cycle}</label>
            <input type="number" id="calc-cycle" min="21" max="45" value="28" inputmode="numeric">
            <p class="calc-hint">${F.cycleHint}</p>
          </div>
          <button type="submit" class="btn btn-play calc-btn">${F.button}</button>
          <p class="calc-error" id="calc-err" role="alert"></p>
        </form>

        <section class="calc-result" id="calc-res" hidden aria-live="polite">
          <div class="calc-due"><span>${R.due}</span><strong id="r-due"></strong></div>
          <div class="calc-stats">
            <div><strong id="r-week"></strong><span id="r-week-small"></span></div>
            <div><strong id="r-tri"></strong><span>${R.trimester}</span></div>
            <div><strong id="r-left"></strong><span>${R.left}</span></div>
          </div>
          <h2>${R.milestones}</h2>
          <ul class="calc-ms" id="r-ms"></ul>
          <div class="app-card">
            <img src="/spokojny-rodzic/icon-192.png" alt="" width="64" height="64">
            <div>
              <h3>${R.saveTitle}</h3>
              <p>${R.saveText}</p>
              <a class="btn btn-play" href="${play('narzedzie', `${L.lang}-termin`)}" rel="noopener">${L.ui.cta}</a>
            </div>
          </div>
        </section>

        ${tool.blocks.map(block).join('\n        ')}

        <h2>${L.pui.faq}</h2>
        <div class="faq">
          ${tool.faq.map(x => `<details><summary>${x.q}</summary><p>${x.a}</p></details>`).join('\n          ')}
        </div>

        <div class="sources">
          <h2>${L.ui.sources}</h2>
          <ul>${tool.sources.map(src => `<li>${src}</li>`).join('')}</ul>
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
    <script type="application/json" id="calc-data">${jsonForScript(data)}</script>
    <script>${DUE_DATE_JS}</script>
${footer(L)}`
}

// ─── Mapa stron ──────────────────────────────────────────────────────────────

function sitemap() {
  const groups = [
    alternates(landingUrl),
    alternates(indexUrl),
    ...pl.tools.map(tool => alternates(X => toolUrl(X, tool.id))),
    ...pl.articles.map(a => alternates(X => articleUrlOrNull(X, a.id)).filter(x => !x.missing)),
  ]
  const entries = groups.map(alts => alts.filter(x => !x.missing)).flatMap(alts => alts.map(a => `  <url>
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
  const missing = pl.articles.filter(x => !(x.onlyLangs && !x.onlyLangs.includes(L.lang)) && !hasArticle(L, x.id))
  if (missing.length) throw new Error(`${L.lang}: brak artykułów ${missing.map(x => x.id).join(", ")}`)
  write(L, L.appPath, landingPage(L))
  write(L, L.guidePath, indexPage(L))
  for (const a of L.articles) write(L, `${L.guidePath}${a.slug}/`, articlePage(L, a))
  for (const tool of L.tools) write(L, `${L.guidePath}${tool.slug}/`, dueDatePage(L, tool))
}
fs.writeFileSync(path.join(ROOT, SITEMAP), sitemap())

const robotsFile = path.join(ROOT, 'robots.txt')
const robots = fs.readFileSync(robotsFile, 'utf8')
if (!robots.includes(SITEMAP)) fs.writeFileSync(robotsFile, robots.trimEnd() + `\nSitemap: ${SITE}/${SITEMAP}\n`)

console.log(`${LANGS.length} języków: strona aplikacji, poradnik, ${pl.tools.length} narzędzie, artykuły: ${LANGS.map(L => L.lang + " " + L.articles.length).join(", ")}; ${SITEMAP}`)
