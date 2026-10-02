import { useState, useEffect, useRef } from "react";
import { ShoppingBag, Plus, Minus, Check, X } from "lucide-react";
import polaroidImg from "./assets/img/polaroid.png";

/* ------------------------------------------------------------------ *
 * Fonts: Playfair Display (headers) + Instrument Sans (details).
 * Loaded once via a <link> injected into <head>. If you prefer, move
 * the same URL into index.html and delete useFonts().
 * ------------------------------------------------------------------ */
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Playfair+Display:wght@800;900&display=swap";

const BASE_CSS = `
.font-display{font-family:'Playfair Display','Times New Roman',serif}
.font-ui{font-family:'Instrument Sans',system-ui,sans-serif}
@keyframes drawer-in{from{transform:translateX(100%)}to{transform:translateX(0)}}
.drawer-in{animation:drawer-in .3s ease-out}
@media (prefers-reduced-motion:reduce){.drawer-in{animation:none}}
`;

function useFonts() {
  useEffect(() => {
    if (document.getElementById("archivo-fonts")) return;
    const link = document.createElement("link");
    link.id = "archivo-fonts";
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);
}

const BRAND = "Archivo";
const ACCENT = "#c7351f"; // darkened for WCAG AA contrast with white text

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

const imgSrc = (item) => (item.image ? item.image : ART[item.art](item.accent));

/* ---------- Mock data ---------- */
const PRODUCTS = [
  { id: 1, name: "Polaroid OneStep", subtitle: "Vintage instant camera", price: 1500, badge: "Popular", bg: "#E8792F", image: polaroidImg, alt: "Polaroid OneStep camera", tags: ["Instant", "Polaroid", "Cameras"] },
  { id: 2, name: "Pentax K1000", subtitle: "1970s manual 35mm SLR", price: 4200, badge: "New", bg: "#CFC6B2", art: "camera", accent: "#2b2a28", alt: "Black Pentax K1000 film SLR camera with standard lens", tags: ["1970s", "35mm", "Cameras", "Pentax"] },
  { id: 3, name: "Kodak Portra 400", subtitle: "35mm daylight colour", price: 420, badge: "Pro", bg: "#DC5A2C", art: "film", accent: "#e9c36a", alt: "Canister of Kodak Portra 400 35mm colour film", tags: ["35mm", "Color", "Film", "Kodak"] },
  { id: 4, name: "Canon EOS Elan 7E", subtitle: "2000s autofocus SLR", price: 8500, badge: "Pro", bg: "#CFC6B2", art: "camera", accent: "#2b2a28", alt: "Black Canon EOS Elan 7E film SLR camera with standard lens", tags: ["2000s", "35mm", "Cameras", "Canon"] },
  { id: 5, name: "Kodak Gold 200", subtitle: "35mm daylight colour", price: 350, badge: "New", bg: "#DC5A2C", art: "film", accent: "#e9c36a", alt: "Canister of Kodak Gold 200 35mm colour film", tags: ["35mm", "Color", "Film", "Kodak"] },
  { id: 6, name: "Leicaflex SL + Lens", subtitle: "1960s SLR, 50mm kit", price: 18000, badge: "Pro", bg: "#D8CDB6", art: "camera", accent: "#c7c2b8", alt: "Silver Leicaflex SL camera body with mounted 50mm lens", tags: ["1960s", "35mm", "Cameras", "Leica"] },
  { id: 7, name: "Lomography Earl Grey", subtitle: "35mm black & white", price: 320, badge: null, bg: "#B9803F", art: "film", accent: "#c73a2b", alt: "Red Lomography Earl Grey 100 black and white film canister", tags: ["35mm", "Black & White", "Film", "Lomography"] },
  { id: 8, name: "Carl Zeiss Planar 50mm", subtitle: "C/Y mount prime lens", price: 9000, badge: "Mint", bg: "#E8D7A0", art: "lens", accent: "#7aa0b5", alt: "Carl Zeiss Planar 50mm lens seen from the front", tags: ["1970s", "50mm", "Carl Zeiss", "Lenses"] },
  { id: 9, name: "Fujifilm Neopan 100", subtitle: "35mm black & white", price: 400, badge: null, bg: "#E5762C", art: "box", accent: "#2f8a55", alt: "Green box of Fujifilm Neopan Acros 100 black and white film", tags: ["35mm", "Black & White", "Film", "Fujifilm"] },
  { id: 10, name: "Leather Neck Strap", subtitle: "Hand-stitched, tan", price: 650, badge: "New", bg: "#C9B48A", art: "strap", accent: "#8a4f25", alt: "Tan leather camera neck strap with contrast stitching", tags: ["Accessories", "Leather", "Universal"] },
];

const STORIES = [
  { id: "s1", name: "Slow Mornings in Oaxaca", subtitle: "A photographer and one roll of Portra", body: "Placeholder story: one roll, one week, and a habit of waiting for the light before pressing the shutter.", bg: "#E4A92B", art: "film", accent: "#d8402f", alt: "Film canister illustrating a story about shooting in Oaxaca", tags: ["Interview", "Mexico", "Portra"] },
  { id: "s2", name: "Why Tungsten Stock Glows", subtitle: "Night street work on CineStill", body: "Placeholder story: how tungsten-balanced film turns streetlights into halos, and when to use it.", bg: "#D9602B", art: "box", accent: "#8f1f1a", alt: "Red film box illustrating a story about tungsten film", tags: ["Guide", "Night", "CineStill"] },
  { id: "s3", name: "Buying a Used SLR", subtitle: "What to check before you pay", body: "Placeholder story: check the shutter at every speed, the light seals, the mirror and the viewfinder before you pay.", bg: "#CFC6B2", art: "camera", accent: "#2b2a28", alt: "Film SLR illustrating a guide to buying used cameras", tags: ["Guide", "Cameras", "Checklist"] },
];

const TABS = ["Shop", "Discovery"];

const money = new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 0,
});
const mxn = (n) => `${money.format(n)} MXN`;

