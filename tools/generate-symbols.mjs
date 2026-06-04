import { mkdir, writeFile } from "node:fs/promises";
import { join } from "node:path";

const outDir = "assets/symbols";
await mkdir(outDir, { recursive: true });

function svg(content) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="170%">
      <feDropShadow dx="0" dy="20" stdDeviation="16" flood-color="#050013" flood-opacity=".45"/>
    </filter>
    <filter id="glow" x="-40%" y="-40%" width="180%" height="180%">
      <feGaussianBlur stdDeviation="10" result="blur"/>
      <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
  ${content}
</svg>`;
}

const candyGloss = `
  <ellipse cx="202" cy="154" rx="64" ry="31" fill="#fff" opacity=".5" transform="rotate(-24 202 154)"/>
  <ellipse cx="181" cy="180" rx="26" ry="12" fill="#fff" opacity=".34" transform="rotate(-24 181 180)"/>
`;

function candy(name, body) {
  return writeFile(join(outDir, `candy-${name}.svg`), svg(body), "utf8");
}

await candy("red", `
  <defs>
    <radialGradient id="g" cx="38%" cy="25%" r="74%">
      <stop offset="0" stop-color="#ffb7b3"/><stop offset=".3" stop-color="#ff3631"/><stop offset=".68" stop-color="#d4071d"/><stop offset="1" stop-color="#790016"/>
    </radialGradient>
    <radialGradient id="shine" cx="30%" cy="18%" r="36%"><stop stop-color="#fff" stop-opacity=".92"/><stop offset=".55" stop-color="#fff" stop-opacity=".2"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <path d="M104 303c-27-75 43-172 146-204 98-30 189 9 215 84 29 84-40 188-153 223-100 31-181-28-208-103Z" fill="url(#g)" stroke="#ff7d58" stroke-width="8" filter="url(#shadow)"/>
  <path d="M161 211c36-70 136-104 203-61 37 24 41 63 11 91-34 32-101 20-131-15-22-25-35-36-83-15Z" fill="#ff675e" opacity=".78"/>
  <path d="M321 200c-49 3-86 40-85 84 38-24 79-19 111 11 25-43 14-79-26-95Z" fill="#a90018" opacity=".82"/>
  <circle cx="302" cy="219" r="34" fill="none" stroke="#ffb3a8" stroke-width="20" opacity=".82"/>
  <path d="M143 319c82 56 229 36 306-79-11 126-249 194-306 79Z" fill="#5e0014" opacity=".28"/>
  <ellipse cx="204" cy="159" rx="72" ry="31" fill="url(#shine)" transform="rotate(-23 204 159)"/>
  <ellipse cx="175" cy="190" rx="26" ry="11" fill="#fff" opacity=".42" transform="rotate(-23 175 190)"/>
`);

await candy("blue", `
  <defs>
    <radialGradient id="g" cx="34%" cy="22%" r="74%"><stop stop-color="#87fbff"/><stop offset=".43" stop-color="#139fff"/><stop offset=".72" stop-color="#006ce2"/><stop offset="1" stop-color="#092181"/></radialGradient>
    <radialGradient id="shine" cx="34%" cy="20%" r="34%"><stop stop-color="#fff" stop-opacity=".9"/><stop offset=".6" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <circle cx="256" cy="256" r="170" fill="url(#g)" stroke="#55e5ff" stroke-width="9" filter="url(#shadow)"/>
  <path d="M115 260c20-109 123-187 232-153 80 25 121 101 94 176-32 91-147 130-235 72 82 4 145-31 167-91 16-45-4-86-45-102-49-19-110 8-132 58-16 37-1 72 32 83 35 12 73-9 80-43 5-24-10-42-33-44-29-3-54 22-51 54-43-45-8-118 60-133 78-18 151 36 151 117 0 91-86 166-190 159-96-6-169-77-173-168 14 12 29 17 43 15Z" fill="#003d9f" opacity=".45"/>
  <path d="M137 322c93-20 161-77 200-170" fill="none" stroke="#f0ffff" stroke-width="32" stroke-linecap="round" opacity=".92"/>
  <path d="M140 245c90 4 165-27 226-94" fill="none" stroke="#bff7ff" stroke-width="25" stroke-linecap="round" opacity=".56"/>
  <ellipse cx="197" cy="153" rx="73" ry="32" fill="url(#shine)" transform="rotate(-22 197 153)"/>
  <ellipse cx="176" cy="182" rx="25" ry="11" fill="#fff" opacity=".4" transform="rotate(-22 176 182)"/>
