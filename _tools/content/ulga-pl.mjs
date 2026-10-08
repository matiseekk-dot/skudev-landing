// Kalkulator ulgi na dziecko w PIT (ulga prorodzinna), tylko PL.
// Stan prawny: październik 2026 (sprawdzone 8 paź 2026): ustawa o PIT, art. 27f.
// Kwoty bez zmian od lat: 92,67 zł miesięcznie na 1. i 2. dziecko, 166,67 zł na 3., 225 zł na 4. i kolejne.
// Przy jednym dziecku limit dochodu: 112 000 zł (małżonkowie łącznie, samotny rodzic), 56 000 zł (pozostali).
// Niewykorzystana ulga wraca jako zwrot, najwyżej do sumy zapłaconych składek społecznych i zdrowotnych.

export const ULGA_RULES = {
  monthly: [92.67, 92.67, 166.67, 225],   // indeks = kolejność dziecka, dalej jak ostatni
  limits: { married: 112000, single: 112000, other: 56000 },
  adultChildIncome2025: '22 546,92 zł',   // 12 x renta socjalna od 1 marca 2025
}

export const ulgaCalc = {
  id: 'ulgaCalc',
  type: 'ulgaCalc',
  onlyLangs: ['pl'],
  slug: 'kalkulator-ulgi-na-dziecko',
  emoji: '🧾',
  title: 'Kalkulator ulgi na dziecko 2026 (PIT)',
  metaTitle: 'Ulga na dziecko 2026: kalkulator PIT i dodatkowy zwrot',
  description: 'Policz ulgę na dziecko w PIT za 2026 rok: 1112,04 zł na pierwsze i drugie dziecko, 2000,04 zł na trzecie, 2700 zł na czwarte i kolejne. Sprawdź limit dochodu i ile wróci jako dodatkowy zwrot.',
  teaser: 'Ile odliczysz i ile wróci jako zwrot.',
  answer: 'Ulga na dziecko wynosi 1112,04 zł rocznie na pierwsze i drugie dziecko, 2000,04 zł na trzecie i 2700 zł na czwarte i każde kolejne. Przy jednym dziecku obowiązuje limit dochodu: 112 000 zł dla małżonków łącznie i samotnych rodziców, 56 000 zł dla pozostałych. Przy dwojgu i więcej dzieciach limitu nie ma, a ulga, której nie da się odliczyć od podatku, wraca jako zwrot do wysokości zapłaconych składek.',
  form: {
    kids: 'Na ile dzieci przysługuje ulga?',
    kidsHint: 'Dzieci do 18 lat, a pełnoletnie uczące się do 25 lat, jeśli ich dochód nie przekroczył limitu (za 2025 rok: 22 546,92 zł).',
    born: 'Najmłodsze dziecko urodziło się w tym roku podatkowym?',
    bornNo: 'nie, wcześniej',
    months: ['w styczniu', 'w lutym', 'w marcu', 'w kwietniu', 'w maju', 'w czerwcu', 'w lipcu', 'w sierpniu', 'we wrześniu', 'w październiku', 'w listopadzie', 'w grudniu'],
    status: 'Twoja sytuacja',
    statuses: {
      married: 'małżeństwo przez cały rok',
      single: 'samotnie wychowuję dziecko',
      other: 'inna (np. związek nieformalny, ślub w trakcie roku)',
    },
    income: 'Dochód za rok (zł)',
    incomeHint: 'Przychód minus koszty i składki społeczne. W małżeństwie suma dochodów obojga. Limit dotyczy tylko jednego dziecka.',
    disability: 'Dziecko ma orzeczenie o niepełnosprawności (wtedy limitu dochodu nie ma)',
    tax: 'Podatek należny z Twojego PIT (zł, opcjonalnie)',
    taxHint: 'Kwota podatku przed odliczeniem ulgi. Bez niej pokażemy samą wysokość ulgi.',
    contrib: 'Zapłacone składki społeczne i zdrowotne za rok (zł, opcjonalnie)',
    contribHint: 'Do tej kwoty urząd zwróci ulgę, której nie da się odliczyć od podatku. W małżeństwie składki obojga.',
    button: 'Policz ulgę',
  },
  result: {
    total: 'Ulga na dzieci za rok',
    child: '{n}. dziecko',
    perMonth: '{amount} miesięcznie × {months} mies.',
    overLimit: 'Przy jednym dziecku i dochodzie powyżej {limit} ulga nie przysługuje.',
    deducted: 'Odliczysz od podatku',
    refund: 'Dodatkowy zwrot z urzędu skarbowego',
    lost: 'Nie wróci (powyżej sumy składek)',
    refundMax: 'Reszta ({amount}) wróci jako zwrot, jeśli tyle wynoszą Twoje składki.',
    split: 'Małżonkowie mogą podzielić ulgę między siebie w dowolnej proporcji.',
    linear: 'Ulgę odlicza się tylko od podatku według skali (PIT-37, PIT-36). Przy podatku liniowym i ryczałcie nie przysługuje.',
    error: 'Wpisz dochód, żeby sprawdzić limit przy jednym dziecku.',
  },
  blocks: [
    { h2: 'Ile wynosi ulga na dziecko' },
    { table: { head: ['Dziecko', 'Miesięcznie', 'Rocznie'], rows: [
      ['pierwsze', '92,67 zł', '1112,04 zł'],
      ['drugie', '92,67 zł', '1112,04 zł'],
      ['trzecie', '166,67 zł', '2000,04 zł'],
      ['czwarte i każde kolejne', '225,00 zł', '2700,00 zł'],
    ] } },
    { p: 'Ulga liczy się za każdy miesiąc, w którym wychowywałeś dziecko. Dziecko urodzone w październiku daje 3 miesiące ulgi: październik, listopad i grudzień.' },
    { h2: 'Limit dochodu przy jednym dziecku' },
    { p: 'Przy jednym dziecku ulga przysługuje, jeśli dochód nie przekroczył 112 000 zł (małżonkowie przez cały rok liczą dochody razem, samotny rodzic swój) albo 56 000 zł w pozostałych przypadkach, np. w związku nieformalnym. Przy dwojgu i więcej dzieciach oraz przy dziecku z niepełnosprawnością limitu nie ma.' },
    { h2: 'Dodatkowy zwrot niewykorzystanej ulgi' },
    { p: 'Jeśli ulga jest wyższa niż podatek, różnica wraca jako zwrot z urzędu skarbowego. Zwrot nie może przekroczyć sumy zapłaconych składek na ubezpieczenia społeczne i zdrowotne (w małżeństwie obojga małżonków). Dzięki temu na ulgę mogą liczyć także rodzice o niskich dochodach.' },
    { h2: 'Jak odliczyć ulgę' },
    { p: 'Ulgę wpisuje się w załączniku PIT/O do zeznania PIT-37 albo PIT-36. W usłudze Twój e-PIT przed zatwierdzeniem zeznania sprawdź, czy ulga jest uwzględniona i czy dane dzieci się zgadzają.' },
  ],
  faq: [
    { q: 'Ile wynosi ulga na pierwsze dziecko?', a: '1112,04 zł rocznie, czyli 92,67 zł za każdy miesiąc. Przy jednym dziecku obowiązuje limit dochodu 112 000 zł albo 56 000 zł.' },
    { q: 'Czy ulga przysługuje, gdy podatek jest niski?', a: 'Tak. Część, której nie da się odliczyć od podatku, wraca jako zwrot, najwyżej do sumy zapłaconych składek społecznych i zdrowotnych.' },
    { q: 'Czy rodzice mogą podzielić ulgę?', a: 'Tak. Małżonkowie odliczają ulgę w dowolnej proporcji. Rodzice niebędący małżeństwem, którzy wychowują dziecko razem, też mogą ją podzielić.' },
    { q: 'Czy ulga przysługuje na dziecko urodzone w grudniu?', a: 'Tak, za jeden miesiąc: 92,67 zł przy pierwszym i drugim dziecku.' },
  ],
  sources: [
    'Ustawa z 26 lipca 1991 r. o podatku dochodowym od osób fizycznych, art. 27f (ulga na dzieci)',
    'podatki.gov.pl: ulga na dzieci, załącznik PIT/O',
  ],
  disclaimer: 'Kalkulator liczy orientacyjnie, według przepisów z października 2026 r. Ostateczną kwotę ustalasz w zeznaniu podatkowym; przy nietypowej sytuacji zapytaj doradcę podatkowego albo Krajową Informację Skarbową.',
  related: [],
}
