import { useState } from "react";
import { Check, Plus } from "lucide-react";
import { BADGE_STYLE, FOCUS, imgSrc, mxn } from "../data/storeData";

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
export default Card;
