// _tools/build-poradnik.mjs
//
// Generuje poradnik dla rodziców: /poradnik/ i /poradnik/{slug}/index.html,
// a do tego sitemap.xml. Treść pochodzi z danych aplikacji Spokojny Rodzic
// (progi gorączki i objawy alarmowe z referenceTables.js, zakresy snu
// i karmienia z sleepNorms.js / feedingNorms.js). Nie dopisujemy własnych porad.
//
// Katalog zaczyna się od "_", więc GitHub Pages (Jekyll) go nie publikuje.
// Run: node _tools/build-poradnik.mjs

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const SITE = 'https://skudev.pl'
const UPDATED = '2026-09-27'
const UPDATED_LABEL = '27 września 2026'
const PLAY = campaign => `https://play.google.com/store/apps/details?id=pl.skudev.spokojnyrodzic&amp;referrer=utm_source%3Dskudev%26utm_medium%3Dporadnik%26utm_campaign%3D${campaign}`

const ARTICLES = [
  {
    slug: 'goraczka-u-niemowlaka-kiedy-do-lekarza',
    emoji: '🌡️',
    title: 'Gorączka u niemowlaka: kiedy do lekarza?',
    metaTitle: 'Gorączka u niemowlaka: kiedy do lekarza? Progi według wieku',
    description: 'Od jakiej temperatury z niemowlęciem jechać do lekarza? Progi gorączki według wieku dziecka na podstawie wytycznych Polskiego Towarzystwa Pediatrycznego i AAP.',
    teaser: 'Progi temperatury według wieku dziecka.',
    basedOn: 'KOMPAS GORĄCZKA (Polskie Towarzystwo Pediatryczne), American Academy of Pediatrics',
    answer: 'U niemowlęcia poniżej 3 miesięcy każda temperatura od 38,0°C to powód do pilnej wizyty u lekarza, także w nocy. Od 3. do 6. miesiąca przy 38,0°C skontaktuj się z pediatrą. U starszych dzieci progiem konsultacji jest 39,0°C, a od 40,5°C w każdym wieku potrzebna jest pilna pomoc.',
    blocks: [
      { h2: 'Progi gorączki według wieku' },
      { table: {
        head: ['Wiek dziecka', 'Temperatura', 'Co zrobić'],
        rows: [
          ['Poniżej 3 miesięcy', 'od 38,0°C', 'Pilnie do lekarza, nawet w nocy', true],
          ['3 do 6 miesięcy', 'od 38,0°C', 'Skontaktuj się z pediatrą'],
          ['Powyżej 6 miesięcy', '38,5 do 39,0°C', 'Wysoka gorączka. Lek przeciwgorączkowy może poprawić komfort dziecka, dawka według ulotki'],
          ['Powyżej 6 miesięcy', 'od 39,0°C', 'Skontaktuj się z pediatrą'],
          ['W każdym wieku', 'od 40,5°C', 'Pilna pomoc lekarska', true],
        ],
      } },
      { h2: 'Dlaczego u najmłodszych próg jest niższy?' },
      { p: 'W pierwszych 3 miesiącach życia odporność dziecka jest jeszcze niedojrzała, a gorączka bywa jedynym objawem poważnej infekcji. Dlatego wytyczne zalecają pilną ocenę lekarską nawet wtedy, gdy niemowlę poza temperaturą wygląda dobrze.' },
      { h2: 'Gorączka trwa dłużej niż 3 doby' },
      { p: 'Jeśli u dziecka powyżej 6 miesięcy gorączka utrzymuje się ponad 72 godziny, skontaktuj się z pediatrą, nawet gdy dziecko czuje się nieźle.' },
      { callout: { title: 'Nie patrz tylko na termometr', text: 'Apatia, trudność z wybudzeniem, trudności w oddychaniu, drgawki albo plamy, które nie bledną przy ucisku, wymagają pilnej pomocy niezależnie od temperatury. Pełna lista: <a href="/poradnik/objawy-alarmowe-u-dziecka/">objawy alarmowe u dziecka</a>.' } },
      { h2: 'Zapisuj pomiary z godziną' },
      { p: 'Lekarz zapyta, od kiedy trwa gorączka, jak wysoka była i kiedy podano lek. Jeśli zapisujesz pomiary z godziną, łatwiej odpowiedzieć i łatwiej zauważyć, czy temperatura rośnie, czy spada.' },
    ],
    sources: [
      'KOMPAS GORĄCZKA, rekomendacje Polskiego Towarzystwa Pediatrycznego',
      'American Academy of Pediatrics, Clinical Practice Guideline: Evaluation and Management of Well-Appearing Febrile Infants 8 to 60 Days Old (2021)',
    ],
    app: 'Pomiary temperatury z wykresem, podane leki z godziną i te progi masz w jednym miejscu, także na telefonie drugiego rodzica.',
    related: ['objawy-alarmowe-u-dziecka', 'ile-mokrych-pieluch'],
  },
  {
    slug: 'objawy-alarmowe-u-dziecka',
    emoji: '🚨',
    title: 'Objawy alarmowe u dziecka: kiedy nie czekać do rana',
    metaTitle: 'Objawy alarmowe u dziecka: kiedy na SOR lub pod 112',
    description: 'Przy jakich objawach z dzieckiem jechać na SOR albo dzwonić pod 112, a kiedy wystarczy kontakt z pediatrą. Lista na podstawie wytycznych PTP i AAP.',
    teaser: 'Kiedy jechać na SOR albo dzwonić pod 112.',
    basedOn: 'KOMPAS GORĄCZKA (Polskie Towarzystwo Pediatryczne), American Academy of Pediatrics',
    answer: 'Nie czekaj do rana, gdy niemowlę poniżej 3 miesięcy ma gorączkę od 38°C, gdy dziecko jest apatyczne i trudno je wybudzić, ma trudności w oddychaniu lub sine usta, drgawki, sztywny kark albo plamy, które nie bledną przy ucisku. Wtedy potrzebna jest pilna pomoc: SOR lub numer 112.',
    blocks: [
      { h2: 'Pilnie: SOR lub 112' },
      { ol: [
        '<strong>Gorączka od 38°C u niemowlęcia poniżej 3 miesięcy</strong>, nawet bez innych objawów.',
        '<strong>Temperatura od 40,5°C</strong> w każdym wieku.',
        '<strong>Apatia, trudność z wybudzeniem, brak reakcji</strong> na głos i dotyk.',
        '<strong>Trudności w oddychaniu</strong>, świszczący oddech, sine usta.',
        '<strong>Drgawki, sztywność karku</strong> albo <strong>plamy, które nie bledną przy ucisku</strong>.',
      ] },
      { h2: 'Jak sprawdzić, czy plamy bledną?' },
      { p: 'Przyłóż do wysypki przezroczystą szklankę i lekko dociśnij. Jeśli plamy są nadal wyraźnie widoczne przez szkło, nie czekaj: to objaw, który wymaga pilnej pomocy.' },
      { h2: 'Skontaktuj się z lekarzem' },
      { ul: [
        '<strong>Oznaki odwodnienia:</strong> sucha pielucha ponad 6 godzin, płacz bez łez, zapadnięte ciemiączko.',
        '<strong>Uporczywe wymioty lub biegunka</strong> trwająca ponad dobę u niemowlęcia.',
        '<strong>Gorączka ponad 72 godziny</strong> u dziecka powyżej 6 miesięcy.',
      ] },
      { callout: { title: 'Numery', text: '<strong>112</strong> to numer alarmowy w całej Unii Europejskiej. W sprawach mniej pilnych w nocy i w święta pomoże nocna i świąteczna opieka zdrowotna. Adres najbliższej placówki podaje Telefoniczna Informacja Pacjenta NFZ: <strong>800 190 590</strong>.' } },
      { p: 'Masz wątpliwości? Lepiej sprawdzić o jeden raz za dużo. Progi temperatury według wieku znajdziesz w artykule <a href="/poradnik/goraczka-u-niemowlaka-kiedy-do-lekarza/">gorączka u niemowlaka: kiedy do lekarza</a>.' },
    ],
    sources: [
      'KOMPAS GORĄCZKA, rekomendacje Polskiego Towarzystwa Pediatrycznego',
      'American Academy of Pediatrics',
      'Medycyna Praktyczna, pediatria',
    ],
    app: 'Lista objawów alarmowych i numer 112 są w aplikacji zawsze pod ręką, razem z historią pomiarów, którą pokażesz lekarzowi.',
    related: ['goraczka-u-niemowlaka-kiedy-do-lekarza', 'ile-mokrych-pieluch'],
  },
  {
    slug: 'ile-razy-je-niemowle',
    emoji: '🍼',
    title: 'Ile razy na dobę je niemowlę?',
    metaTitle: 'Ile razy na dobę je niemowlę? Liczba karmień według wieku',
    description: 'Ile karmień na dobę to typowo u noworodka, 3-miesięcznego i rocznego dziecka? Zakresy według American Academy of Pediatrics, WHO i ESPGHAN.',
    teaser: 'Typowa liczba karmień od noworodka do roczniaka.',
    basedOn: 'American Academy of Pediatrics, WHO, ESPGHAN',
    answer: 'Noworodek w pierwszym miesiącu je zwykle 8 do 12 razy na dobę, czyli mniej więcej co 2 do 3 godzin. Z wiekiem karmień jest mniej: w 4. do 6. miesiącu zwykle 5 do 7, a pod koniec pierwszego roku 4 do 6 na dobę.',
    blocks: [
      { h2: 'Liczba karmień mlekiem na dobę' },
      { table: {
        head: ['Wiek dziecka', 'Karmienia na dobę'],
        rows: [
          ['0 do 1 miesiąca', '8 do 12'],
          ['2 do 3 miesięcy', '7 do 9'],
          ['4 do 6 miesięcy', '5 do 7'],
          ['7 do 12 miesięcy', '4 do 6'],
          ['1 do 2 lat', '3 do 5'],
        ],
      } },
      { p: 'Liczymy karmienia mlekiem (pierś i butelka), bez posiłków stałych.' },
      { h2: 'To zakresy, nie norma' },
      { p: 'Karmienie na żądanie to standard według American Academy of Pediatrics i WHO. Liczba karmień zmienia się z dnia na dzień, na przykład przy skokach rozwojowych. Ważniejsze od samej liczby jest to, czy dziecko przybiera na wadze i moczy pieluchy. Jak to sprawdzić, piszemy w artykule <a href="/poradnik/ile-mokrych-pieluch/">ile mokrych pieluch to dobry znak</a>.' },
      { h2: 'Kiedy porozmawiać z pediatrą' },
      { p: 'Gdy masz wątpliwości co do przyrostu wagi albo dziecko moczy mniej pieluch niż zwykle, porozmawiaj z pediatrą lub doradcą laktacyjnym.' },
    ],
    sources: [
      'American Academy of Pediatrics, Breastfeeding and the Use of Human Milk (2022)',
      'WHO, Infant and young child feeding (2021)',
      'ESPGHAN, Complementary Feeding: A Position Paper (2017)',
    ],
    app: 'Karmienie piersią lub butelką zapiszesz jednym dotknięciem, a aplikacja policzy karmienia z całego dnia i pokaże, ile minęło od ostatniego.',
    related: ['ile-mokrych-pieluch', 'ile-spi-niemowle'],
  },
  {
    slug: 'ile-mokrych-pieluch',
    emoji: '💧',
    title: 'Ile mokrych pieluch na dobę to dobry znak?',
    metaTitle: 'Ile mokrych pieluch na dobę? Jak rozpoznać odwodnienie u niemowlęcia',
    description: 'Ile mokrych pieluch na dobę powinno mieć niemowlę i jakie są sygnały odwodnienia? Prosty sposób, by sprawdzić, czy maluch pije dość.',
    teaser: 'Prosty sposób, by sprawdzić, czy maluch nie jest odwodniony.',
    basedOn: 'American Academy of Pediatrics, Polskie Towarzystwo Pediatryczne',
    answer: 'Od około 5. doby życia niemowlę moczy zwykle co najmniej 6 pieluch na dobę. Mniej mokrych pieluch, sucha pielucha przez ponad 6 godzin, płacz bez łez albo zapadnięte ciemiączko mogą oznaczać odwodnienie i są powodem do kontaktu z lekarzem.',
    blocks: [
      { h2: 'Pierwsze dni po porodzie' },
      { p: 'W pierwszych dniach mokrych pieluch jest mniej, bo pokarmu jest jeszcze niewiele. Ich liczba rośnie z każdym dniem, a od około 5. doby powinno ich być co najmniej 6 na dobę.' },
      { h2: 'Sygnały odwodnienia' },
      { ul: [
        'Sucha pielucha przez ponad 6 godzin',
        'Płacz bez łez',
        'Zapadnięte ciemiączko',
        'Mniej niż 6 mokrych pieluch na dobę',
      ] },
      { callout: { title: 'Kiedy do lekarza', text: 'Przy oznakach odwodnienia skontaktuj się z lekarzem, szczególnie u niemowlęcia. Uporczywe wymioty albo biegunka trwająca ponad dobę u niemowlęcia też są powodem do konsultacji, bo szybko prowadzą do odwodnienia.' } },
      { h2: 'Jak liczyć pieluchy w nocy' },
      { p: 'Po kilku nieprzespanych nocach trudno pamiętać, ile pieluch było od rana. Zapisuj każdą zmianę od razu, wtedy wystarczy rzut oka, żeby wiedzieć, czy dziś było ich dość.' },
    ],
    sources: [
      'American Academy of Pediatrics',
      'Polskie Towarzystwo Pediatryczne',
    ],
    app: 'Mokre i brudne pieluchy zapiszesz jednym dotknięciem, a licznik z całego dnia widzisz od razu na ekranie głównym.',
    related: ['ile-razy-je-niemowle', 'objawy-alarmowe-u-dziecka'],
  },
  {
    slug: 'ile-spi-niemowle',
    emoji: '😴',
    title: 'Ile powinno spać niemowlę?',
    metaTitle: 'Ile powinno spać niemowlę? Sen na dobę według wieku',
    description: 'Ile godzin na dobę śpi noworodek, 4-miesięczne niemowlę i roczne dziecko? Zakresy snu według National Sleep Foundation i American Academy of Pediatrics.',
    teaser: 'Sen na dobę według wieku, razem z drzemkami.',
    basedOn: 'National Sleep Foundation, American Academy of Pediatrics',
    answer: 'Niemowlę do 3. miesiąca śpi łącznie 14 do 17 godzin na dobę, od 4. do 11. miesiąca 12 do 15 godzin, a dziecko w wieku 1 do 2 lat 11 do 14 godzin, razem z drzemkami.',
    blocks: [
      { h2: 'Sen na dobę według wieku' },
      { table: {
        head: ['Wiek dziecka', 'Sen na dobę'],
        rows: [
          ['0 do 3 miesięcy', '14 do 17 godzin'],
          ['4 do 11 miesięcy', '12 do 15 godzin'],
          ['1 do 2 lat', '11 do 14 godzin'],
          ['3 do 5 lat', '10 do 13 godzin'],
        ],
      } },
      { p: 'To zakresy dla całej doby, razem z drzemkami. Każde dziecko śpi inaczej, więc to punkt odniesienia, a nie norma.' },
      { h2: 'Noworodek budzi się często' },
      { p: 'Noworodek śpi w krótkich odcinkach i budzi się co 1 do 3 godzin, głównie na karmienie. Rytm dnia i nocy układa się zwykle w ciągu pierwszych 2 miesięcy. Pomaga jasny dzień i ciemna, cicha noc.' },
      { h2: 'Gorszy sen około 4. miesiąca' },
      { p: 'Około 4. miesiąca sen często na jakiś czas się pogarsza. To naturalny etap rozwoju mózgu, a nie błąd rodziców.' },
    ],
    sources: [
      'National Sleep Foundation, Sleep Time Duration Recommendations (2015)',
      'American Academy of Pediatrics, Recommended Amount of Sleep for Pediatric Populations (2016)',
    ],
    app: 'Start i koniec snu zapisujesz jednym dotknięciem, a aplikacja sama zsumuje sen i drzemki z całego dnia.',
    related: ['ile-razy-je-niemowle', 'goraczka-u-niemowlaka-kiedy-do-lekarza'],
  },
]

