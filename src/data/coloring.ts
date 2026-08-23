export type TemplateCategory = 'objek' | 'huruf' | 'angka';

export interface ColoringTemplate {
  id: string;
  label: string;
  say: string;
  category: TemplateCategory;
  svg: string;
  src: string;
  doneSrc: string;
}

function svgToDataUri(svg: string) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const doneStyle =
  '<defs><style>' +
  '.f-yellow{fill:#ffd54f}' +
  '.f-orange{fill:#ffa726}' +
  '.f-red{fill:#ef5350}' +
  '.f-blue{fill:#64b5f6}' +
  '.f-pink{fill:#f06292}' +
  '.f-purple{fill:#ab47bc}' +
  '.f-green{fill:#66bb6a}' +
  '.f-brown{fill:#8d6e63}' +
  '.f-tan{fill:#e0ac69}' +
  '.f-grey{fill:#b0bec5}' +
  '.f-charcoal{fill:#546e7a}' +
  '.f-teal{fill:#4dd0e1}' +
  '</style></defs>';

function frame(content: string, done = false) {
  const defs = done ? doneStyle : '';
  return `<svg xmlns="http://www.w3.org/2000/svg" width="720" height="520" viewBox="0 0 360 260">${defs}<g fill="none" stroke="#475569" stroke-width="5" stroke-linecap="round" stroke-linejoin="round">${content}</g></svg>`;
}

