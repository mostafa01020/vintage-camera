import { useEffect, useRef } from "react";
import { Minus, Plus, X } from "lucide-react";
import { FOCUS, PRODUCTS, imgSrc, mxn } from "../data/storeData";

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

export default CartDrawer;