// Filmy z kanału YouTube @skudev osadzone w artykułach poradnika.
// Klucz: język → id artykułu. Nowy film: dopisz id (z linku youtube.com/shorts/ID),
// datę i długość (strona filmu, itemprop uploadDate/duration), potem
//   node _tools/video-thumbs.mjs && node _tools/build-site.mjs

export const VIDEO_UI = {
  pl: { play: 'Odtwórz film', note: s => `Film (${s} s). Po kliknięciu ładuje się z YouTube.` },
  en: { play: 'Play video', note: s => `Video (${s} s). Loads from YouTube when you tap play.` },
  de: { play: 'Video abspielen', note: s => `Video (${s} s). Wird erst beim Antippen von YouTube geladen.` },
  fr: { play: 'Lire la vidéo', note: s => `Vidéo (${s} s). Chargée depuis YouTube au clic.` },
  es: { play: 'Reproducir vídeo', note: s => `Vídeo (${s} s). Se carga desde YouTube al pulsar.` },
}

// Numer filmu z paczek Shorts (store-assets/shorts, shorts-2 w repo babylog), do okładek.
export const VIDEO_COVER_NO = {
  fever: '01', feeding: '02', diapers: '03', sleep: '04', warning: '05',
  thermometer: '06', glass: '07', teeth: '08', croup: '09', solids: '10',
}

const v = (id, date, sec, title) => ({ id, date, sec, title })

export const VIDEOS = {
  pl: {
    fever: v('D68ctRgc4iU', '2026-09-27T05:46:01-07:00', 24, 'Gorączka u niemowlaka: kiedy do lekarza? Progi według pediatrów'),
    feeding: v('cnpkZMfn9LU', '2026-09-27T06:12:12-07:00', 23, 'Ile razy na dobę je niemowlę? Typowe zakresy według wieku'),
    diapers: v('86JJPt49_wU', '2026-09-27T06:14:51-07:00', 24, 'Ile mokrych pieluch na dobę to dobry znak? Sygnały odwodnienia u niemowlęcia'),
    sleep: v('-yW16yKKHQI', '2026-09-27T06:16:06-07:00', 21, 'Ile powinno spać niemowlę? Sen na dobę według wieku'),
    warning: v('In1oy5pxtLc', '2026-09-27T06:17:03-07:00', 23, '5 objawów u dziecka, z którymi nie czekasz do rana'),
  },
  en: {
    fever: v('dJDQA-pJ8gc', '2026-09-27T05:54:44-07:00', 24, 'Baby fever: when to see a doctor? Thresholds by age'),
    feeding: v('_zmNCFc_C5M', '2026-09-27T06:19:51-07:00', 23, 'How many times a day does a baby eat? Typical ranges by age'),
    diapers: v('2aFPf_-llCQ', '2026-09-27T06:20:43-07:00', 24, 'How many wet diapers a day is a good sign? Signs of dehydration in babies'),
    sleep: v('hhx33Mf_gQQ', '2026-09-27T06:21:44-07:00', 21, 'How much should a baby sleep? Sleep per day by age'),
    warning: v('OcTRw0-0pCU', '2026-09-27T06:22:36-07:00', 23, '5 warning signs in babies: do not wait until morning'),
    thermometer: v('r5WMBjbUZMw', '2026-09-30T07:52:53-07:00', 18, 'Armpit, bottom or ear? How to take a baby\'s temperature'),
  },
  de: {
    fever: v('juIgAeKoz2k', '2026-09-27T06:25:02-07:00', 24, 'Fieber beim Baby: wann zum Arzt? Grenzwerte nach Alter'),
    feeding: v('yvZU6hDjRpI', '2026-09-27T06:26:05-07:00', 23, 'Wie oft am Tag trinkt ein Baby? Typische Bereiche nach Alter'),
    diapers: v('Jp9KA0GPbm8', '2026-09-27T06:27:01-07:00', 24, 'Wie viele nasse Windeln sind ein gutes Zeichen? Austrocknung beim Baby erkennen'),
    sleep: v('Qk-YJQovEcU', '2026-09-27T06:27:51-07:00', 21, 'Wie viel sollte ein Baby schlafen? Schlaf pro Tag nach Alter'),
    warning: v('Unae1sVgGJc', '2026-09-27T06:28:42-07:00', 23, '5 Warnzeichen beim Baby: nicht bis morgen warten'),
  },
  fr: {
    fever: v('9BidiWTnVEk', '2026-09-27T06:32:52-07:00', 24, 'Fièvre chez bébé : quand consulter ? Les seuils selon l’âge'),
    feeding: v('V4FcX3gr8-A', '2026-09-27T06:33:57-07:00', 24, 'Combien de fois par jour mange un bébé ? Repères selon l’âge'),
    diapers: v('HW0WJ9FTgLg', '2026-09-27T06:34:50-07:00', 24, 'Combien de couches mouillées par jour, c’est bon signe ? Déshydratation du bébé'),
    sleep: v('rDODs1TfEa8', '2026-09-27T06:37:50-07:00', 22, 'Combien de temps doit dormir un bébé ? Sommeil par jour selon l’âge'),
    warning: v('qjrYmrIZzcs', '2026-09-27T06:38:48-07:00', 23, '5 signes d’alerte chez bébé : n’attendez pas le matin'),
  },
  es: {
    fever: v('qoVfDxLhHJk', '2026-09-27T06:42:09-07:00', 24, 'Fiebre en el bebé: ¿cuándo ir al médico? Umbrales según la edad'),
    feeding: v('Eu7OhIA6vPo', '2026-09-27T06:42:59-07:00', 24, '¿Cuántas veces al día come un bebé? Rangos según la edad'),
    diapers: v('kxvAfaHUato', '2026-09-27T06:43:53-07:00', 24, '¿Cuántos pañales mojados al día son buena señal? Deshidratación en el bebé'),
    sleep: v('IMkdw3muxyM', '2026-09-27T06:45:02-07:00', 21, '¿Cuánto debe dormir un bebé? Sueño al día según la edad'),
    warning: v('zNFrbsf1kAM', '2026-09-27T06:45:54-07:00', 23, '5 señales de alarma en el bebé: no esperes a mañana'),
    thermometer: v('ei4uOXLdxG4', '2026-09-30T07:51:04-07:00', 18, '¿Axila, recto u oído? Cómo tomar la temperatura al bebé'),
  },
}
