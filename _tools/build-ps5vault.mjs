// Builds the PS5 Vault landing pages in 7 languages from one template:
//   ps5-vault/index.html (pl), ps5-vault/{en,es,de,fr,it,pt}/index.html
//   sitemap-ps5-vault.xml (every page with hreflang alternates)
// Texts: _tools/content/ps5vault.mjs · styles: _tools/content/ps5vault.css
// Link previews: /assets/ps5/<lang>/og.jpg (1200x630), made separately.
// Run: node _tools/build-ps5vault.mjs
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { PAGES, SHARED } from './content/ps5vault.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://skudev.pl';
const PLAY = 'https://play.google.com/store/apps/details?id=com.skudev.ps5vault';
const CSS = fs.readFileSync(path.join(ROOT, '_tools/content/ps5vault.css'), 'utf8');
const TODAY = new Date().toISOString().slice(0, 10);
const X_DEFAULT = PAGES.find(p => p.lang === 'en');

const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
const strip = s => String(s).replace(/<[^>]+>/g, '');
const playUrl = (L, where) => `${PLAY}&amp;referrer=utm_source%3Dskudev%26utm_medium%3Dweb%26utm_campaign%3D${where}%26utm_content%3D${L.lang}`;
const PLAY_ICON = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4 2.5v19l10-9.5L4 2.5zm11.4 10.8l2.6 2.5-11.2 6.3 8.6-8.8zm0-2.6L6.8 1.9 18 8.2l-2.6 2.5zm4.3-1.5l3 1.7c.8.5.8 1.7 0 2.2l-3 1.7-2.8-2.8 2.8-2.8z"/></svg>';
const FAVICON = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='22' fill='%231A1F18'/%3E%3Ctext x='50' y='68' font-size='52' text-anchor='middle' fill='%23D4A547' font-family='monospace' font-weight='700'%3EV%3C/text%3E%3C/svg%3E";
const ogImage = L => `${SITE}/assets/ps5/${L.lang}/og.jpg`;

function head(L) {
  const jsonLd = [
    {
      '@context': 'https://schema.org', '@type': 'SoftwareApplication', name: 'PS5 Vault',
      operatingSystem: 'Android', applicationCategory: 'LifestyleApplication', inLanguage: L.locale,
      description: L.description, url: SITE + L.path, downloadUrl: PLAY, image: ogImage(L),
      offers: { '@type': 'Offer', price: '0', priceCurrency: L.currency },
    },
    {
      '@context': 'https://schema.org', '@type': 'FAQPage', inLanguage: L.locale,
      mainEntity: L.faq.map(([q, a]) => ({ '@type': 'Question', name: q, acceptedAnswer: { '@type': 'Answer', text: strip(a) } })),
    },
  ];
  return `<!DOCTYPE html>
<html lang="${L.lang === 'pt' ? 'pt-BR' : L.lang}">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(L.title)}</title>
  <meta name="description" content="${esc(L.description)}">
  <link rel="canonical" href="${SITE}${L.path}">
${PAGES.map(p => `  <link rel="alternate" hreflang="${p.lang}" href="${SITE}${p.path}">`).join('\n')}
  <link rel="alternate" hreflang="x-default" href="${SITE}${X_DEFAULT.path}">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="SkuDev">
  <meta property="og:url" content="${SITE}${L.path}">
  <meta property="og:title" content="${esc(L.ogTitle)}">
  <meta property="og:description" content="${esc(L.ogDescription)}">
  <meta property="og:image" content="${ogImage(L)}">
  <meta property="og:image:width" content="1200">
  <meta property="og:image:height" content="630">
  <meta property="og:image:alt" content="${esc(strip(L.og.headline.join('')))}">
  <meta property="og:locale" content="${L.ogLocale}">
${PAGES.filter(p => p !== L).map(p => `  <meta property="og:locale:alternate" content="${p.ogLocale}">`).join('\n')}
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${esc(L.ogTitle)}">
  <meta name="twitter:description" content="${esc(L.ogDescription)}">
  <meta name="twitter:image" content="${ogImage(L)}">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=JetBrains+Mono:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">

  <link rel="icon" type="image/svg+xml" href="${FAVICON}">
  <script type="application/ld+json">${JSON.stringify(jsonLd).replace(/</g, '\\u003c')}</script>

  <style>
${CSS}  </style>
</head>`;
}

