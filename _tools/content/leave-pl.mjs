// Kalkulator urlopu macierzyńskiego i rodzicielskiego (daty), tylko PL.
// Stan prawny: październik 2026 (sprawdzone 7 paź 2026): Kodeks pracy, dział ósmy
// (art. 180 i nast.: urlop macierzyński, uzupełniający urlop macierzyński od 19 marca 2025,
// urlop rodzicielski art. 182(1a), urlop ojcowski art. 182(3)).
// Zmiana przepisów = zmiana tutaj (LEAVE_RULES) i w tekstach poniżej.

export const LEAVE_RULES = {
  // urlop macierzyński w tygodniach według liczby dzieci z jednego porodu (5 = pięcioro i więcej)
  maternity: { 1: 20, 2: 31, 3: 33, 4: 35, 5: 37 },
  // urlop rodzicielski łącznie: jedno dziecko / więcej dzieci; z tego 9 tygodni tylko dla drugiego rodzica
  parental: { single: 41, multiple: 43 },
  otherParentWeeks: 9,
  maxBeforeBirthWeeks: 6,
  // uzupełniający urlop macierzyński: tydzień za każdy (zaczęty) tydzień w szpitalu, najwyżej:
  supplementCap: { early: 15, preterm: 8, term: 8 },
  paternityWeeks: 2,
  paternityMonths: 12,       // do ukończenia przez dziecko 12 miesięcy
  applicationDays: 21,       // wniosek o urlop rodzicielski i o zasiłek 81,5%
  parentalUntilAge: 6,       // do końca roku kalendarzowego, w którym dziecko kończy 6 lat
}