const BADGE_STYLE = {
  Popular: "bg-[#2f6fd6] text-white",
  Pro: "bg-[#b8391c] text-white",
  New: "bg-[#b8391c] text-white",
  Mint: "bg-[#f4f0e6] text-black",
};

const FOCUS = "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#c7351f]";

/* ---------- Pieces ---------- */
function Card({ item, onAdd, added, isStory }) {
  const [open, setOpen] = useState(false);

  return (
    <article className="font-ui flex flex-col gap-4 border-b border-r border-black p-5 sm:p-6">
      <div
        className="relative aspect-square overflow-hidden rounded-2xl border border-black/70"
        style={{ backgroundColor: item.bg }}
      >
        <img
          src={imgSrc(item)}
          alt={item.alt}
          loading="lazy"
          className={`absolute inset-0 h-full w-full object-contain ${item.image ? "p-4 drop-shadow-md" : "p-[14%]"}`}
        />
        {item.badge && (
          <span className={`absolute right-3 top-3 rounded-full px-3 py-1 text-[11px] font-medium shadow-sm ${BADGE_STYLE[item.badge] || BADGE_STYLE.Popular}`}>
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
        {isStory && open && <p id={`story-${item.id}`} className="mt-3 text-sm leading-6 text-black/80">{item.body}</p>}
      </div>

      <ul className="flex flex-wrap gap-1.5" aria-label={isStory ? "Topics" : "Specifications"}>
        {item.tags.map((t) => (
          <li key={t} className="rounded-full border border-black/40 px-2.5 py-0.5 text-[11px] text-black/75">
            {t}
          </li>
        ))}
      </ul>

      {!isStory ? (
        <button
          type="button"
          onClick={() => onAdd(item)}
          aria-label={`Add ${item.name} to cart`}
          className={`mt-auto inline-flex w-fit items-center gap-1.5 rounded-full border border-black px-3.5 py-1.5 text-xs font-medium transition-colors hover:bg-black hover:text-[#F4F0E6] ${FOCUS}`}
        >
          {added ? <Check size={14} aria-hidden="true" /> : <Plus size={14} aria-hidden="true" />}
          {added ? "Added" : "Add to cart"}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-expanded={open}
          aria-controls={`story-${item.id}`}
          className={`mt-auto w-fit text-sm font-medium underline underline-offset-4 ${FOCUS}`}
        >
          {open ? "Show less" : "Read story"}
        </button>
      )}
    </article>
  );
}

function CartDrawer({ cart, onClose, onChangeQty, onRemove, onCheckout, ordered }) {
  const panelRef = useRef(null);
  const closeRef = useRef(null);

  const lines = Object.entries(cart)
    .map(([id, qty]) => ({ product: PRODUCTS.find((p) => p.id === Number(id)), qty }))
    .filter((l) => l.product);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);

  useEffect(() => {
    closeRef.current?.focus();
  }, []);

  // Escape closes; Tab is trapped inside the panel.
  const onKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
      return;
    }
    if (e.key !== "Tab") return;
    const focusables = panelRef.current.querySelectorAll("button:not([disabled]), a[href]");
    if (!focusables.length) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  return (
    <div className="font-ui fixed inset-0 z-50 flex justify-end" onKeyDown={onKeyDown}>
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} aria-hidden="true" />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="cart-title"
        className="drawer-in relative flex h-full w-full max-w-md flex-col border-l border-black bg-[#F4F0E6] shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-black p-5">
          <h2 id="cart-title" className="font-display text-2xl font-black">Your cart</h2>
          <button
            ref={closeRef}
            type="button"
            onClick={onClose}
            className={`inline-flex items-center gap-1 text-sm font-bold underline underline-offset-4 hover:text-[#c7351f] ${FOCUS}`}
          >
            <X size={14} aria-hidden="true" /> Close
          </button>
        </div>

        <div className="flex flex-1 flex-col gap-6 overflow-y-auto p-5">
          {ordered ? (
            <div className="mt-10 text-center" role="status">
              <p className="font-display text-xl font-extrabold">Thanks for your order</p>
              <p className="mt-2 text-sm text-black/65">This is a demo store, so no payment was taken.</p>
            </div>
          ) : lines.length === 0 ? (
            <p className="mt-10 text-center text-black/65">Your cart is empty. Add something from the collection.</p>
          ) : (
            lines.map(({ product, qty }) => (
              <div key={product.id} className="flex items-center gap-4">
                <div className="h-20 w-20 flex-shrink-0 rounded-lg border border-black/20" style={{ backgroundColor: product.bg }}>
                  <img src={imgSrc(product)} alt="" className={`h-full w-full object-contain ${product.image ? "p-1" : "p-2"}`} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold">{product.name}</h3>
                  <p className="text-xs text-black/65">{mxn(product.price)}</p>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="inline-flex items-center rounded-full border border-black">
                      <button
                        type="button"
                        onClick={() => onChangeQty(product.id, -1)}
                        aria-label={`Decrease quantity of ${product.name}`}
                        className={`rounded-full p-1.5 hover:bg-black hover:text-[#F4F0E6] ${FOCUS}`}
                      >
                        <Minus size={12} aria-hidden="true" />
                      </button>
                      <span className="min-w-6 text-center text-xs font-bold tabular-nums" aria-label={`Quantity ${qty}`}>{qty}</span>
                      <button
                        type="button"
                        onClick={() => onChangeQty(product.id, 1)}
                        aria-label={`Increase quantity of ${product.name}`}
                        className={`rounded-full p-1.5 hover:bg-black hover:text-[#F4F0E6] ${FOCUS}`}
                      >
                        <Plus size={12} aria-hidden="true" />
                      </button>
                    </div>
                    <button
                      type="button"
                      onClick={() => onRemove(product.id)}
                      aria-label={`Remove ${product.name} from cart`}
                      className={`text-xs underline underline-offset-4 hover:text-[#c7351f] ${FOCUS}`}
                    >
                      Remove
                    </button>
                  </div>
                </div>
                <p className="text-sm font-bold tabular-nums">{mxn(product.price * qty)}</p>
              </div>
            ))
          )}
        </div>

        {!ordered && lines.length > 0 && (
          <div className="border-t border-black p-5">
            <div className="mb-4 flex items-baseline justify-between">
              <span className="text-sm font-medium">Subtotal</span>
              <span className="text-lg font-bold tabular-nums">{mxn(subtotal)}</span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className={`w-full rounded-full bg-black py-3.5 text-sm font-bold text-[#F4F0E6] transition-colors hover:bg-[#c7351f] ${FOCUS}`}
            >
              Place order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function App() {
  useFonts();

  const [tab, setTab] = useState("Shop");
  const [cart, setCart] = useState({});
  const [flash, setFlash] = useState(null);
  const [announce, setAnnounce] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [ordered, setOrdered] = useState(false);

  const flashTimer = useRef(null);
  const cartBtnRef = useRef(null);
  const tabRefs = useRef({});

  const count = Object.values(cart).reduce((a, b) => a + b, 0);
  const items = tab === "Shop" ? PRODUCTS : STORIES;

  const add = (item) => {
    setCart((c) => ({ ...c, [item.id]: (c[item.id] || 0) + 1 }));
    setFlash(item.id);
    setAnnounce(`${item.name} added to cart`);
    clearTimeout(flashTimer.current);
    flashTimer.current = setTimeout(() => setFlash(null), 1200);
  };

  const changeQty = (id, delta) =>
    setCart((c) => {
      const next = (c[id] || 0) + delta;
      if (next <= 0) {
        const { [id]: _removed, ...rest } = c;
        return rest;
      }
      return { ...c, [id]: next };
    });

  const remove = (id) =>
    setCart((c) => {
      const { [id]: _removed, ...rest } = c;
      return rest;
    });

  const checkout = () => {
    setCart({});
    setOrdered(true);
  };

  const closeCart = () => {
    setIsCartOpen(false);
    setOrdered(false);
    cartBtnRef.current?.focus();
  };

  // Clean up timer on unmount.
  useEffect(() => () => clearTimeout(flashTimer.current), []);

  // Lock page scroll while the cart is open.
  useEffect(() => {
    if (!isCartOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [isCartOpen]);

  // Arrow-key navigation for tabs.
  const onTabKeyDown = (e, index) => {
    let next = null;
    if (e.key === "ArrowRight") next = (index + 1) % TABS.length;
    if (e.key === "ArrowLeft") next = (index - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    setTab(TABS[next]);
    tabRefs.current[TABS[next]]?.focus();
  };

  return (
    <div className="font-ui min-h-screen bg-[#F4F0E6] text-[#1b1917]">
      <style>{BASE_CSS}</style>

      <div className="sr-only" role="status" aria-live="polite">{announce}</div>

      <header className="flex items-center justify-between px-5 py-4 sm:px-8">
        <a href="#hero" className={`text-sm font-semibold ${FOCUS}`}>
          {BRAND}
        </a>
        <button
          ref={cartBtnRef}
          type="button"
          onClick={() => setIsCartOpen(true)}
          aria-haspopup="dialog"
          aria-label={`Cart, ${count} ${count === 1 ? "item" : "items"}`}
          className={`inline-flex items-center gap-2 text-sm font-medium ${FOCUS}`}
        >
          <ShoppingBag size={18} aria-hidden="true" />
          Cart
          {count > 0 && (
            <span className="rounded-full bg-black px-2 py-0.5 text-[11px] text-[#F4F0E6]" aria-hidden="true">
              {count}
            </span>
          )}
        </button>
      </header>

      <main>
        <section id="hero" aria-labelledby="hero-title" className="px-3 sm:px-6">
          <h1
            id="hero-title"
            className="font-display text-center font-black leading-[0.85] tracking-[-0.045em]"
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

        <section id="products" aria-label="Storefront" className="px-0 sm:px-6">
          <div className="mx-5 sm:mx-0">
            <h2 className="font-display mb-6 text-3xl font-extrabold tracking-tight sm:text-4xl">
              {tab === "Shop" ? "The collection" : "Discovery"}
            </h2>

            <div role="tablist" aria-label="Storefront sections" className="flex items-end gap-1 pl-3 sm:pl-10">
              {TABS.map((t, i) => {
                const active = tab === t;
                return (
                  <button
                    key={t}
                    ref={(el) => (tabRefs.current[t] = el)}
                    role="tab"
                    type="button"
                    id={`tab-${t}`}
                    aria-selected={active}
                    aria-controls="product-grid"
                    tabIndex={active ? 0 : -1}
                    onClick={() => setTab(t)}
                    onKeyDown={(e) => onTabKeyDown(e, i)}
                    className={`relative -mb-px rounded-t-2xl border border-b-0 px-6 py-2 text-sm font-medium transition-colors ${FOCUS} ${
                      active
                        ? "border-[#c7351f] bg-[#c7351f] pb-2.5 text-white"
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
        </section>
      </main>

      <footer className="flex flex-col items-start justify-between gap-2 border-t border-black px-5 py-6 text-xs sm:flex-row sm:items-center sm:px-8">
        <span className="font-display text-lg font-black tracking-tight">{BRAND}</span>
        <small>© {new Date().getFullYear()} {BRAND}. All rights reserved.</small>
      </footer>

      {isCartOpen && (
        <CartDrawer
          cart={cart}
          ordered={ordered}
          onClose={closeCart}
          onChangeQty={changeQty}
          onRemove={remove}
          onCheckout={checkout}
        />
      )}
    </div>
  );
}