`);

await candy("green", `
  <defs>
    <linearGradient id="g" x1="130" y1="100" x2="390" y2="400"><stop stop-color="#d7ff80"/><stop offset=".42" stop-color="#56f11d"/><stop offset=".72" stop-color="#18a815"/><stop offset="1" stop-color="#07590f"/></linearGradient>
    <radialGradient id="shine" cx="34%" cy="20%" r="34%"><stop stop-color="#fff" stop-opacity=".76"/><stop offset=".58" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <path d="M96 179c11-74 56-107 128-91 24 5 47 5 71 0 91-21 139 27 128 120-4 31-4 62 1 94 12 87-35 133-122 120-30-4-61-4-91 0-87 13-133-35-121-120 6-42 7-84 6-123Z" fill="url(#g)" stroke="#b7ff4f" stroke-width="9" filter="url(#shadow)"/>
  <path d="M152 151c42 21 83 20 123-3M139 194c71 27 150 27 236-2M133 238c84 31 171 30 263-3M137 286c82 30 169 27 260-8M157 336c65 19 137 16 217-8" fill="none" stroke="#ecff83" stroke-width="18" stroke-linecap="round" opacity=".82"/>
  <path d="M120 286c37 105 211 130 297-5-24 146-293 177-297 5Z" fill="#034d0c" opacity=".27"/>
  <ellipse cx="199" cy="150" rx="76" ry="30" fill="url(#shine)" transform="rotate(-23 199 150)"/>
  <ellipse cx="173" cy="180" rx="25" ry="10" fill="#fff" opacity=".33" transform="rotate(-23 173 180)"/>
`);

await candy("orange", `
  <defs>
    <linearGradient id="g" x1="110" y1="120" x2="410" y2="370"><stop stop-color="#ffe58a"/><stop offset=".38" stop-color="#ff9c1d"/><stop offset=".7" stop-color="#ef5a05"/><stop offset="1" stop-color="#8f2600"/></linearGradient>
    <radialGradient id="shine" cx="34%" cy="20%" r="34%"><stop stop-color="#fff" stop-opacity=".82"/><stop offset=".58" stop-color="#fff" stop-opacity=".16"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <path d="M157 356c-82-95-20-239 99-268 79-19 155 8 191 70-72-11-125 12-157 69 72-17 125 0 162 52-78-2-139 25-180 82-39 54-82 54-115-5Z" fill="url(#g)" stroke="#ffc641" stroke-width="9" filter="url(#shadow)"/>
  <path d="M180 298c51-13 93-43 128-91M199 348c54-25 99-61 134-111M197 195c61 4 108 28 139 72M246 145c59 2 106 21 140 55" fill="none" stroke="#ffe78a" stroke-width="22" stroke-linecap="round" opacity=".82"/>
  <path d="M170 341c71 45 184-5 260-91-41 118-199 181-260 91Z" fill="#782000" opacity=".24"/>
  <ellipse cx="214" cy="148" rx="76" ry="29" fill="url(#shine)" transform="rotate(-22 214 148)"/>
  <ellipse cx="188" cy="177" rx="25" ry="10" fill="#fff" opacity=".36" transform="rotate(-22 188 177)"/>