const esc = s => String(s).replace(/&(?!amp;|lt;|gt;|quot;)/g, '&amp;')
const bySlug = Object.fromEntries(ARTICLES.map(a => [a.slug, a]))

function head({ title, description, url, jsonLd }) {
  return `<!DOCTYPE html>
<html lang="pl">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${esc(title)} | Spokojny Rodzic</title>
  <meta name="description" content="${esc(description)}">
  <link rel="canonical" href="${url}">
  <meta property="og:title" content="${esc(title)}">
  <meta property="og:description" content="${esc(description)}">
  <meta property="og:type" content="article">
  <meta property="og:url" content="${url}">
  <meta property="og:image" content="${SITE}/spokojny-rodzic/og.jpg">
  <meta name="twitter:card" content="summary_large_image">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,400;0,9..144,500;0,9..144,600;1,9..144,400;1,9..144,500&family=JetBrains+Mono:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="icon" type="image/png" href="/spokojny-rodzic/icon-192.png">
  <link rel="stylesheet" href="/assets/sr.css">
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
</head>
<body>
  <header>
    <div class="container">
      <nav class="nav">
        <a href="/" class="logo">
          <div class="logo-mark">S</div>
          <div class="logo-text">skudev · <em>poradnik</em></div>
        </a>
        <div class="nav-links">
          <a href="/poradnik/" class="nav-back">poradnik</a>
          <a href="/spokojny-rodzic/" class="nav-back">aplikacja</a>
        </div>
      </nav>
    </div>
  </header>
  <main>`
}