function calcSection(L) {
  const C = L.calc, D = L.defaults;
  const field = (id, label, value) => `            <label class="calc-field"><span>${label}</span><input id="${id}" type="text" inputmode="decimal" autocomplete="off" value="${value}"></label>`;
  return `
    <!-- ═══ CALCULATORS ═══ -->
    <section class="calc" id="calc">
      <div class="container">
        <div class="section-label">${C.label}</div>
        <h2 class="section-title">${C.title}</h2>
        <div class="calc-grid">
          <div class="calc-card" id="shelf">
            <h3>${C.shelfTitle}</h3>
            <p class="calc-sub">${C.shelfSub}</p>
${field('s-games', C.games, D.games)}
${field('s-price', C.price, D.price)}
${field('s-hpw', C.hpw, D.hpw)}
            <div class="calc-out" aria-live="polite">
              <div class="calc-big"><span id="s-value"></span><small>${C.shelfResult}</small></div>
              <div class="calc-line" id="s-time"></div>
              <div class="calc-note">${C.shelfNote}</div>
            </div>
            <button type="button" class="calc-share" id="s-share">${C.share}</button>
            <div class="calc-msg" id="s-msg"></div>
          </div>
          <div class="calc-card" id="cph">
            <h3>${C.cphTitle}</h3>
            <p class="calc-sub">${C.cphSub}</p>
${field('c-price', C.gPrice, D.gPrice)}
${field('c-hours', C.gHours, D.gHours)}
${field('c-resale', C.gResale, D.gResale)}
            <div class="calc-out" aria-live="polite">
              <div class="calc-big"><span id="c-value"></span><small>${C.cphResult}</small></div>
              <div class="calc-line" id="c-verdict"></div>
            </div>
            <button type="button" class="calc-share" id="c-share">${C.share}</button>
            <div class="calc-msg" id="c-msg"></div>
          </div>
        </div>
        <p class="calc-nudge">${C.nudge} <a href="${playUrl(L, 'calc')}" rel="noopener">${C.nudgeLink} →</a></p>
      </div>
    </section>
`;
}