`);

await candy("yellow", `
  <defs>
    <linearGradient id="g" x1="170" y1="80" x2="355" y2="430"><stop stop-color="#fffeb8"/><stop offset=".42" stop-color="#ffd936"/><stop offset=".72" stop-color="#ffae00"/><stop offset="1" stop-color="#a95a00"/></linearGradient>
    <radialGradient id="shine" cx="34%" cy="19%" r="35%"><stop stop-color="#fff" stop-opacity=".85"/><stop offset=".58" stop-color="#fff" stop-opacity=".18"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
  </defs>
  <path d="M256 43 390 125 434 270 344 435 176 435 78 270 122 125Z" fill="url(#g)" stroke="#ffe95c" stroke-width="9" filter="url(#shadow)"/>
  <path d="M256 43 320 132 390 125 333 211 434 270 321 284 344 435 256 336 176 435 192 284 78 270 180 211 122 125 194 132Z" fill="#fff8a8" opacity=".28"/>
  <path d="M256 43v293M122 125l312 145M390 125 78 270M176 435l80-392M344 435 256 43M180 211h153M192 284h129" fill="none" stroke="#fff8b4" stroke-width="13" opacity=".64"/>
  <path d="M84 271h350L344 435H176Z" fill="#bd7600" opacity=".18"/>
  <ellipse cx="211" cy="145" rx="70" ry="31" fill="url(#shine)" transform="rotate(-24 211 145)"/>
  <ellipse cx="187" cy="174" rx="24" ry="10" fill="#fff" opacity=".38" transform="rotate(-24 187 174)"/>
`);

await candy("purple", `
  <defs>
    <radialGradient id="g" cx="35%" cy="27%" r="68%"><stop stop-color="#ff8cff"/><stop offset=".55" stop-color="#c51cff"/><stop offset="1" stop-color="#6d099d"/></radialGradient>
    <radialGradient id="facet" cx="35%" cy="28%" r="72%"><stop stop-color="#ffb2ff"/><stop offset=".55" stop-color="#ba1cff"/><stop offset="1" stop-color="#68008f"/></radialGradient>
  </defs>
  <g filter="url(#shadow)" stroke="#e75cff" stroke-width="5" stroke-linejoin="round">
    <path d="M180 146 219 125 260 150 251 196 205 207 171 181Z" fill="url(#facet)"/>
    <path d="M251 114 296 122 323 159 305 204 259 202 232 160Z" fill="url(#facet)"/>
    <path d="M326 150 372 171 386 220 352 254 304 241 292 192Z" fill="url(#facet)"/>
    <path d="M130 218 173 194 216 219 210 271 164 286 126 261Z" fill="url(#facet)"/>
    <path d="M224 213 276 193 324 224 318 283 260 308 210 271Z" fill="url(#facet)"/>
    <path d="M331 250 378 238 416 272 405 326 354 346 314 309Z" fill="url(#facet)"/>
    <path d="M175 300 224 284 268 319 258 372 207 389 165 353Z" fill="url(#facet)"/>
    <path d="M281 312 332 295 373 334 357 387 303 399 268 365Z" fill="url(#facet)"/>
  </g>
  <g opacity=".52" fill="#fff">
    <path d="M188 151h51l-29 27Z"/><path d="M263 122h38l-22 28Z"/><path d="M340 158h35l-26 27Z"/>
    <path d="M237 220h56l-31 35Z"/><path d="M288 318h48l-27 33Z"/>
  </g>
  <ellipse cx="226" cy="138" rx="38" ry="17" fill="#fff" opacity=".78" transform="rotate(-24 226 138)"/>
  <path d="M165 352c59 52 152 64 230-27-25 85-157 132-230 27Z" fill="#4a006b" opacity=".22"/>