const FOOT = `
  </main>
  <footer>
    <div class="container">
      <div class="footer-grid">
        <div>Poradnik Spokojnego Rodzica · <a href="/" style="color:var(--accent-dim);text-decoration:none;">skudev</a> · 2026</div>
        <ul class="footer-links">
          <li><a href="/spokojny-rodzic/">aplikacja</a></li>
          <li><a href="mailto:skudev6@gmail.com">email</a></li>
          <li><a href="https://matiseekk-dot.github.io/babylog/privacy.html" target="_blank" rel="noopener">prywatność</a></li>
        </ul>
      </div>
    </div>
  </footer>
</body>
</html>
`

function block(b) {
  if (b.h2) return `<h2>${b.h2}</h2>`
  if (b.p) return `<p>${b.p}</p>`
  if (b.ul) return `<ul>${b.ul.map(li => `<li>${li}</li>`).join('')}</ul>`
  if (b.ol) return `<ol>${b.ol.map(li => `<li>${li}</li>`).join('')}</ol>`
  if (b.callout) return `<div class="callout"><div class="callout-title">${b.callout.title}</div><p>${b.callout.text}</p></div>`
  if (b.table) {
    const [first, value] = [0, 1]
    return `<div class="table-wrap"><table><thead><tr>${b.table.head.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${
      b.table.rows.map(r => `<tr${r[3] ? ' class="urgent"' : ''}>${r.slice(0, b.table.head.length).map((c, i) =>
        `<td${i === value ? ' class="num"' : ''}>${i === first ? `<strong>${c}</strong>` : c}</td>`).join('')}</tr>`).join('')
    }</tbody></table></div>`
  }
  throw new Error('Nieznany blok: ' + JSON.stringify(b))
}

