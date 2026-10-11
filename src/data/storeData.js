import polaroidImg from "../assets/img/polaroid.png";
import headphones from "../assets/img/headphones.png";

export const BRAND = "Archivo";
export const ACCENT = "#c7351f"; // darkened for WCAG AA contrast with white text

/* ---------- Inline SVG "product photos" (no remote assets) ---------- */
export const svgUri = (inner) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${inner}</svg>`
  )}`;

export const ART = {
  film: (c) =>
    svgUri(
      `<ellipse cx="100" cy="160" rx="46" ry="8" fill="#000" opacity=".18"/>
       <rect x="62" y="56" width="76" height="100" rx="8" fill="#1d1b19"/>
       <rect x="72" y="42" width="56" height="18" rx="4" fill="#3a3632"/>
       <rect x="70" y="84" width="60" height="44" rx="3" fill="${c}"/>
       <rect x="78" y="96" width="44" height="6" fill="#fff" opacity=".85"/>
       <rect x="78" y="108" width="28" height="6" fill="#fff" opacity=".55"/>`
    ),
  box: (c) =>
    svgUri(
      `<ellipse cx="104" cy="158" rx="54" ry="8" fill="#000" opacity=".18"/>
       <rect x="56" y="58" width="92" height="98" fill="${c}"/>
       <rect x="56" y="58" width="92" height="26" fill="#1d1b19"/>
       <rect x="68" y="98" width="68" height="34" fill="#f4f0e6" opacity=".9"/>
       <rect x="76" y="108" width="52" height="6" fill="#1d1b19"/>
       <rect x="76" y="119" width="30" height="5" fill="#1d1b19" opacity=".6"/>`
    ),
  camera: (c) =>
    svgUri(
      `<ellipse cx="100" cy="162" rx="64" ry="8" fill="#000" opacity=".18"/>
       <rect x="30" y="74" width="140" height="80" rx="8" fill="${c}"/>
       <rect x="30" y="74" width="140" height="22" rx="8" fill="#d9d5cc"/>
       <rect x="78" y="56" width="44" height="22" rx="3" fill="#b9b4a9"/>
       <circle cx="100" cy="118" r="34" fill="#151413"/>
       <circle cx="100" cy="118" r="24" fill="#2a2826"/>
       <circle cx="100" cy="118" r="11" fill="#0a0a0a"/>
       <circle cx="92" cy="110" r="4" fill="#fff" opacity=".6"/>`
    ),
  lens: (c) =>
    svgUri(
      `<ellipse cx="100" cy="166" rx="56" ry="7" fill="#000" opacity=".18"/>
       <circle cx="100" cy="100" r="62" fill="#151413"/>
       <circle cx="100" cy="100" r="50" fill="none" stroke="#6b665e" stroke-width="3"/>
       <circle cx="100" cy="100" r="38" fill="${c}" opacity=".55"/>
       <circle cx="100" cy="100" r="24" fill="#0a0a0a"/>
       <circle cx="88" cy="88" r="6" fill="#fff" opacity=".6"/>`
    ),
  strap: (c) =>
    svgUri(
      `<ellipse cx="100" cy="164" rx="60" ry="7" fill="#000" opacity=".18"/>
       <path d="M40 150 Q60 40 100 60 T160 150" fill="none" stroke="${c}" stroke-width="22" stroke-linecap="round"/>
       <path d="M40 150 Q60 40 100 60 T160 150" fill="none" stroke="#fff" stroke-width="2" stroke-dasharray="6 8" opacity=".5"/>`
    ),
};

export const imgSrc = (item) => (item.image ? item.image : ART[item.art](item.accent));

