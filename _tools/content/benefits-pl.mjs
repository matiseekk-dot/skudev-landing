// Kalkulator zasiłku macierzyńskiego i kreator "co mi przysługuje" (tylko PL).
// Stan prawny: październik 2026 (sprawdzone 5 paź 2026): ustawa zasiłkowa,
// Kodeks pracy, ustawa o świadczeniach rodzinnych, ZUS (800+, Aktywny rodzic).
// Kwoty i progi trzymamy tutaj w jednym miejscu: zmiana przepisów = zmiana tu.

export const RULES = {
  contributions: 0.1371,       // składki społeczne pracownika odejmowane od podstawy
  rateMaternity: 1,            // urlop macierzyński
  rateParental: 0.7,           // urlop rodzicielski i 9 tygodni drugiego rodzica
  rateLong: 0.815,             // "długi wniosek" w ciągu 21 dni od porodu
  minMonthly: 1000,            // nie mniej niż kwota świadczenia rodzicielskiego
  pitRate: 0.12,               // zaliczka na PIT (bez składki zdrowotnej)
  pitRelief: 300,              // kwota zmniejszająca podatek przy PIT-2, miesięcznie
  // [urlop macierzyński, urlop rodzicielski jednego rodzica] w tygodniach
  weeks: { 1: [20, 32], 2: [31, 34] },
  otherParentWeeks: 9,
  parentalBenefit: 1000,       // świadczenie rodzicielskie, miesięcznie
  parentalBenefitWeeks: { 1: 52, 2: 65 },
}