const rawTemplates: Array<Omit<ColoringTemplate, 'src' | 'doneSrc' | 'category'>> = [
  {
    id: 'matahari',
    label: 'Matahari',
    say: 'Ini matahari. Warnai dengan kuning yang cerah!',
    svg: frame(
      '<circle cx="180" cy="130" r="52" class="f-yellow"/>' +
        '<path d="M252,130 L284,130 M230,180 L252,202 M180,202 L180,234 M130,180 L108,202 M108,130 L76,130 M130,80 L108,58 M180,58 L180,26 M230,80 L252,58"/>' +
        '<circle cx="162" cy="120" r="5" fill="#475569" stroke="none"/><circle cx="198" cy="120" r="5" fill="#475569" stroke="none"/>' +
        '<path d="M158,146 Q180,164 202,146"/>',
    ),
  },
  {
    id: 'kucing',
    label: 'Kucing',
    say: 'Ini kucing. Meong! Warnai kucing kesukaanmu.',
    svg: frame(
      '<polygon points="126,96 134,40 174,82" class="f-orange"/>' +
        '<polygon points="234,96 226,40 186,82" class="f-orange"/>' +
        '<circle cx="180" cy="142" r="60" class="f-orange"/>' +
        '<circle cx="160" cy="130" r="5" fill="#475569" stroke="none"/><circle cx="200" cy="130" r="5" fill="#475569" stroke="none"/>' +
        '<polygon points="173,152 187,152 180,161"/>' +
        '<path d="M180,161 Q172,171 161,166 M180,161 Q188,171 199,166"/>' +
        '<path d="M118,146 L86,141 M120,158 L90,161 M242,146 L274,141 M240,158 L270,161"/>',
    ),
  },
  {
    id: 'ikan',
    label: 'Ikan',
    say: 'Ini ikan berenang di air. Warnai ikan yang lucu!',
    svg: frame(
      '<ellipse cx="168" cy="132" rx="74" ry="46" class="f-orange"/>' +
        '<polygon points="240,132 292,98 292,166" class="f-yellow"/>' +
        '<polygon points="150,90 176,58 194,90" class="f-yellow"/>' +
        '<polygon points="162,150 182,172 196,150" class="f-yellow"/>' +
        '<circle cx="128" cy="118" r="9"/><circle cx="128" cy="118" r="3.5" fill="#475569" stroke="none"/>' +
        '<path d="M100,140 Q106,148 114,146"/>' +
        '<path d="M190,110 Q202,122 190,134 M214,116 Q226,128 214,140"/>' +
        '<circle cx="58" cy="66" r="9" class="f-teal"/><circle cx="38" cy="46" r="6" class="f-teal"/><circle cx="72" cy="38" r="5" class="f-teal"/>',
    ),
  },
  {
    id: 'bunga',
    label: 'Bunga',
    say: 'Ini bunga yang indah. Warnai kelopaknya dengan warna warni!',
    svg: frame(
      '<ellipse cx="180" cy="64" rx="20" ry="32" transform="rotate(0 180 110)" class="f-pink"/>' +
        '<ellipse cx="180" cy="64" rx="20" ry="32" transform="rotate(60 180 110)" class="f-pink"/>' +
        '<ellipse cx="180" cy="64" rx="20" ry="32" transform="rotate(120 180 110)" class="f-pink"/>' +
        '<ellipse cx="180" cy="64" rx="20" ry="32" transform="rotate(180 180 110)" class="f-pink"/>' +
        '<ellipse cx="180" cy="64" rx="20" ry="32" transform="rotate(240 180 110)" class="f-pink"/>' +
        '<ellipse cx="180" cy="64" rx="20" ry="32" transform="rotate(300 180 110)" class="f-pink"/>' +
        '<circle cx="180" cy="110" r="19" class="f-yellow"/>' +
        '<path d="M180,142 Q172,180 180,232"/>' +
        '<ellipse cx="150" cy="192" rx="25" ry="11" transform="rotate(-28 150 192)" class="f-green"/>' +
        '<ellipse cx="210" cy="210" rx="25" ry="11" transform="rotate(28 210 210)" class="f-green"/>',
    ),
  },
  {
    id: 'rumah',
    label: 'Rumah',
    say: 'Ini rumah. Warnai atap dan pintunya ya!',
    svg: frame(
      '<path d="M50,212 L310,212"/>' +
        '<rect x="108" y="120" width="144" height="92" class="f-yellow"/>' +
        '<polygon points="94,120 180,58 266,120" class="f-red"/>' +
        '<rect x="166" y="158" width="30" height="54" class="f-brown"/>' +
        '<circle cx="189" cy="186" r="2.5" fill="#475569" stroke="none"/>' +
        '<rect x="124" y="140" width="30" height="30" class="f-blue"/>' +
        '<path d="M139,140 L139,170 M124,155 L154,155"/>' +
        '<rect x="232" y="74" width="20" height="30" class="f-grey"/>',
    ),
  },
  {
    id: 'mobil',
    label: 'Mobil',
    say: 'Ini mobil. Brum brum! Warnai mobil impianmu.',
    svg: frame(
      '<path d="M54,174 L54,150 Q54,136 68,134 L114,128 L138,99 Q143,92 152,92 L212,92 Q221,92 226,99 L247,128 L290,134 Q304,136 304,150 L304,174 Z" class="f-red"/>' +
        '<circle cx="112" cy="174" r="23" class="f-charcoal"/><circle cx="112" cy="174" r="9" class="f-yellow"/>' +
        '<circle cx="250" cy="174" r="23" class="f-charcoal"/><circle cx="250" cy="174" r="9" class="f-yellow"/>' +
        '<path d="M146,102 L176,102 L176,124 L134,124 Z" class="f-blue"/>' +
        '<path d="M186,102 L211,102 L230,124 L186,124 Z" class="f-blue"/>' +
        '<path d="M181,100 L181,170"/>' +
        '<circle cx="297" cy="152" r="5" class="f-yellow"/>' +
        '<path d="M40,198 L320,198"/>',
    ),
  },
  {
    id: 'kupu-kupu',
    label: 'Kupu-kupu',
    say: 'Ini kupu-kupu. Warnai sayapnya dengan warna cantik!',
    svg: frame(
      '<path d="M172,66 Q160,46 146,40 M188,66 Q200,46 214,40"/>' +
        '<circle cx="145" cy="39" r="3" fill="#475569" stroke="none"/><circle cx="215" cy="39" r="3" fill="#475569" stroke="none"/>' +
        '<circle cx="180" cy="80" r="13"/>' +
        '<ellipse cx="180" cy="140" rx="13" ry="50"/>' +
        '<ellipse cx="118" cy="108" rx="47" ry="37" transform="rotate(-24 118 108)" class="f-purple"/>' +
        '<ellipse cx="242" cy="108" rx="47" ry="37" transform="rotate(24 242 108)" class="f-purple"/>' +
        '<ellipse cx="136" cy="182" rx="34" ry="26" transform="rotate(18 136 182)" class="f-pink"/>' +
        '<ellipse cx="224" cy="182" rx="34" ry="26" transform="rotate(-18 224 182)" class="f-pink"/>' +
        '<circle cx="112" cy="104" r="7" class="f-yellow"/><circle cx="248" cy="104" r="7" class="f-yellow"/>' +
        '<circle cx="140" cy="182" r="5" class="f-yellow"/><circle cx="220" cy="182" r="5" class="f-yellow"/>',
    ),
  },
  {
    id: 'perahu',
    label: 'Perahu Layar',
    say: 'Ini perahu layar. Berlayarlah di lautan biru!',
    svg: frame(
      '<polygon points="88,188 272,188 246,228 114,228" class="f-brown"/>' +
        '<path d="M180,188 L180,58"/>' +
        '<polygon points="186,64 186,180 256,180" class="f-red"/>' +
        '<polygon points="174,76 174,180 118,180"/>' +
        '<polygon points="180,58 210,66 180,74" class="f-orange"/>' +
        '<path d="M28,240 Q46,228 64,240 T100,240 T136,240 T172,240 T208,240 T244,240 T280,240 T316,240" class="f-blue"/>' +
        '<path d="M60,252 Q78,240 96,252 T132,252 T168,252 T204,252 T240,252 T276,252" class="f-blue"/>',
    ),
  },
  {
    id: 'es-krim',
    label: 'Es Krim',
    say: 'Ini es krim. Yummy! Warnai scoop dan cone-nya.',
    svg: frame(
      '<circle cx="180" cy="40" r="9" class="f-red"/><circle cx="183" cy="29" r="2.5" fill="#475569" stroke="none"/>' +
        '<circle cx="180" cy="92" r="40" class="f-pink"/>' +
        '<polygon points="144,128 216,128 180,238" class="f-tan"/>' +
        '<path d="M150,152 L194,224 M210,152 L166,224"/>',
    ),
  },
  {
    id: 'balon-udara',
    label: 'Balon Udara',
    say: 'Ini balon udara. Terbang tinggi ke langit!',
    svg: frame(
      '<path d="M180,28 C122,28 96,68 96,104 C96,138 128,158 150,170 L210,170 C232,158 264,138 264,104 C264,68 238,28 180,28 Z" class="f-blue"/>' +
        '<path d="M150,36 C136,76 140,138 156,168 M210,36 C224,76 220,138 204,168"/>' +
        '<path d="M156,172 L164,192 M204,172 L196,192"/>' +
        '<rect x="162" y="192" width="36" height="28" rx="5" class="f-brown"/>',
    ),
  },
];