/* ---------- Mock data ---------- */
export const PRODUCTS = [
  { id: 1, name: "Polaroid OneStep", subtitle: "Vintage instant camera", price: 1500, badge: "Popular", bg: "#E8792F", image: polaroidImg, alt: "Polaroid OneStep camera", tags: ["Instant", "Polaroid", "Cameras"] },
  { id: 2, name: "head phone", subtitle: "Vintage instant head phone", price: 1500, badge: "Popular", bg: "#E8699F", image: headphones, alt: "Polaroid OneStep camera", tags: ["Instant", "headphones", "head phone"] },
  { id: 3, name: "Kodak Portra 400", subtitle: "35mm daylight colour", price: 420, badge: "Pro", bg: "#DC5A2C", art: "film", accent: "#e9c36a", alt: "Canister of Kodak Portra 400 35mm colour film", tags: ["35mm", "Color", "Film", "Kodak"] },
  { id: 4, name: "Canon EOS Elan 7E", subtitle: "2000s autofocus SLR", price: 8500, badge: "Pro", bg: "#CFC6B2", art: "camera", accent: "#2b2a28", alt: "Black Canon EOS Elan 7E film SLR camera with standard lens", tags: ["2000s", "35mm", "Cameras", "Canon"] },
  { id: 5, name: "Kodak Gold 200", subtitle: "35mm daylight colour", price: 350, badge: "New", bg: "#DC5A2C", art: "film", accent: "#e9c36a", alt: "Canister of Kodak Gold 200 35mm colour film", tags: ["35mm", "Color", "Film", "Kodak"] },
  { id: 6, name: "Leicaflex SL + Lens", subtitle: "1960s SLR, 50mm kit", price: 18000, badge: "Pro", bg: "#D8CDB6", art: "camera", accent: "#c7c2b8", alt: "Silver Leicaflex SL camera body with mounted 50mm lens", tags: ["1960s", "35mm", "Cameras", "Leica"] },
  { id: 7, name: "Lomography Earl Grey", subtitle: "35mm black & white", price: 320, badge: null, bg: "#B9803F", art: "film", accent: "#c73a2b", alt: "Red Lomography Earl Grey 100 black and white film canister", tags: ["35mm", "Black & White", "Film", "Lomography"] },
  { id: 8, name: "Carl Zeiss Planar 50mm", subtitle: "C/Y mount prime lens", price: 9000, badge: "Mint", bg: "#E8D7A0", art: "lens", accent: "#7aa0b5", alt: "Carl Zeiss Planar 50mm lens seen from the front", tags: ["1970s", "50mm", "Carl Zeiss", "Lenses"] },
  { id: 9, name: "Fujifilm Neopan 100", subtitle: "35mm black & white", price: 400, badge: null, bg: "#E5762C", art: "box", accent: "#2f8a55", alt: "Green box of Fujifilm Neopan Acros 100 black and white film", tags: ["35mm", "Black & White", "Film", "Fujifilm"] },
  { id: 10, name: "Leather Neck Strap", subtitle: "Hand-stitched, tan", price: 650, badge: "New", bg: "#C9B48A", art: "strap", accent: "#8a4f25", alt: "Tan leather camera neck strap with contrast stitching", tags: ["Accessories", "Leather", "Universal"] },
];

export const STORIES = [
  { id: "s1", name: "Slow Mornings in Oaxaca", subtitle: "A photographer and one roll of Portra", body: "Placeholder story: one roll, one week, and a habit of waiting for the light before pressing the shutter.", bg: "#E4A92B", art: "film", accent: "#d8402f", alt: "Film canister illustrating a story about shooting in Oaxaca", tags: ["Interview", "Mexico", "Portra"] },
  { id: "s2", name: "Why Tungsten Stock Glows", subtitle: "Night street work on CineStill", body: "Placeholder story: how tungsten-balanced film turns streetlights into halos, and when to use it.", bg: "#D9602B", art: "box", accent: "#8f1f1a", alt: "Red film box illustrating a story about tungsten film", tags: ["Guide", "Night", "CineStill"] },
  { id: "s3", name: "Buying a Used SLR", subtitle: "What to check before you pay", body: "Placeholder story: check the shutter at every speed, the light seals, the mirror and the viewfinder before you pay.", bg: "#CFC6B2", art: "camera", accent: "#2b2a28", alt: "Film SLR illustrating a guide to buying used cameras", tags: ["Guide", "Cameras", "Checklist"] },
];

export const TABS = ["Shop", "Discovery"];

export const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});
export const mxn = (n) => `${money.format(n)} MXN`;

export const BADGE_STYLE = {
  Popular: "bg-[#2f6fd6] text-white",
  Pro: "bg-[#b8391c] text-white",
  New: "bg-[#b8391c] text-white",
  Mint: "bg-[#f4f0e6] text-black",
};

export const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7351f]";