export const benefitsCalc = {
  id: 'benefitsCalc',
  type: 'benefitsCalc',
  onlyLangs: ['pl'],
  slug: 'kalkulator-zasilku-macierzynskiego',
  emoji: '💶',
  title: 'Kalkulator zasiłku macierzyńskiego 2026',
  metaTitle: 'Kalkulator zasiłku macierzyńskiego 2026: 81,5% czy 100% i 70%?',
  description: 'Policz zasiłek macierzyński na 2026 rok: kwotę brutto i na rękę, wariant 81,5% przez cały okres albo 100% i potem 70%. Dla umowy o pracę, działalności i bez ubezpieczenia.',
  teaser: 'Ile dostaniesz i który wariant wybrać.',
  answer: 'Zasiłek macierzyński liczy się od średniej pensji brutto z ostatnich 12 miesięcy pomniejszonej o 13,71% składek. Za urlop macierzyński dostajesz 100%, za rodzicielski 70%, a jeśli w ciągu 21 dni od porodu złożysz wniosek o oba urlopy, 81,5% przez cały okres. Łącznie oba warianty dają prawie tyle samo.',
  form: {
    status: 'Twoja sytuacja',
    statuses: {
      employee: 'Umowa o pracę',
      business: 'Działalność gospodarcza z ubezpieczeniem chorobowym',
      none: 'Bez ubezpieczenia chorobowego (np. umowa o dzieło, studia, bez pracy)',
    },
    amount: {
      employee: 'Średnie wynagrodzenie brutto z ostatnich 12 miesięcy (zł)',
      business: 'Średnia podstawa składek z ostatnich 12 miesięcy (zł)',
    },
    kids: 'Liczba dzieci z jednego porodu',
    kidsOptions: { 1: 'jedno', 2: 'bliźnięta' },
    partner: 'Wynagrodzenie brutto drugiego rodzica (zł, opcjonalnie)',
    partnerHint: 'Do policzenia 9 tygodni urlopu rodzicielskiego, które przysługują tylko drugiemu rodzicowi.',
    button: 'Policz zasiłek',
  },
  result: {
    base: 'Podstawa wymiaru',
    perMonth: 'miesięcznie brutto',
    net: 'na rękę około',
    total: 'łącznie',
    weekForms: ['tydzień', 'tygodnie', 'tygodni'],
    optionLong: '81,5% przez cały okres',
    optionLongHint: 'wniosek o oba urlopy w ciągu 21 dni od porodu',
    optionSplit: '100%, a potem 70%',
    optionSplitHint: 'bez wniosku w ciągu 21 dni',
    maternity: 'urlop macierzyński',
    parental: 'urlop rodzicielski',
    other: '9 tygodni drugiego rodzica (70%)',
    benefit: 'Świadczenie rodzicielskie',
    benefitHint: '1000 zł miesięcznie na rękę (bez podatku), bez kryterium dochodowego. Wniosek w gminie albo ośrodku pomocy społecznej, najlepiej w ciągu 3 miesięcy od porodu.',
    netNote: 'Na rękę orientacyjnie: po 12% zaliczki na podatek, bez składki zdrowotnej. Z PIT-2 złożonym w ZUS albo u pracodawcy wypłata rośnie o 300 zł miesięcznie.',
    minNote: 'Zasiłek nie może być niższy niż 1000 zł miesięcznie.',
    error: 'Wpisz kwotę większą od zera.',
  },
  blocks: [
    { h2: 'Od czego zależy zasiłek' },
    { p: 'Podstawą jest średnie wynagrodzenie brutto z 12 miesięcy przed porodem, pomniejszone o 13,71% składek na ubezpieczenia społeczne. U przedsiębiorcy liczy się średnia zadeklarowana podstawa składek z tego okresu. Gdy ubezpieczenie trwa krócej niż 12 miesięcy, ZUS bierze pełne miesiące, które są.' },
    { h2: '81,5% czy 100% i 70%?' },
    { p: 'Wniosek o urlop macierzyński i rodzicielski złożony w ciągu 21 dni od porodu daje 81,5% podstawy przez cały okres. Bez takiego wniosku dostajesz 100% za 20 tygodni urlopu macierzyńskiego, a potem 70% za urlop rodzicielski. Łącznie wychodzi prawie tyle samo, różni się tylko rozłożenie pieniędzy w czasie.' },
    { h2: '9 tygodni dla drugiego rodzica' },
    { p: 'Z 41 tygodni urlopu rodzicielskiego 9 tygodni przysługuje wyłącznie drugiemu rodzicowi i nie przechodzi na mamę. Za ten czas zasiłek wynosi zawsze 70% podstawy drugiego rodzica.' },
    { h2: 'Bez ubezpieczenia chorobowego' },
    { p: 'Gdy nie masz prawa do zasiłku macierzyńskiego, przysługuje świadczenie rodzicielskie: 1000 zł miesięcznie przez 52 tygodnie (przy bliźniętach 65), bez kryterium dochodowego.' },
  ],
  faq: [
    { q: 'Czy zasiłek macierzyński jest opodatkowany?', a: 'Tak, płatnik pobiera zaliczkę na podatek dochodowy (12%). Od zasiłku nie płaci się składki zdrowotnej.' },
    { q: 'Kto wypłaca zasiłek?', a: 'Pracodawca, który zgłasza do ubezpieczenia więcej niż 20 osób. W pozostałych przypadkach, także przedsiębiorcom, wypłaca go ZUS.' },
    { q: 'Do kiedy złożyć wniosek o 81,5%?', a: 'W ciągu 21 dni od porodu. Pracownik składa go u pracodawcy, przedsiębiorca w ZUS.' },
  ],
  sources: [
    'Ustawa z 25 czerwca 1999 r. o świadczeniach pieniężnych z ubezpieczenia społecznego w razie choroby i macierzyństwa',
    'Kodeks pracy: urlop macierzyński i rodzicielski (art. 180 i 182<sup>1a</sup>)',
    'Ustawa z 28 listopada 2003 r. o świadczeniach rodzinnych: świadczenie rodzicielskie',
    'ZUS: Zasiłek macierzyński (zus.pl)',
  ],
  disclaimer: 'Kalkulator liczy orientacyjnie, według przepisów z października 2026 r. Dokładną kwotę wylicza ZUS albo pracodawca.',
  related: ['bag', 'labor'],
}

