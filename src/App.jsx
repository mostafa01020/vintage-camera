import { useEffect, useRef, useState } from "react";
import { ShoppingBag } from "lucide-react";
import Card from "./components/Card";
import CartDrawer from "./components/CartDrawer";
import { BASE_CSS, useFonts } from "./hooks/useFonts";
import { BRAND, FOCUS, PRODUCTS, STORIES, TABS } from "./data/storeData";

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