`);

function hSeg(x1, y, x2, t = 18, b = 8) {
  return `M${x1 + b} ${y}H${x2 - b}L${x2} ${y + b}L${x2 - b} ${y + t}H${x1 + b}L${x1} ${y + b}Z`;
}

function vSeg(x, y1, y2, t = 18, b = 8) {
  return `M${x} ${y1 + b}L${x + b} ${y1}H${x + t}L${x + t} ${y2 - b}L${x + b} ${y2}H${x}L${x} ${y2 - b}Z`;
}

function digitPaths(digit) {
  const segments = {
    0: ["a", "b", "c", "d", "e", "f"],
    1: ["b", "c"],
    2: ["a", "b", "g", "e", "d"],
    3: ["a", "b", "g", "c", "d"],
    5: ["a", "f", "g", "c", "d"],
  }[digit];
  const map = {
    a: hSeg(11, 0, 75),
    b: vSeg(68, 9, 61),
    c: vSeg(68, 63, 115),
    d: hSeg(11, 104, 75),
    e: vSeg(0, 63, 115),
    f: vSeg(0, 9, 61),
    g: hSeg(11, 52, 75),
  };
  return segments.map((item) => map[item]);
}

function glyphPaths(char) {
  if (char === "X") {
    return [`M4 0H34L52 36L73 0H103L69 61L106 124H75L52 83L29 124H-2L35 61Z`];
  }
  if (char === "1") {
    return [`M37 11L58 0H75V104H94V124H19V104H38V35L20 42L13 20Z`];
  }
  return digitPaths(char);
}

function artLabel(label) {
  const widths = { X: 104, 0: 88, 1: 82, 2: 88, 3: 88, 5: 88 };
  let cursor = 0;
  const paths = [];
  for (const char of label) {
    for (const d of glyphPaths(char)) paths.push(`<path d="${d}" transform="translate(${cursor} 0)"/>`);
    cursor += widths[char] || 88;
  }
  const targetWidth = label.length >= 4 ? 324 : label.length === 3 ? 286 : 220;
  const scale = targetWidth / cursor;
  const x = 256 - (cursor * scale) / 2;
  const y = label.length >= 4 ? 224 : 218;
  const body = paths.join("");
  return `
    <g transform="translate(${x.toFixed(2)} ${y}) scale(${scale.toFixed(3)}) skewX(-7)">
      <g fill="#3a104f" stroke="#3a104f" stroke-width="21" stroke-linejoin="round" filter="url(#shadow)">${body}</g>
      <g fill="url(#letterFill)" stroke="#5b1473" stroke-width="15" stroke-linejoin="round">${body}</g>
      <g fill="url(#letterFill)" stroke="#ffdf56" stroke-width="5" stroke-linejoin="round">${body}</g>
      <g fill="none" stroke="#fff8bf" stroke-width="4" stroke-linecap="round" opacity=".52" transform="translate(5 8) scale(.86)">${body}</g>
    </g>
  `;
}

function multiplier(name, label, colors, ring = "#ffe57d") {
  const big = label.length >= 4;
  return writeFile(join(outDir, `multiplier-${name}.svg`), svg(`
    <defs>
      <radialGradient id="ball" cx="32%" cy="24%" r="76%">
        <stop stop-color="${colors[0]}"/><stop offset=".48" stop-color="${colors[1]}"/><stop offset="1" stop-color="${colors[2]}"/>
      </radialGradient>
      <radialGradient id="shine" cx="33%" cy="20%" r="32%"><stop stop-color="#fff"/><stop offset=".52" stop-color="#fff" stop-opacity=".24"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient>
      <linearGradient id="gold" x1="124" y1="82" x2="392" y2="438" gradientUnits="userSpaceOnUse">
        <stop stop-color="#fff9a8"/><stop offset=".3" stop-color="#ffcc35"/><stop offset=".68" stop-color="#b85a00"/><stop offset="1" stop-color="#ffe072"/>
      </linearGradient>
      <linearGradient id="letterFill" x1="0" y1="0" x2="0" y2="124" gradientUnits="userSpaceOnUse">
        <stop stop-color="#fffef1"/><stop offset=".42" stop-color="#ffd23f"/><stop offset=".72" stop-color="#ff7a1d"/><stop offset="1" stop-color="#fff1a0"/>
      </linearGradient>
      <radialGradient id="ruby" cx="35%" cy="20%" r="75%"><stop stop-color="#fff6a6"/><stop offset=".38" stop-color="#ff3d5c"/><stop offset="1" stop-color="#8a0030"/></radialGradient>
    </defs>
    <path d="M94 264c-43-46-54-100-31-146 24 38 58 62 103 73l-16 65c-24 6-43 9-56 8ZM418 264c43-46 54-100 31-146-24 38-58 62-103 73l16 65c24 6 43 9 56 8Z" fill="url(#gold)" opacity=".95" filter="url(#shadow)"/>
    <path d="M74 342c58-8 104-32 139-73l30 65c-40 41-92 61-156 61 10-18 6-35-13-53ZM438 342c-58-8-104-32-139-73l-30 65c40 41 92 61 156 61-10-18-6-35 13-53Z" fill="url(#gold)" opacity=".9"/>
    <circle cx="256" cy="256" r="${big ? 184 : 172}" fill="${ring}" opacity=".36" filter="url(#glow)"/>
    <path d="M256 58c42 37 79 52 132 53-1 55 15 91 55 129-37 42-53 78-55 132-54 0-91 16-132 53-41-37-78-53-132-53-2-54-18-90-55-132 40-38 56-74 55-129 53-1 90-16 132-53Z" fill="url(#gold)" filter="url(#shadow)"/>
    <path d="M256 91c34 28 66 41 108 42 2 43 15 74 45 107-30 34-43 65-45 108-42 1-74 14-108 42-34-28-66-41-108-42-2-43-15-74-45-108 30-33 43-64 45-107 42-1 74-14 108-42Z" fill="url(#ball)"/>
    <path d="M256 78c37 33 70 46 117 47 1 48 15 81 49 115-34 37-48 69-49 117-47 1-80 14-117 47-37-33-70-46-117-47-1-48-15-80-49-117 34-34 48-67 49-115 47-1 80-14 117-47Z" fill="none" stroke="#fff1a5" stroke-width="12"/>
    <path d="M151 298c66 88 214 91 292-22-34 127-261 164-292 22Z" fill="#170023" opacity=".2"/>
    <ellipse cx="203" cy="154" rx="70" ry="34" fill="url(#shine)" transform="rotate(-24 203 154)"/>
    <path d="M256 42l25 36 43 8-31 32 5 45-42-20-42 20 5-45-31-32 43-8Z" fill="url(#gold)" filter="url(#shadow)"/>
    <path d="M256 62l17 24 29 6-22 21 4 31-28-14-28 14 4-31-22-21 29-6Z" fill="url(#ruby)"/>
    <circle cx="150" cy="140" r="26" fill="url(#ruby)" stroke="url(#gold)" stroke-width="10"/>
    <circle cx="362" cy="140" r="26" fill="url(#ruby)" stroke="url(#gold)" stroke-width="10"/>
    <path d="M256 425l28 28-28 28-28-28Z" fill="url(#ruby)" stroke="url(#gold)" stroke-width="10"/>
    ${artLabel(label)}
  `), "utf8");
}

await multiplier("x5", "X5", ["#87f2ff", "#2098ff", "#1930a7"], "#bdf4ff");
await multiplier("x10", "X10", ["#8cff7f", "#25d83c", "#07883a"], "#d8ff8a");
await multiplier("x20", "X20", ["#ff99ff", "#b930ff", "#5610b7"], "#ffe075");
await multiplier("x30", "X30", ["#ffb25f", "#ff4055", "#990525"], "#ffe075");
await multiplier("x50", "X50", ["#66e7ff", "#158fff", "#0f3ead"], "#fff09a");
await multiplier("x100", "X100", ["#fff47c", "#ff65f2", "#6517da"], "#fff3a8");
await multiplier("x200", "X200", ["#ffffff", "#ffb347", "#7b18ff"], "#fff8bd");

function special(name, body) {
  return writeFile(join(outDir, `special-${name}.svg`), svg(body), "utf8");
}

await special("horizontal", `
  <defs><radialGradient id="g" cx="36%" cy="24%" r="72%"><stop stop-color="#eefcff"/><stop offset=".5" stop-color="#21a9ff"/><stop offset="1" stop-color="#0d3ca4"/></radialGradient></defs>
  <circle cx="256" cy="256" r="160" fill="url(#g)" filter="url(#shadow)"/>
  <path d="M94 184h322M80 256h352M94 328h322" stroke="#ffffff" stroke-width="42" stroke-linecap="round" opacity=".86"/>
  <path d="M94 184h322M80 256h352M94 328h322" stroke="#1b8fff" stroke-width="22" stroke-linecap="round"/>
  <ellipse cx="198" cy="140" rx="60" ry="30" fill="#fff" opacity=".75" transform="rotate(-20 198 140)"/>