// Kreator: lista świadczeń i formalności z terminami liczonymi od daty urodzenia.
// due: dni (d), miesiące (m) od urodzenia; when: dla kogo.
export const WIZARD_ITEMS = [
  { id: 'usc', when: 'all', due: { d: 21 },
    title: 'Zgłoszenie urodzenia w urzędzie stanu cywilnego',
    amount: 'bez opłat',
    text: 'Akt urodzenia i PESEL dziecka. Zgłosisz osobiście albo przez internet na gov.pl.' },
  { id: 'long', when: 'insured', due: { d: 21 },
    title: 'Wniosek o urlop macierzyński i rodzicielski (zasiłek 81,5%)',
    amount: '81,5% podstawy przez cały okres',
    text: 'Pracownik składa u pracodawcy, przedsiębiorca w ZUS. Bez tego wniosku: 100%, a potem 70%.',
    link: { href: '/poradnik/kalkulator-zasilku-macierzynskiego/', text: 'Policz zasiłek' } },
  { id: 'health', when: 'insured', due: { d: 7 },
    title: 'Zgłoszenie dziecka do ubezpieczenia zdrowotnego',
    amount: 'bez opłat',
    text: 'Daj znać pracodawcy zaraz po porodzie: zgłasza dziecko w ciągu 7 dni. Przedsiębiorca zgłasza dziecko sam.' },
  { id: '800', when: 'all', due: { m: 3 },
    title: '800 plus',
    amount: '800 zł miesięcznie do 18. urodzin',
    text: 'Wniosek tylko przez internet: PUE ZUS, mZUS, bank albo Emp@tia. Złożony w ciągu 3 miesięcy od urodzenia daje wypłatę od miesiąca urodzenia.' },
  { id: 'parental', when: 'uninsured', due: { m: 3 },
    title: 'Świadczenie rodzicielskie',
    amount: '1000 zł miesięcznie przez 52 tygodnie',
    text: 'Bez kryterium dochodowego. Wniosek w gminie albo w ośrodku pomocy społecznej. Złożony w ciągu 3 miesięcy daje wypłatę od urodzenia.' },
  { id: 'becikowe', when: 'income1922', due: { m: 12 },
    title: 'Becikowe (jednorazowa zapomoga z tytułu urodzenia dziecka)',
    amount: '1000 zł jednorazowo',
    text: 'Przy dochodzie do 1922 zł netto na osobę w rodzinie. Potrzebne zaświadczenie, że mama była pod opieką lekarza albo położnej od 10. tygodnia ciąży. Wniosek w gminie.' },
  { id: 'family', when: 'income674', due: { m: 12 },
    title: 'Zasiłek rodzinny i dodatek z tytułu urodzenia dziecka',
    amount: '1000 zł dodatku jednorazowo i 95 zł zasiłku miesięcznie',
    text: 'Przy dochodzie do 674 zł netto na osobę w rodzinie. Też wymaga opieki medycznej od 10. tygodnia ciąży. Wniosek w gminie.' },
  { id: 'paternity', when: 'partner', due: { m: 12 },
    title: 'Urlop ojcowski',
    amount: '2 tygodnie, płatne 100%',
    text: 'Do wykorzystania do 12 miesięcy po porodzie, w całości albo w dwóch częściach. Wniosek u pracodawcy co najmniej 7 dni wcześniej.' },
  { id: 'active', when: 'all', from: { m: 12 },
    title: 'Aktywny rodzic',
    amount: '1500 zł albo 500 zł miesięcznie',
    text: 'Od 12. do 35. miesiąca życia dziecka. „Aktywni rodzice w pracy” 1500 zł, gdy oboje pracujecie, „Aktywnie w żłobku” do 1500 zł na żłobek albo „Aktywnie w domu” 500 zł. Wniosek w ZUS przez internet.' },
  { id: 'pit', when: 'all', due: { taxYear: true },
    title: 'Ulga na dziecko w PIT',
    amount: '1112,04 zł rocznie na pierwsze i drugie dziecko',
    text: 'Odliczasz w zeznaniu podatkowym za rok, w którym dziecko się urodziło. Przy jednym dziecku obowiązuje limit dochodu rodziców.' },
]