const letterPalette = ['f-blue', 'f-orange', 'f-green', 'f-pink', 'f-purple'];
const numberWords = ['nol', 'satu', 'dua', 'tiga', 'empat', 'lima', 'enam', 'tujuh', 'delapan', 'sembilan'];

function textTemplate(id: string, label: string, say: string, category: TemplateCategory, colorClass: string, content: string, fontSize: number) {
  return {
    id,
    label,
    say,
    category,
    svg: frame(
      `<text x="180" y="${category === 'huruf' ? 186 : 208}" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-weight="bold" letter-spacing="8" font-size="${fontSize}" class="${colorClass}">${content}</text>`,
    ),
  };
}

const letterTemplates = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, index) =>
  textTemplate(
    `huruf-${letter}`,
    `Huruf ${letter}`,
    `Ini huruf ${letter}. Huruf besarnya ${letter}, kecilnya ${letter.toLowerCase()}. Warnai huruf ${letter} ya!`,
    'huruf',
    letterPalette[index % letterPalette.length],
    `${letter}${letter.toLowerCase()}`,
    168,
  ),
);

const numberTemplates = numberWords.map((word, value) =>
  textTemplate(
    `angka-${value}`,
    `Angka ${value}`,
    `Ini angka ${value}, dibaca ${word}. Warnai angka ${value} ya!`,
    'angka',
    letterPalette[(value + 2) % letterPalette.length],
    String(value),
    235,
  ),
);

export const coloringTemplates: ColoringTemplate[] = [
  ...rawTemplates.map((template) => ({ ...template, category: 'objek' as const })),
  ...letterTemplates,
  ...numberTemplates,
].map((template) => ({
  ...template,
  src: svgToDataUri(template.svg),
  doneSrc: svgToDataUri(frame(template.svg.replace(/^<svg[^>]*>|<\/svg>$/g, ''), true)),
}));

export const templateCategories: Array<{ id: 'semua' | TemplateCategory; label: string }> = [
  { id: 'semua', label: '✨ Semua' },
  { id: 'objek', label: '🖼️ Objek' },
  { id: 'huruf', label: '🔤 Huruf' },
  { id: 'angka', label: '🔢 Angka' },
];