// Calculator logic, shared by every language; the page's texts and currency come in C.
function calcScript(L) {
  const C = { lang: L.lang, locale: L.locale, currency: L.currency, bands: L.bands, ...L.calc };
  return `  <script>
(() => {
  const C = ${JSON.stringify({ lang: C.lang, locale: C.locale, currency: C.currency, bands: C.bands, shelfTime: C.shelfTime, verdicts: C.verdicts, copied: C.copied, shareShelf: C.shareShelf, shareCph: C.shareCph, units: C.units })};
  const $ = id => document.getElementById(id);
  const money = (v, d) => new Intl.NumberFormat(C.locale, { style: 'currency', currency: C.currency, minimumFractionDigits: d, maximumFractionDigits: d }).format(v);
  const num = el => { const v = parseFloat(String(el.value).replace(',', '.')); return isFinite(v) && v >= 0 ? v : 0; };
  const plural = (n, f) => {
    if (f.length === 3) { if (n === 1) return f[0]; const a = n % 10, b = n % 100; return a >= 2 && a <= 4 && (b < 10 || b >= 20) ? f[1] : f[2]; }
    return (C.lang === 'fr' ? n < 2 : n === 1) ? f[0] : f[1];
  };
  const span = weeks => {
    const U = C.units;
    if (weeks < 9) { const w = Math.max(1, Math.round(weeks)); return w + ' ' + plural(w, U.week); }
    const m = Math.round(weeks / 4.345);
    if (m < 12) return m + ' ' + plural(m, U.month);
    const y = Math.floor(m / 12), r = m % 12;
    return y + ' ' + plural(y, U.year) + (r ? ' ' + U.and + ' ' + r + ' ' + plural(r, U.month) : '');
  };
  const SHELF = ['s-games', 's-price', 's-hpw'], CPH = ['c-price', 'c-hours', 'c-resale'];
  function shelf() {
    const g = num($('s-games')), p = num($('s-price')), h = num($('s-hpw')) || 1, hours = Math.round(g * 25);
    $('s-value').textContent = money(g * p, 0);
    $('s-time').textContent = C.shelfTime.replace('{hours}', hours.toLocaleString(C.locale)).replace('{time}', span(hours / h)).replace('{hpw}', h);
  }
  function cph() {
    const p = num($('c-price')), h = num($('c-hours')), r = num($('c-resale'));
    const v = h > 0 ? Math.max(0, p - r) / h : 0, b = C.bands;
    $('c-value').textContent = money(v, 2);
    $('c-verdict').textContent = h > 0 ? C.verdicts[v <= b[0] ? 0 : v <= b[1] ? 1 : v <= b[2] ? 2 : 3] : '';
  }
  // A shared link carries the numbers: ?shelf=games_price_hours or ?cph=price_hours_resale
  const q = new URLSearchParams(location.search);
  const fill = (ids, raw) => { if (!raw) return false; raw.split('_').forEach((x, i) => { const v = parseFloat(x); if (ids[i] && isFinite(v) && v >= 0) $(ids[i]).value = v; }); return true; };
  const fromShelf = fill(SHELF, q.get('shelf')), fromCph = fill(CPH, q.get('cph'));
  SHELF.forEach(id => $(id).addEventListener('input', shelf));
  CPH.forEach(id => $(id).addEventListener('input', cph));
  shelf(); cph();
  if (fromShelf || fromCph) setTimeout(() => $(fromShelf ? 'shelf' : 'cph').scrollIntoView({ behavior: 'smooth', block: 'start' }), 250);
  async function share(kind) {
    const ids = kind === 'shelf' ? SHELF : CPH;
    const url = location.origin + location.pathname + '?' + kind + '=' + ids.map(id => num($(id))).join('_') + '#' + kind;
    const text = (kind === 'shelf' ? C.shareShelf : C.shareCph).replace('{value}', $(kind === 'shelf' ? 's-value' : 'c-value').textContent);
    const msg = $(kind === 'shelf' ? 's-msg' : 'c-msg');
    if (navigator.share) { try { await navigator.share({ title: document.title, text, url }); return; } catch (e) { if (e && e.name === 'AbortError') return; } }
    try { await navigator.clipboard.writeText(text + ' ' + url); msg.textContent = C.copied; } catch (e) { window.prompt('', text + ' ' + url); }
  }
  $('s-share').addEventListener('click', () => share('shelf'));
  $('c-share').addEventListener('click', () => share('cph'));
})();
  </script>`;
}