export const leaveCalc = {
  id: 'leaveCalc',
  type: 'leaveCalc',
  onlyLangs: ['pl'],
  slug: 'kalkulator-urlopu-macierzynskiego',
  emoji: '🗓️',
  title: 'Kalkulator urlopu macierzyńskiego i rodzicielskiego 2026',
  metaTitle: 'Kalkulator urlopu macierzyńskiego 2026: daty i powrót do pracy',
  description: 'Policz daty urlopu macierzyńskiego, rodzicielskiego, 9 tygodni drugiego rodzica i ojcowskiego na 2026 rok. Z dniem powrotu do pracy, terminami wniosków i nowym urlopem uzupełniającym dla rodziców wcześniaków.',
  teaser: 'Kiedy kończy się urlop i wracasz do pracy.',
  answer: 'Urlop macierzyński trwa 20 tygodni przy jednym dziecku (przy bliźniętach 31), a potem przysługuje urlop rodzicielski: 41 tygodni (43 przy więcej niż jednym dziecku), z czego 9 tygodni tylko dla drugiego rodzica. Mama, która bierze wszystko, co może, wraca do pracy po 52 tygodniach od porodu. Rodzicom wcześniaków i dzieci leżących w szpitalu przysługuje dodatkowo do 15 tygodni urlopu uzupełniającego.',
  form: {
    date: 'Data porodu albo planowany termin',
    kids: 'Liczba dzieci z jednego porodu',
    kidsOptions: { 1: 'jedno', 2: 'dwoje', 3: 'troje', 4: 'czworo', 5: 'pięcioro lub więcej' },
    before: 'Ile tygodni urlopu macierzyńskiego przed porodem?',
    beforeHint: 'Można zacząć najwcześniej 6 tygodni przed terminem porodu. Te tygodnie nie przepadają, tylko odejmują się od urlopu po porodzie.',
    hospital: 'Czy dziecko było w szpitalu po porodzie?',
    hospitalOptions: {
      no: 'nie',
      early: 'tak, urodzone przed 28. tygodniem ciąży albo ważące do 1000 g',
      preterm: 'tak, urodzone od 28. do 36. tygodnia, powyżej 1000 g',
      term: 'tak, urodzone od 37. tygodnia (pobyt od 5. do 28. dnia po porodzie)',
    },
    hospitalDays: 'Ile dni dziecko było w szpitalu?',
    hospitalHint: 'Każdy rozpoczęty tydzień w szpitalu to tydzień urlopu: 10 dni to 2 tygodnie. Kilka pobytów się sumuje. Przy dziecku urodzonym od 37. tygodnia liczą się dni od 5. dnia do 8. tygodnia po porodzie, jeśli pobyt trwał co najmniej 2 dni z rzędu i zaczął się między 5. a 28. dniem.',
    otherNow: 'Drugi rodzic bierze swoje 9 tygodni zaraz po mamie',
    button: 'Policz daty',
  },
  result: {
    title: 'Twoje daty',
    maternity: 'Urlop macierzyński',
    supplement: 'Uzupełniający urlop macierzyński',
    parental: 'Urlop rodzicielski mamy',
    other: '9 tygodni drugiego rodzica',
    otherLater: 'do wykorzystania do {date}, w maksymalnie 5 częściach razem z resztą urlopu rodzicielskiego',
    back: 'Powrót mamy do pracy',
    homeUntil: 'Dziecko jest w domu z rodzicem do {date}, więc żłobek albo opieka od {next}.',
    backHint: 'Pierwszy dzień po urlopie. Jeśli wypada w weekend albo święto, praca zaczyna się w najbliższy dzień roboczy.',
    deadlines: 'Terminy wniosków',
    dl81: 'Wniosek o urlop macierzyński i rodzicielski z zasiłkiem 81,5%',
    dlParental: 'Wniosek o urlop rodzicielski, jeśli nie złożono go od razu (21 dni przed)',
    dlSupplement: 'Wniosek o urlop uzupełniający z zaświadczeniem ze szpitala (21 dni przed końcem macierzyńskiego)',
    dlPaternity: 'Urlop ojcowski (2 tygodnie, 100%), wykorzystać do',
    weekForms: ['tydzień', 'tygodnie', 'tygodni'],
    planned: 'Liczymy od planowanego terminu. Po porodzie wpisz prawdziwą datę urodzenia.',
    passed: 'minął',
    zasilek: 'Ile pieniędzy za ten czas? Policz w kalkulatorze zasiłku.',
    error: 'Wybierz datę porodu albo termin.',
  },
  blocks: [
    { h2: 'Ile trwa urlop macierzyński' },
    { p: '20 tygodni przy jednym dziecku, 31 przy bliźniętach, 33 przy trojaczkach, 35 przy czworaczkach i 37 przy pięciorgu i więcej dzieciach z jednego porodu. Do 6 tygodni można wykorzystać przed terminem porodu, reszta przypada po porodzie.' },
    { h2: 'Urlop rodzicielski i 9 tygodni drugiego rodzica' },
    { p: 'Zaraz po urlopie macierzyńskim przysługuje urlop rodzicielski: 41 tygodni przy jednym dziecku i 43 przy więcej dzieciach z jednego porodu. Każdy z rodziców ma wyłączne prawo do 9 tygodni, których nie można przekazać drugiemu, więc mama może wziąć najwyżej 32 tygodnie (34 przy więcej dzieciach). Urlop rodzicielski można podzielić na maksymalnie 5 części i wykorzystać do końca roku, w którym dziecko kończy 6 lat.' },
    { h2: 'Urlop uzupełniający dla wcześniaków i dzieci w szpitalu' },
    { p: 'Od 19 marca 2025 roku rodzicom dzieci, które po porodzie leżały w szpitalu, przysługuje uzupełniający urlop macierzyński: tydzień za każdy tydzień pobytu w szpitalu. Najwyżej 15 tygodni przy dziecku urodzonym przed 28. tygodniem ciąży albo ważącym do 1000 g, najwyżej 8 tygodni przy dziecku urodzonym od 28. do 36. tygodnia. Przy dziecku urodzonym od 37. tygodnia liczy się pobyt od 5. dnia do 8. tygodnia po porodzie, jeśli trwał co najmniej 2 dni z rzędu i zaczął się między 5. a 28. dniem. Urlop uzupełniający przypada zaraz po urlopie macierzyńskim.' },
    { h2: 'Urlop ojcowski' },
    { p: 'Dwa tygodnie płatne 100%, tylko dla taty, do wykorzystania do ukończenia przez dziecko 12 miesięcy, w całości albo w dwóch częściach. To osobny urlop, nie część rodzicielskiego.' },
  ],
  faq: [
    { q: 'Kiedy wraca się do pracy po urlopie macierzyńskim i rodzicielskim?', a: 'Przy jednym dziecku mama, która wykorzysta 20 tygodni macierzyńskiego i 32 tygodnie rodzicielskiego, wraca po 52 tygodniach, czyli mniej więcej w pierwsze urodziny dziecka. Dłużej, jeśli drugi rodzic weźmie swoje 9 tygodni od razu po niej albo przysługuje urlop uzupełniający.' },
    { q: 'Czy 9 tygodni taty można przekazać mamie?', a: 'Nie. To wyłączne prawo drugiego rodzica. Jeśli z niego nie skorzysta, te tygodnie przepadają.' },
    { q: 'Czy trzeba składać wniosek o urlop rodzicielski?', a: 'Tak. Najprościej złożyć go razem z wnioskiem o urlop macierzyński w ciągu 21 dni od porodu: wtedy zasiłek wynosi 81,5% za cały okres. Później wniosek składa się co najmniej 21 dni przed rozpoczęciem urlopu rodzicielskiego.' },
    { q: 'Czy urlop macierzyński zaczęty przed porodem jest dłuższy?', a: 'Nie. Tygodnie wykorzystane przed porodem odejmują się od urlopu po porodzie, łącznie zawsze jest 20 tygodni przy jednym dziecku.' },
  ],
  sources: [
    'Kodeks pracy, dział ósmy: urlop macierzyński (art. 180), urlop rodzicielski (art. 182<sup>1a</sup>), urlop ojcowski (art. 182<sup>3</sup>)',
    'Nowelizacja Kodeksu pracy wprowadzająca uzupełniający urlop macierzyński, obowiązuje od 19 marca 2025 r.',
    'gov.pl i ZUS: urlopy i zasiłek macierzyński',
  ],
  disclaimer: 'Kalkulator liczy orientacyjnie, według przepisów z października 2026 r. Dokładne daty ustala pracodawca na podstawie Twoich wniosków.',
  related: ['bag', 'labor'],
}