function articlePage(a) {
  const url = `${SITE}/poradnik/${a.slug}/`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Article',
        headline: a.title,
        description: a.description,
        inLanguage: 'pl',
        datePublished: UPDATED,
        dateModified: UPDATED,
        mainEntityOfPage: url,
        image: `${SITE}/spokojny-rodzic/og.jpg`,
        author: { '@type': 'Person', name: 'Mateusz', url: `${SITE}/` },
        publisher: { '@type': 'Organization', name: 'skudev', url: `${SITE}/` },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Poradnik', item: `${SITE}/poradnik/` },
          { '@type': 'ListItem', position: 2, name: a.title, item: url },
        ],
      },
    ],
  }
  return `${head({ title: a.metaTitle, description: a.description, url, jsonLd })}
    <article class="article">
      <div class="container">
        <div class="crumbs"><a href="/poradnik/">Poradnik</a> / ${a.title}</div>
        <h1>${a.title}</h1>
        <div class="article-meta">Aktualizacja: ${UPDATED_LABEL} · Na podstawie: ${a.basedOn}</div>

        <div class="answer">
          <div class="answer-label">W skrócie</div>
          <p>${a.answer}</p>
        </div>

        ${a.blocks.map(block).join('\n        ')}

        <div class="app-card">
          <img src="/spokojny-rodzic/icon-192.png" alt="" width="64" height="64">
          <div>
            <h3>Spokojny Rodzic</h3>
            <p>${a.app} Bez reklam, 14 dni Premium za darmo.</p>
            <a class="btn btn-play" href="${PLAY(a.slug)}" rel="noopener">Pobierz z Google Play</a>
          </div>
        </div>

        <div class="sources">
          <h2>Źródła</h2>
          <ul>${a.sources.map(s => `<li>${s}</li>`).join('')}</ul>
          <p style="margin-top:14px">Ten artykuł ma charakter informacyjny i nie zastępuje porady lekarza. Gdy coś Cię niepokoi, skontaktuj się z lekarzem. W zagrożeniu życia dzwoń 112.</p>
        </div>

        <div class="related">
          <h2>Przeczytaj też</h2>
          <div class="guide-grid">
            ${a.related.map(s => bySlug[s]).map(r => `<a class="guide-card" href="/poradnik/${r.slug}/"><span class="guide-emoji">${r.emoji}</span><h3>${r.title}</h3><p>${r.teaser}</p></a>`).join('\n            ')}
          </div>
        </div>
      </div>
    </article>
${FOOT}`
}

