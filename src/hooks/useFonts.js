import { useEffect } from "react";
const FONT_URL =
  "https://fonts.googleapis.com/css2?family=Instrument+Sans:wght@400;500;600&family=Playfair+Display:wght@800;900&display=swap";

export const BASE_CSS = `
.font-display{font-family:'Playfair Display','Times New Roman',serif}
.font-ui{font-family:'Instrument Sans',system-ui,sans-serif}
@keyframes drawer-in{from{transform:translateX(100%)}to{transform:translateX(0)}}
.drawer-in{animation:drawer-in .3s ease-out}
@media (prefers-reduced-motion:reduce){.drawer-in{animation:none}}
`;

export function useFonts() {
  useEffect(() => {
    if (document.getElementById("archivo-fonts")) return;
    const link = document.createElement("link");
    link.id = "archivo-fonts";
    link.rel = "stylesheet";
    link.href = FONT_URL;
    document.head.appendChild(link);
  }, []);
}
