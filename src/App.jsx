import { useState } from "react";
import { ShoppingBag, Plus, Check } from "lucide-react";

/* ------------------------------------------------------------------ *
 * Fonts: add once to index.html <head> (or keep the @import below):
 *   Playfair Display (900) for headers, Instrument Sans for details.
 * ------------------------------------------------------------------ */
const FONT_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Playfair+Display:wght@800;900&display=swap');
.font-display{font-family:'Playfair Display','Times New Roman',serif}
.font-ui{font-family:'Instrument Sans',system-ui,sans-serif}
`;

const BRAND = "Archivo";

/* ---------- Inline SVG "product photos" (no remote assets) ---------- */
const svgUri = (inner) =>
  `data:image/svg+xml;utf8,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">${inner}</svg>`
  )}`;

const ART = {
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

/* ---------- Mock data ---------- */
const PRODUCTS = [
  { id: 1, name: "Kodak Portra 400", subtitle: "35mm colour negative", price: 500, badge: "Popular", bg: "#E4A92B", art: "film", accent: "#d8402f", alt: "Roll of Kodak Portra 400 35mm film in its canister", tags: ["35mm", "Color", "Film", "Kodak"] },
  { id: 2, name: "Kodak Portra 800", subtitle: "35mm colour negative", price: 530, badge: "Popular", bg: "#E8792F", art: "box", accent: "#c9799b", alt: "Purple box of Kodak Portra 800 film on an orange backdrop", tags: ["35mm", "Color", "Film", "Kodak"] },
  { id: 3, name: "CineStill 800Tungsten", subtitle: "35mm tungsten balanced", price: 500, badge: "Popular", bg: "#D9602B", art: "box", accent: "#8f1f1a", alt: "Red box of CineStill 800Tungsten 35mm film", tags: ["35mm", "CineStill", "Color", "Film"] },
  { id: 4, name: "Canon EOS Elan 7E", subtitle: "2000s autofocus SLR", price: 8500, badge: "Pro", bg: "#CFC6B2", art: "camera", accent: "#2b2a28", alt: "Black Canon EOS Elan 7E film SLR camera with standard lens", tags: ["2000s", "35mm", "Cameras", "Canon"] },
  { id: 5, name: "Philm Daytime 100", subtitle: "35mm daylight colour", price: 350, badge: "New", bg: "#DC5A2C", art: "film", accent: "#e9c36a", alt: "Canister of Philm Daytime 100 35mm colour film", tags: ["35mm", "Color", "Film", "Philm"] },
  { id: 6, name: "Leicaflex SL + Lens", subtitle: "1960s SLR, 50mm kit", price: 18000, badge: "Pro", bg: "#D8CDB6", art: "camera", accent: "#c7c2b8", alt: "Silver Leicaflex SL camera body with mounted 50mm lens", tags: ["1960s", "35mm", "Cameras", "Leica"] },
  { id: 7, name: "Lomography Earl Grey", subtitle: "35mm black & white", price: 320, badge: null, bg: "#B9803F", art: "film", accent: "#c73a2b", alt: "Red Lomography Earl Grey 100 black and white film canister", tags: ["35mm", "Black & White", "Film", "Lomography"] },
  { id: 8, name: "Carl Zeiss Planar 50mm", subtitle: "C/Y mount prime lens", price: 9000, badge: "Mint", bg: "#E8D7A0", art: "lens", accent: "#7aa0b5", alt: "Carl Zeiss Planar 50mm lens seen from the front", tags: ["1970s", "50mm", "Carl Zeiss", "Lenses"] },
  { id: 9, name: "Fujifilm Neopan 100", subtitle: "35mm black & white", price: 400, badge: null, bg: "#E5762C", art: "box", accent: "#2f8a55", alt: "Green box of Fujifilm Neopan Acros 100 black and white film", tags: ["35mm", "Black & White", "Film", "Fujifilm"] },
  { id: 10, name: "Leather Neck Strap", subtitle: "Hand-stitched, tan", price: 650, badge: "New", bg: "#C9B48A", art: "strap", accent: "#8a4f25", alt: "Tan leather camera neck strap with contrast stitching", tags: ["Accessories", "Leather", "Universal"] },
];

const STORIES = [
  { id: "s1", name: "Slow Mornings in Oaxaca", subtitle: "A photographer and one roll of Portra", bg: "#E4A92B", art: "film", accent: "#d8402f", alt: "Film canister illustrating a story about shooting in Oaxaca", tags: ["Interview", "Mexico", "Portra"] },
  { id: "s2", name: "Why Tungsten Stock Glows", subtitle: "Night street work on CineStill", bg: "#D9602B", art: "box", accent: "#8f1f1a", alt: "Red film box illustrating a story about tungsten film", tags: ["Guide", "Night", "CineStill"] },
  { id: "s3", name: "Buying a Used SLR", subtitle: "What to check before you pay", bg: "#CFC6B2", art: "camera", accent: "#2b2a28", alt: "Film SLR illustrating a guide to buying used cameras", tags: ["Guide", "Cameras", "Checklist"] },
];

const TABS = ["Shop", "Discovery"];
const mxn = (n) => `$ ${n.toLocaleString("en-US")} MXN`;

/* ---------- Pieces ---------- */
function Card({ item, onAdd, added, isStory }) {
  return (
    <article className="font-ui flex flex-col gap-4 border-b border-r border-black p-5 sm:p-6">
      <div
        className="relative aspect-square overflow-hidden rounded-2xl border border-black/70"
        style={{ backgroundColor: item.bg }}
      >
        <img
          src={ART[item.art](item.accent)}
          alt={item.alt}
          loading="lazy"
          className="absolute inset-0 h-full w-full object-contain p-[14%]"
        />
        {item.badge && (
          <span className="absolute right-3 top-3 rounded-full bg-[#2f6fd6] px-3 py-1 text-[11px] font-medium text-white shadow-sm data-[k=Pro]:bg-[#e8684a] data-[k=New]:bg-[#e8684a] data-[k=Mint]:bg-[#f4f0e6] data-[k=Mint]:text-black" data-k={item.badge}>
            {item.badge}
          </span>
        )}
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="font-display truncate text-lg font-extrabold leading-tight">{item.name}</h3>
          {!isStory && <p className="shrink-0 text-sm font-medium tabular-nums">{mxn(item.price)}</p>}
        </div>
        <p className="mt-1 text-sm text-black/65">{item.subtitle}</p>
      </div>

      <ul className="flex flex-wrap gap-1.5" aria-label="Specifications">
        {item.tags.map((t) => (
          <li key={t} className="rounded-full border border-black/40 px-2.5 py-0.5 text-[11px] text-black/75">
            {t}
          </li>
        ))}
      </ul>

      {!isStory ? (
        <button
          type="button"
          onClick={() => onAdd(item.id)}
          aria-label={`Add ${item.name} to cart`}
          className="mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-black px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-black hover:text-[#F4F0E6] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8432f]"
        >
          {added ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
          {added ? "Added" : "Add to cart"}
        </button>
      ) : (
        <a
          href="#products"
          className="mt-auto w-fit text-sm font-medium underline underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e8432f]"
        >
          Read story
        </a>
      )}
    </article>
  );
}

export default function App() {
  const [tab, setTab] = useState("Shop");
  const [cart, setCart] = useState({});
  const [flash, setFlash] = useState(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const add = (id) => {
    setCart((c) => ({ ...c, [id]: (c[id] || 0) + 1 }));
    setFlash(id);
    setTimeout(() => setFlash(null), 1200);
  };

  const items = tab === "Shop" ? PRODUCTS : STORIES;

  return (
    <div className="font-ui min-h-screen bg-[#F4F0E6] text-[#1b1917]">
      <style>{FONT_CSS}</style>

      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <a href="#hero" className="text-sm font-semibold focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e8432f]">
          {BRAND}
        </a>
        <button
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-label={`Cart, ${count} items`}
          className="inline-flex items-center gap-2 text-sm font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#e8432f]"
        >
          <ShoppingBag size={18} aria-hidden="true" />
          Cart{count > 0 && <span className="rounded-full bg-black px-2 py-0.5 text-[11px] text-[#F4F0E6]">{count}</span>}
        </button>
      </header>

      <section id="hero" aria-labelledby="hero-title" className="px-3 sm:px-6">
        <h1
          id="hero-title"
          className="font-display select-none text-center font-black leading-[0.85] tracking-[-0.045em]"
          style={{ fontSize: "clamp(4.5rem, 24vw, 26rem)" }}
        >
          {BRAND}
        </h1>
      </section>

      <section id="about" aria-labelledby="about-title" className="mx-auto max-w-3xl px-5 pb-16 pt-10 sm:px-8 sm:pt-14">
        <h2 id="about-title" className="font-display mb-4 text-3xl font-extrabold tracking-tight sm:text-4xl">
          About us
        </h2>
        <p className="text-[15px] leading-7 text-black/80 sm:text-base sm:leading-8">
          <strong className="font-semibold underline underline-offset-4">{BRAND}</strong> began as a celebration of our early
          curiosity and our shared love for these objects. Inspiration and experience are two of many sensations we don't want
          to let go of, which is why we keep a selected collection of cameras, lenses and film. We aim to educate ourselves, to
          reuse and respect, to move slower and to conserve camera culture. Through Discovery, our own curated space, we show
          the photographers who keep reinventing film.
        </p>
      </section>

      <main id="products" className="px-0 sm:px-6">
        <div className="mx-5 sm:mx-0">
          <h2 className="font-display mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
            {tab === "Shop" ? "The collection" : "Discovery"}
          </h2>

          {/* Folder tabs */}
          <div role="tablist" aria-label="Storefront sections" className="flex items-end gap-1 pl-3 sm:pl-10">
            {TABS.map((t) => {
              const active = tab === t;
              return (
                <button
                  key={t}
                  role="tab"
                  type="button"
                  id={`tab-${t}`}
                  aria-selected={active}
                  aria-controls="product-grid"
                  onClick={() => setTab(t)}
                  className={`relative -mb-px rounded-t-2xl border border-b-0 px-6 py-2 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e8432f] ${
                    active
                      ? "border-[#e8432f] bg-[#e8432f] pb-2.5 text-white"
                      : "border-black bg-[#F4F0E6] hover:bg-black/5"
                  }`}
                >
                  {t}
                </button>
              );
            })}
          </div>
        </div>

        {/* Brutalist grid: container owns top/left, each cell owns bottom/right */}
        <div
          id="product-grid"
          role="tabpanel"
          aria-labelledby={`tab-${tab}`}
          className="grid grid-cols-1 border-l border-t border-black sm:grid-cols-2 lg:grid-cols-3"
        >
          {items.map((it) => (
            <Card key={it.id} item={it} isStory={tab === "Discovery"} onAdd={add} added={flash === it.id} />
          ))}
        </div>
      </main>

      <footer className="flex flex-col items-start justify-between gap-2 px-5 py-6 text-xs sm:flex-row sm:items-center sm:px-8">
        <span className="font-display text-lg font-black tracking-tight">{BRAND}</span>
        <small>© {new Date().getFullYear()} {BRAND}. All rights reserved.</small>
      </footer>

      {/* 🛒 Cart Drawer (قائمة السلة الجانبية) 🛒 */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex justify-end font-ui">
          {/* الخلفية السودة الشفافة */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsCartOpen(false)}
          ></div>
          
          {/* شاشة السلة */}
          <div className="relative w-full max-w-md bg-[#F4F0E6] h-full shadow-2xl flex flex-col border-l border-black animate-in slide-in-from-right duration-300">
            {/* هيدر السلة */}
            <div className="p-5 border-b border-black flex justify-between items-center bg-[#F4F0E6]">
              <h2 className="font-display text-2xl font-black">Your Cart</h2>
              <button 
                onClick={() => setIsCartOpen(false)}
                className="text-sm font-bold underline underline-offset-4 hover:text-[#e8432f]"
              >
                Close
              </button>
            </div>
            
            {/* المنتجات اللي في السلة */}
            <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-6">
              {count === 0 ? (
                <p className="text-black/60 text-center mt-10">Your cart is empty.</p>
              ) : (
                Object.entries(cart).map(([id, quantity]) => {
                  const product = PRODUCTS.find((p) => p.id === parseInt(id));
                  if (!product) return null;
                  return (
                    <div key={id} className="flex gap-4 items-center">
                      <div className="w-20 h-20 rounded-lg border border-black/20 flex-shrink-0" style={{ backgroundColor: product.bg }}>
                        <img src={ART[product.art](product.accent)} className="w-full h-full object-contain p-2" alt={product.name} />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-sm">{product.name}</h4>
                        <p className="text-xs text-black/60">{mxn(product.price)}</p>
                      </div>
                      <div className="font-bold tabular-nums text-sm">
                        x{quantity}
                      </div>
                    </div>
                  );
                })
              )}
            </div>

            {/* زرار الدفع */}
            {count > 0 && (
              <div className="p-5 border-t border-black bg-[#F4F0E6]">
                <button className="w-full bg-black text-[#F4F0E6] py-3.5 rounded-full font-bold text-sm hover:bg-[#e8432f] transition-colors">
                  Checkout
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