function indexPage() {
  const url = `${SITE}/poradnik/`
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: 'Poradnik dla rodziców niemowląt',
    url,
    inLanguage: 'pl',
    hasPart: ARTICLES.map(a => ({ '@type': 'Article', headline: a.title, url: `${SITE}/poradnik/${a.slug}/` })),
  }
  return `${head({ title: 'Poradnik dla rodziców niemowląt', description: 'Gorączka, karmienie, pieluchy, sen i objawy alarmowe u niemowlęcia. Krótko i konkretnie, na podstawie wytycznych pediatrów.', url, jsonLd })}
    <section class="hero">
      <div class="container">
        <div class="hero-eyebrow">// Poradnik dla rodziców</div>
        <h1>Krótko i konkretnie, <em>z wytycznych</em> pediatrów.</h1>
        <p class="hero-lead">Odpowiedzi na pytania, które rodzice niemowląt zadają najczęściej, często w środku nocy. Każdy artykuł podaje źródła.</p>
      </div>
    </section>
    <section class="guides" style="border-top:none;padding-top:0">
      <div class="container">
        <div class="guide-grid">
          ${ARTICLES.map(a => `<a class="guide-card" href="/poradnik/${a.slug}/"><span class="guide-emoji">${a.emoji}</span><h3>${a.title}</h3><p>${a.teaser}</p></a>`).join('\n          ')}
        </div>
        <p class="disclaimer">Poradnik ma charakter informacyjny i nie zastępuje porady lekarza. W zagrożeniu życia dzwoń 112.</p>
      </div>
    </section>
${FOOT}`
}

function sitemap() {
  const urls = ['/', '/spokojny-rodzic/', '/ps5-vault/', '/poradnik/', ...ARTICLES.map(a => `/poradnik/${a.slug}/`)]
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map(u => `  <url><loc>${SITE}${u}</loc><lastmod>${UPDATED}</lastmod></url>`).join('\n')}
</urlset>
`
}

fs.mkdirSync(path.join(ROOT, 'poradnik'), { recursive: true })
fs.writeFileSync(path.join(ROOT, 'poradnik', 'index.html'), indexPage())
for (const a of ARTICLES) {
  fs.mkdirSync(path.join(ROOT, 'poradnik', a.slug), { recursive: true })
  fs.writeFileSync(path.join(ROOT, 'poradnik', a.slug, 'index.html'), articlePage(a))
}
fs.writeFileSync(path.join(ROOT, 'sitemap.xml'), sitemap())
fs.writeFileSync(path.join(ROOT, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE}/sitemap.xml\n`)
console.log(`poradnik: ${ARTICLES.length} artykułów + indeks, sitemap.xml, robots.txt`)
