const fs = require('fs')
function flat(o, p = '', out = {}) {
  for (const k in o) {
    const kp = p ? p + '.' + k : k
    if (o[k] && typeof o[k] === 'object' && !Array.isArray(o[k])) flat(o[k], kp, out)
    else out[kp] = o[k]
  }
  return out
}
const en = flat(JSON.parse(fs.readFileSync('i18n/locales/en.json', 'utf8')))
const es = flat(JSON.parse(fs.readFileSync('i18n/locales/es.json', 'utf8')))
const am = flat(JSON.parse(fs.readFileSync('i18n/locales/am.json', 'utf8')))
const ek = Object.keys(en).sort()
const sk = Object.keys(es).sort()
const ak = Object.keys(am).sort()
const all = new Set([...ek, ...sk, ...ak])
let mismatch = 0
for (const k of all) {
  const inEn = ek.includes(k)
  const inEs = sk.includes(k)
  const inAm = ak.includes(k)
  if (!(inEn && inEs && inAm)) {
    mismatch++
    console.log('MISMATCH:', k, 'en=' + inEn, 'es=' + inEs, 'am=' + inAm)
  }
}
console.log('en keys:', ek.length, '| es keys:', sk.length, '| am keys:', ak.length, '| mismatches:', mismatch)
