// _tools/video-thumbs.mjs
//
// Okładki filmów z poradnika jako małe JPG na naszym serwerze
// (assets/sr/{lang}/video/{id-artykułu}.jpg), żeby strona nie łączyła się
// z YouTube, dopóki czytelnik sam nie kliknie filmu.
// Źródło: okładki PNG 1080x1920 z repo babylog (store-assets/shorts, shorts-2).
// Run: FFMPEG_PATH=/sciezka/ffmpeg.exe node _tools/video-thumbs.mjs

import fs from 'fs'
import path from 'path'
import { execFileSync } from 'child_process'
import { fileURLToPath } from 'url'
import { VIDEOS, VIDEO_COVER_NO } from './content/videos.mjs'

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const BABYLOG = process.env.BABYLOG_DIR || path.resolve(ROOT, '..', 'babylog')
const FFMPEG = process.env.FFMPEG_PATH || 'ffmpeg'

function cover(lang, articleId) {
  const no = VIDEO_COVER_NO[articleId]
  const dir = path.join(BABYLOG, 'store-assets', Number(no) <= 5 ? 'shorts' : 'shorts-2', lang)
  const file = fs.existsSync(dir) && fs.readdirSync(dir).find(f => f.startsWith(`${no}-`) && f.endsWith('-cover.png'))
  if (!file) throw new Error(`brak okładki ${lang}/${no} w ${dir}`)
  return path.join(dir, file)
}

let made = 0
for (const [lang, list] of Object.entries(VIDEOS)) {
  for (const articleId of Object.keys(list)) {
    const out = path.join(ROOT, 'assets', 'sr', lang, 'video', `${articleId}.jpg`)
    if (fs.existsSync(out)) continue
    fs.mkdirSync(path.dirname(out), { recursive: true })
    execFileSync(FFMPEG, ['-v', 'error', '-y', '-i', cover(lang, articleId), '-vf', 'scale=360:640', '-q:v', '5', out])
    made++
  }
}
console.log(`okładki: ${made} nowych`)