export const benefitsWizard = {
  id: 'benefitsWizard',
  type: 'benefitsWizard',
  onlyLangs: ['pl'],
  slug: 'co-mi-przysluguje-po-urodzeniu-dziecka',
  emoji: '📋',
  title: 'Co mi przysługuje po urodzeniu dziecka?',
  metaTitle: 'Co przysługuje po urodzeniu dziecka w 2026: świadczenia i terminy wniosków',
  description: 'Sprawdź w minutę, jakie świadczenia przysługują Ci po urodzeniu dziecka w 2026 roku: 800 plus, becikowe, zasiłek macierzyński albo świadczenie rodzicielskie, Aktywny rodzic. Z terminami wniosków do kalendarza.',
  teaser: 'Świadczenia i terminy wniosków w minutę.',
  answer: 'Każdemu rodzicowi przysługuje 800 plus, a do tego zasiłek macierzyński (z ubezpieczeniem chorobowym) albo świadczenie rodzicielskie 1000 zł (bez ubezpieczenia). Becikowe i dodatek z tytułu urodzenia zależą od dochodu. Najpilniejsze terminy to 21 dni: zgłoszenie urodzenia i wniosek o zasiłek 81,5%.',
  form: {
    date: 'Data urodzenia dziecka albo termin porodu',
    insured: 'Czy masz ubezpieczenie chorobowe?',
    insuredHint: 'Tak, jeśli masz umowę o pracę albo opłacasz dobrowolne chorobowe w działalności lub na zleceniu.',
    partner: 'Czy drugi rodzic pracuje na umowę o pracę?',
    income: 'Dochód netto na osobę w rodzinie (zł miesięcznie, opcjonalnie)',
    incomeHint: 'Liczony z dochodu z poprzedniego roku podzielonego przez 12 i przez liczbę osób w rodzinie. Bez niego pokażemy świadczenia zależne od dochodu jako do sprawdzenia.',
    yes: 'tak', no: 'nie',
    button: 'Pokaż, co mi przysługuje',
  },
  result: {
    title: 'Twoja lista',
    until: 'termin: {date}',
    from: 'od {date}',
    passed: 'termin minął {date}',
    taxYear: 'w zeznaniu za {year} rok',
    check: 'zależy od dochodu: sprawdź w gminie',
    fromDue: 'Liczymy od terminu porodu. Po porodzie wpisz prawdziwą datę urodzenia.',
    ics: 'Dodaj terminy do kalendarza (.ics)',
    icsName: 'Świadczenia po urodzeniu dziecka',
    icsFile: 'swiadczenia-terminy.ics',
    error: 'Wybierz datę urodzenia albo termin porodu.',
  },
  blocks: [
    { h2: 'Najważniejsze terminy' },
    { ul: [
      '<strong>7 dni</strong>: pracodawca zgłasza dziecko do ubezpieczenia zdrowotnego',
      '<strong>21 dni</strong>: zgłoszenie urodzenia w urzędzie stanu cywilnego i wniosek o zasiłek 81,5%',
      '<strong>3 miesiące</strong>: 800 plus i świadczenie rodzicielskie z wypłatą od urodzenia',
      '<strong>12 miesięcy</strong>: becikowe, dodatek z tytułu urodzenia dziecka, urlop ojcowski',
    ] },
  ],
  faq: [
    { q: 'Czy becikowe przysługuje każdemu?', a: 'Nie. Becikowe (1000 zł) dostaniesz przy dochodzie do 1922 zł netto na osobę w rodzinie i gdy mama była pod opieką lekarza albo położnej od 10. tygodnia ciąży.' },
    { q: 'Co, jeśli nie mam umowy o pracę?', a: 'Bez ubezpieczenia chorobowego przysługuje świadczenie rodzicielskie: 1000 zł miesięcznie przez 52 tygodnie, niezależnie od dochodu.' },
    { q: 'Od kiedy jest Aktywny rodzic?', a: 'Od 12. do 35. miesiąca życia dziecka. Wysokość zależy od tego, czy oboje rodzice pracują, czy dziecko chodzi do żłobka, czy zostaje w domu.' },
  ],
  sources: [
    'Ustawa z 28 listopada 2003 r. o świadczeniach rodzinnych (becikowe, zasiłek rodzinny, świadczenie rodzicielskie)',
    'Ustawa z 11 lutego 2016 r. o pomocy państwa w wychowywaniu dzieci (800 plus)',
    'Ustawa z 15 maja 2024 r. o wspieraniu rodziców w aktywności zawodowej oraz w wychowaniu dziecka „Aktywny rodzic”',
    'Kodeks pracy: urlop macierzyński, rodzicielski i ojcowski',
    'gov.pl (Ministerstwo Rodziny, Pracy i Polityki Społecznej) i ZUS',
  ],
  disclaimer: 'Lista ma charakter informacyjny, stan prawny z października 2026 r. Kwoty i kryteria sprawdź w gminie albo w ZUS przed złożeniem wniosku.',
  related: ['exams', 'bag'],
}