function page(L) {
  const shots = SHARED.shots.map((f, i) => `          <img src="/ps5-vault/screenshots/${L.shots ? L.shots + '/' : ''}${f}.webp" width="720" height="1280" loading="lazy" alt="${esc(L.alts[i])}">`).join('\n');
  const features = L.features.map(([h, p], i) => `          <div class="feature">
            <div class="feature-num">${String(i + 1).padStart(2, '0')}</div>
            <span class="feature-emoji">${SHARED.features[i]}</span>
            <h3>${h}</h3>
            <p>${p}</p>
          </div>`).join('\n\n');
  const P = L.plans;
  return `${head(L)}
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
${PAGES.map(p => `            <a href="${p.path}" class="nav-lang" hreflang="${p.lang}" lang="${p.lang}"${p === L ? ' aria-current="page"' : ''}>${p.lang.toUpperCase()}</a>`).join('\n')}
          </div>
          <a href="/" class="nav-back">${L.navBack}</a>
        </div>
      </nav>
    </div>
  </header>

  <main>

    <!-- ═══ HERO ═══ -->
    <section class="hero">
      <div class="container">
        <div class="hero-eyebrow">${L.eyebrow}</div>
        <h1>${L.h1}</h1>
        <p class="hero-lead">${L.lead}</p>
        <div class="hero-ctas">
          <a class="btn btn-play" href="${playUrl(L, 'hero')}" rel="noopener">
            ${PLAY_ICON}
            ${L.playBtn}
          </a>
        </div>
        <div class="hero-status">${L.status}</div>
      </div>
    </section>
${calcSection(L)}
    <!-- ═══ STORY ═══ -->
    <section class="story">
      <div class="container">
        <div class="story-inner">
          <div class="story-label">${L.storyLabel}</div>
          <p class="story-quote">${L.story}</p>
          <div class="story-author">${L.storyAuthor}</div>
        </div>
      </div>
    </section>

    <!-- ═══ FEATURES ═══ -->
    <section class="features">
      <div class="container">
        <div class="section-label">${L.featLabel}</div>
        <h2 class="section-title">${L.featTitle}</h2>

        <div class="features-grid">
${features}
        </div>
      </div>
    </section>

    <!-- ═══ FREE vs PRO ═══ -->
    <section class="plans">
      <div class="container">
        <div class="section-label">${P.label}</div>
        <h2 class="section-title">${P.title}</h2>
        <div class="plans-grid">
          <div class="plan">
            <div class="plan-name">${P.freeName}</div>
            <div class="plan-price">${P.freePrice}</div>
            <ul>
${P.free.map(x => `              <li>${x}</li>`).join('\n')}
            </ul>
          </div>
          <div class="plan plan-pro">
            <div class="plan-name">PS5 Vault Pro</div>
            <div class="plan-price">${P.proPrice}</div>
            <ul>
${P.pro.map(x => `              <li>${x}</li>`).join('\n')}
            </ul>
          </div>
        </div>
        <p class="plans-note">${P.note}</p>
      </div>
    </section>

    <!-- ═══ PREVIEW: PHONES ═══ -->
    <section class="preview">
      <div class="container">
        <div class="section-label">${L.previewLabel}</div>
        <h2 class="section-title">${L.previewTitle}</h2>

        <div class="shots">
${shots}
        </div>
      </div>
    </section>

    <!-- ═══ FAQ ═══ -->
    <section class="faq" id="faq">
      <div class="container">
        <div class="section-label">${L.faqLabel}</div>
        <h2 class="section-title">${L.faqTitle}</h2>
        <div class="faq-list">
${L.faq.map(([q, a]) => `          <details>
            <summary>${q}</summary>
            <p class="faq-a">${a}</p>
          </details>`).join('\n')}
        </div>
      </div>
    </section>

    <!-- ═══ CTA ═══ -->
    <section class="cta">
      <div class="container">
        <div class="cta-inner">
          <div class="section-label">${L.ctaLabel}</div>
          <h2 class="cta-title">${L.ctaTitle}</h2>
          <p class="cta-lead">${L.ctaLead}</p>

          <a class="btn btn-play" href="${playUrl(L, 'cta')}" rel="noopener">
            ${PLAY_ICON}
            ${L.playBtn}
          </a>

          <div class="cta-meta">${L.ctaMeta}</div>
        </div>
      </div>
    </section>

  </main>

  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>${L.footer}</div>
        <ul class="footer-links">
          <li><a href="mailto:skudev6@gmail.com">email</a></li>
          <li><a href="https://matiseekk-dot.github.io/Games/privacy.html" target="_blank" rel="noopener">privacy</a></li>
          <li><a href="https://github.com/matiseekk-dot/Games" target="_blank" rel="noopener">github</a></li>
        </ul>
      </div>
    </div>
  </footer>

${calcScript(L)}
</body>
</html>
`;
}

function sitemap() {
  const alts = PAGES.map(p => `    <xhtml:link rel="alternate" hreflang="${p.lang}" href="${SITE}${p.path}"/>`)
    .concat(`    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE}${X_DEFAULT.path}"/>`).join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${PAGES.map(p => `  <url>
    <loc>${SITE}${p.path}</loc>
    <lastmod>${TODAY}</lastmod>
${alts}
  </url>`).join('\n')}
</urlset>
`;
}

// Guard the house rule: no long dashes anywhere in the generated pages.
const DASH = /[\u2013\u2014]/;
for (const L of PAGES) {
  const html = page(L);
  if (DASH.test(html.replace(/<!--[\s\S]*?-->/g, '').replace(/\/\*[\s\S]*?\*\//g, ''))) throw new Error(`long dash in ${L.lang}`);
  const out = path.join(ROOT, L.path.replace(/^\//, ''), 'index.html');
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, html);
  console.log('wrote', path.relative(ROOT, out), `(${Math.round(html.length / 1024)} kB)`);
}
fs.writeFileSync(path.join(ROOT, 'sitemap-ps5-vault.xml'), sitemap());
console.log('wrote sitemap-ps5-vault.xml');
