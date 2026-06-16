// Renders data.json + template.html -> static index.html (for GitHub Pages).
// Usage: node build.mjs   (after editing data.json)
import { readFileSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const dir = dirname(fileURLToPath(import.meta.url))
const data = JSON.parse(readFileSync(join(dir, 'data.json'), 'utf8'))
let tpl = readFileSync(join(dir, 'template.html'), 'utf8')

const esc = (s) =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

const goal = Number(data.goal)
const earned = Number(data.earned)
const money = (n) => '$' + (Number.isInteger(n) ? n : n.toFixed(2))
const plain = (n) => (Number.isInteger(n) ? String(n) : n.toFixed(2))
const pct = goal > 0 ? Math.round(Math.max(0, Math.min(100, (earned / goal) * 100))) : 0
const empty = earned <= 0 ? 'true' : 'false'
const barLabel =
  `Earned ${money(earned)} of ${money(goal)}, ${pct} percent` +
  (earned <= 0 ? ' — not started yet' : '')
const statusHeadline =
  earned <= 0 ? 'Just getting started'
  : pct >= 100 ? 'Goal reached'
  : pct >= 50 ? 'Over halfway'
  : 'On the board'

const logItems = data.log
  .map((e, i) => {
    const latest = i === 0 ? '\n            <span class="latest">Latest</span>' : ''
    return `        <li>\n          <div class="when">${esc(e.date)}${latest}</div>\n          <p class="what">${esc(e.text)}</p>\n        </li>`
  })
  .join('\n')

const repl = {
  earnedRaw: String(earned),
  goalRaw: String(goal),
  earnedFmt: money(earned),
  goalFmt: money(goal),
  earnedPlain: plain(earned),
  pct: String(pct),
  empty,
  barLabel,
  statusHeadline,
  started: esc(data.started),
  updated: esc(data.updated),
  focus: esc(data.focus),
  logItems,
}

for (const [k, v] of Object.entries(repl)) {
  tpl = tpl.split('{{' + k + '}}').join(v)
}

const leftover = tpl.match(/\{\{[a-zA-Z0-9_]+\}\}/g)
if (leftover) {
  console.error('❌ Unreplaced placeholders:', [...new Set(leftover)].join(', '))
  process.exit(1)
}

writeFileSync(join(dir, 'index.html'), tpl)
console.log(`✅ Built index.html — ${money(earned)} / ${money(goal)} (${pct}%), ${data.log.length} log entries, updated ${data.updated}.`)