`);

await special("vertical", `
  <defs><radialGradient id="g" cx="36%" cy="24%" r="72%"><stop stop-color="#eefcff"/><stop offset=".5" stop-color="#21a9ff"/><stop offset="1" stop-color="#0d3ca4"/></radialGradient></defs>
  <circle cx="256" cy="256" r="160" fill="url(#g)" filter="url(#shadow)"/>
  <path d="M184 94v322M256 80v352M328 94v322" stroke="#ffffff" stroke-width="42" stroke-linecap="round" opacity=".86"/>
  <path d="M184 94v322M256 80v352M328 94v322" stroke="#1b8fff" stroke-width="22" stroke-linecap="round"/>
  <ellipse cx="198" cy="140" rx="60" ry="30" fill="#fff" opacity=".75" transform="rotate(-20 198 140)"/>
`);

await special("colorbomb", `
  <defs><radialGradient id="core" cx="38%" cy="25%" r="70%"><stop stop-color="#fff"/><stop offset=".22" stop-color="#49303d"/><stop offset="1" stop-color="#130910"/></radialGradient></defs>
  <circle cx="256" cy="256" r="160" fill="url(#core)" filter="url(#shadow)"/>
  <g filter="url(#glow)">
    <circle cx="207" cy="173" r="34" fill="#26a7ff"/><circle cx="278" cy="158" r="34" fill="#ffcf2e"/><circle cx="342" cy="209" r="34" fill="#ff3b4f"/>
    <circle cx="169" cy="252" r="34" fill="#ff7a28"/><circle cx="252" cy="252" r="36" fill="#9cff3c"/><circle cx="333" cy="296" r="34" fill="#d73cff"/>
    <circle cx="214" cy="340" r="34" fill="#fff05c"/>
  </g>
  <circle cx="256" cy="256" r="164" fill="none" stroke="#ffe27b" stroke-width="8" opacity=".75"/>
`);

await special("bomb", `
  <defs><radialGradient id="g" cx="34%" cy="22%" r="72%"><stop stop-color="#ffb1aa"/><stop offset=".48" stop-color="#ff273e"/><stop offset="1" stop-color="#8d071b"/></radialGradient></defs>
  <circle cx="244" cy="286" r="142" fill="url(#g)" filter="url(#shadow)"/>
  <path d="M320 132c48 4 73 29 75 75" fill="none" stroke="#5d2507" stroke-width="26" stroke-linecap="round"/>
  <path d="M386 110l26 28 37-8-17 35 22 31-38-5-24 30-7-38-35-14 34-18z" fill="#ffe56d" filter="url(#glow)"/>
  <path d="M155 285l57-25 19-61 39 51 64-1-36 53 20 61-62-18-52 38-2-65z" fill="#fff" opacity=".72"/>
`);

await special("fish", `
  <defs><linearGradient id="g" x1="130" y1="120" x2="410" y2="390"><stop stop-color="#91f7ff"/><stop offset=".42" stop-color="#22a8ff"/><stop offset="1" stop-color="#0b58c8"/></linearGradient></defs>
  <path d="M140 274c66-91 183-118 268-30 34-31 58-52 88-63-12 44-27 78-57 103 28 30 42 63 53 105-38-11-65-28-95-60-95 62-215 42-257-55z" fill="url(#g)" filter="url(#shadow)"/>
  <circle cx="256" cy="244" r="128" fill="url(#g)"/>
  <path d="M184 250c34-27 75-45 122-54" fill="none" stroke="#73dcff" stroke-width="18" opacity=".65"/>
  <circle cx="210" cy="220" r="22" fill="#fff"/><circle cx="218" cy="222" r="10" fill="#112a6f"/>
  <path d="M315 155c33 8 57 26 72 54-41 6-73-2-97-25z" fill="#44cfff"/>
  <path d="M316 361c34-7 61-25 82-53-44-9-78 0-105 25z" fill="#1894ef"/>
`);

console.log(`Wrote symbols to ${outDir}`);
