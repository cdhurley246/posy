import { useState, useCallback, useRef } from "react";
import FilterBar from "./FilterBar.jsx";

async function fetchArtwork(filters = {}) {
  const params = new URLSearchParams({ context: "false" });
  if (filters.source)  params.set("source",  filters.source);
  if (filters.era)     params.set("era",      filters.era);
  if (filters.culture) params.set("culture",  filters.culture);
  const res = await fetch(`/api/artwork?${params}`);
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();
}

async function fetchContext(artwork) {
  const res = await fetch("/api/artwork?context=true");
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  // We only want the context for the current artwork, so we call a dedicated endpoint
  // Instead, call Claude directly for context on the existing artwork
  const claudeRes = await fetch("/api/context", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(artwork),
  });
  if (!claudeRes.ok) throw new Error(`Context error ${claudeRes.status}`);
  const data = await claudeRes.json();
  return data.context || "";
}

const COLORS = {
  bg: "#89c4e1",
  ink: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  faint: "rgba(255,255,255,0.25)",
  panel: "rgba(255,255,255,0.12)",
};

// ── Bouquet variations ────────────────────────────────────────────────────────

function BouquetA() {
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="22" y1="46" x2="16" y2="28" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="46" x2="22" y2="26" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="46" x2="28" y2="29" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="46" x2="11" y2="32" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="46" x2="33" y2="31" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M18 36 Q12 33 13 27 Q17 31 18 36Z" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M26 36 Q32 33 31 27 Q27 31 26 36Z" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M15 44 Q22 47 29 44" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="11" cy="24" r="2" stroke="white" strokeWidth="1"/>
      <line x1="11" y1="20" x2="11" y2="18" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="11" y1="28" x2="11" y2="30" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7" y1="24" x2="5" y2="24" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="15" y1="24" x2="17" y2="24" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="8.2" y1="21.2" x2="6.8" y2="19.8" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="13.8" y1="26.8" x2="15.2" y2="28.2" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="13.8" y1="21.2" x2="15.2" y2="19.8" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="8.2" y1="26.8" x2="6.8" y2="28.2" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="22" cy="19" r="2.5" stroke="white" strokeWidth="1.1"/>
      <path d="M22 14 Q25 16 22 19 Q19 16 22 14Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M17 17 Q19 14 22 16 Q20 19 17 17Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M27 17 Q25 14 22 16 Q24 19 27 17Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M33 27 Q31 21 33 16 Q35 21 33 27Z" stroke="white" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M33 27 Q30 22 30 17 Q32.5 21 33 27Z" stroke="white" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M33 27 Q36 22 36 17 Q33.5 21 33 27Z" stroke="white" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <circle cx="16" cy="12" r="1.2" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="16" y1="13.2" x2="16" y2="16" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <circle cx="28" cy="11" r="1.2" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="28" y1="12.2" x2="28" y2="15" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  );
}

function BouquetB() {
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="22" y1="46" x2="17" y2="30" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="46" x2="22" y2="28" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="46" x2="27" y2="30" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="46" x2="13" y2="33" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="22" y1="46" x2="31" y2="33" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M18 38 Q13 35 14 30 Q17 33 18 38Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M26 38 Q31 35 30 30 Q27 33 26 38Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M16 44 Q22 48 28 44" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="13" cy="26" r="1.8" stroke="white" strokeWidth="1"/>
      <path d="M13 22 Q16 23 16 26 Q13 27 13 22Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M13 22 Q10 23 10 26 Q13 27 13 22Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M9 26 Q10 23 13 23 Q13 26 9 26Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M17 26 Q16 23 13 23 Q13 26 17 26Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <circle cx="22" cy="21" r="2.2" stroke="white" strokeWidth="1.1"/>
      <circle cx="22" cy="16.5" r="1.4" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="26" cy="18.5" r="1.4" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="18" cy="18.5" r="1.4" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="25.2" cy="23" r="1.4" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="18.8" cy="23" r="1.4" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="31" cy="26" r="1.8" stroke="white" strokeWidth="1"/>
      <path d="M31 22 Q34 23 34 26 Q31 27 31 22Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M31 22 Q28 23 28 26 Q31 27 31 22Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M27 26 Q28 23 31 23 Q31 26 27 26Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M35 26 Q34 23 31 23 Q31 26 35 26Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <circle cx="17" cy="14" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="17" y1="15" x2="17" y2="18" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <circle cx="27" cy="13" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="27" y1="14" x2="27" y2="17" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  );
}

function BouquetC() {
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="22" y1="47" x2="14" y2="26" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="20" y2="24" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="24" y2="24" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="30" y2="26" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="10" y2="30" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="34" y2="30" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      <path d="M14 26 Q12 20 10 15" stroke="white" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M30 26 Q32 20 34 15" stroke="white" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M18 36 Q13 33 14 28 Q17 31 18 36Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M26 36 Q31 33 30 28 Q27 31 26 36Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M15 45 Q22 49 29 45" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="10" cy="23" r="1.5" stroke="white" strokeWidth="1"/>
      <line x1="10" y1="20" x2="10" y2="18" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="10" y1="26" x2="10" y2="28" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7" y1="23" x2="5" y2="23" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="13" y1="23" x2="15" y2="23" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7.9" y1="20.9" x2="6.5" y2="19.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12.1" y1="25.1" x2="13.5" y2="26.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12.1" y1="20.9" x2="13.5" y2="19.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7.9" y1="25.1" x2="6.5" y2="26.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="22" cy="17" r="2.2" stroke="white" strokeWidth="1.1"/>
      <circle cx="22" cy="12.5" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="25.8" cy="14.3" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="18.2" cy="14.3" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="25" cy="19.5" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="19" cy="19.5" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="34" cy="23" r="1.5" stroke="white" strokeWidth="1"/>
      <line x1="34" y1="20" x2="34" y2="18" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="34" y1="26" x2="34" y2="28" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="31" y1="23" x2="29" y2="23" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="37" y1="23" x2="39" y2="23" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="31.9" y1="20.9" x2="30.5" y2="19.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="36.1" y1="25.1" x2="37.5" y2="26.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="36.1" y1="20.9" x2="37.5" y2="19.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="31.9" y1="25.1" x2="30.5" y2="26.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="18" cy="9" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="18" y1="10" x2="18" y2="13" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <circle cx="26" cy="8" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="26" y1="9" x2="26" y2="12" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  );
}

function BouquetD() {
  // Loose wildflower spray — tall grasses, a poppy, scattered dots
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* stems */}
      <line x1="22" y1="47" x2="18" y2="28" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="22" y2="25" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="26" y2="28" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="12" y2="32" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="32" y2="32" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      {/* wrap */}
      <path d="M15 45 Q22 49 29 45" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* poppy centre */}
      <circle cx="22" cy="18" r="3" stroke="white" strokeWidth="1.1"/>
      <circle cx="22" cy="18" r="1.2" stroke="white" strokeWidth="0.8" fill="none"/>
      {/* poppy petals */}
      <ellipse cx="22" cy="12.5" rx="2" ry="3.2" stroke="white" strokeWidth="0.9" fill="none"/>
      <ellipse cx="27" cy="14.5" rx="2" ry="3.2" stroke="white" strokeWidth="0.9" fill="none" transform="rotate(60 27 14.5)"/>
      <ellipse cx="27" cy="21.5" rx="2" ry="3.2" stroke="white" strokeWidth="0.9" fill="none" transform="rotate(120 27 21.5)"/>
      <ellipse cx="22" cy="23.5" rx="2" ry="3.2" stroke="white" strokeWidth="0.9" fill="none"/>
      <ellipse cx="17" cy="21.5" rx="2" ry="3.2" stroke="white" strokeWidth="0.9" fill="none" transform="rotate(60 17 21.5)"/>
      <ellipse cx="17" cy="14.5" rx="2" ry="3.2" stroke="white" strokeWidth="0.9" fill="none" transform="rotate(120 17 14.5)"/>
      {/* side buds */}
      <circle cx="12" cy="26" r="1.3" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M11 24 Q12 22 13 24" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      <circle cx="32" cy="26" r="1.3" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M31 24 Q32 22 33 24" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* tiny scattered dots */}
      <circle cx="16" cy="10" r="0.8" stroke="white" strokeWidth="0.8" fill="none"/>
      <circle cx="28" cy="9"  r="0.8" stroke="white" strokeWidth="0.8" fill="none"/>
      <line x1="16" y1="10.8" x2="16" y2="14" stroke="white" strokeWidth="0.8" strokeLinecap="round"/>
      <line x1="28" y1="9.8"  x2="28" y2="13" stroke="white" strokeWidth="0.8" strokeLinecap="round"/>
    </svg>
  );
}

function BouquetE() {
  // Tulip trio — three distinct tulip heads on curved stems
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* stems */}
      <path d="M22 47 Q20 38 17 28" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="22" y2="26" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M22 47 Q24 38 27 28" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="11" y2="34" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="33" y2="34" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      {/* wrap */}
      <path d="M15 45 Q22 49 29 45" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* centre tulip */}
      <path d="M19 26 Q19 18 22 17 Q25 18 25 26 Q22 28 19 26Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M20 22 Q22 19 24 22" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* left tulip */}
      <path d="M14 28 Q14 21 17 20 Q20 21 20 28 Q17 30 14 28Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M15 24 Q17 21 19 24" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* right tulip */}
      <path d="M24 28 Q24 21 27 20 Q30 21 30 28 Q27 30 24 28Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M25 24 Q27 21 29 24" stroke="white" strokeWidth="0.8" fill="none" strokeLinecap="round"/>
      {/* outer side stems / leaves */}
      <path d="M11 34 Q9 30 10 25" stroke="white" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M10 25 Q8 22 10 19" stroke="white" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <circle cx="10" cy="18" r="1.2" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M33 34 Q35 30 34 25" stroke="white" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M34 25 Q36 22 34 19" stroke="white" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <circle cx="34" cy="18" r="1.2" stroke="white" strokeWidth="0.9" fill="none"/>
    </svg>
  );
}

function BouquetF() {
  // Daisy cluster — flat open daisies with ray petals
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* stems */}
      <line x1="22" y1="47" x2="16" y2="29" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="22" y2="27" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="28" y2="29" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="11" y2="33" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="33" y2="33" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      {/* wrap */}
      <path d="M15 45 Q22 49 29 45" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* centre daisy */}
      <circle cx="22" cy="20" r="2.2" stroke="white" strokeWidth="1.1"/>
      <line x1="22" y1="14" x2="22" y2="17" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="22" y1="23" x2="22" y2="26" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="16" y1="20" x2="19" y2="20" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="25" y1="20" x2="28" y2="20" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="17.8" y1="15.8" x2="19.9" y2="17.9" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="24.1" y1="22.1" x2="26.2" y2="24.2" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="26.2" y1="15.8" x2="24.1" y2="17.9" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="19.9" y1="22.1" x2="17.8" y2="24.2" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      {/* left daisy */}
      <circle cx="11" cy="27" r="1.6" stroke="white" strokeWidth="1"/>
      <line x1="11" y1="23" x2="11" y2="25" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="11" y1="29" x2="11" y2="31" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="7"  y1="27" x2="9"  y2="27" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="13" y1="27" x2="15" y2="27" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="8.9" y1="24.9" x2="10.1" y2="26.1" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="11.9" y1="27.9" x2="13.1" y2="29.1" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="13.1" y1="24.9" x2="11.9" y2="26.1" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="10.1" y1="27.9" x2="8.9"  y2="29.1" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      {/* right daisy */}
      <circle cx="33" cy="27" r="1.6" stroke="white" strokeWidth="1"/>
      <line x1="33" y1="23" x2="33" y2="25" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="33" y1="29" x2="33" y2="31" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="29" y1="27" x2="31" y2="27" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="35" y1="27" x2="37" y2="27" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="30.9" y1="24.9" x2="32.1" y2="26.1" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="33.9" y1="27.9" x2="35.1" y2="29.1" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="35.1" y1="24.9" x2="33.9" y2="26.1" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <line x1="32.1" y1="27.9" x2="30.9" y2="29.1" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      {/* tiny buds at top */}
      <circle cx="17" cy="12" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="17" y1="13" x2="17" y2="16" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <circle cx="27" cy="11" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="27" y1="12" x2="27" y2="15" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  );
}

const BOUQUETS = [BouquetA, BouquetB, BouquetC, BouquetD, BouquetE, BouquetF];

// ── Petal shapes ─────────────────────────────────────────────────────────────
// Each has a normalised SVG path, intrinsic width + height for the viewBox.
// Shapes are elongated and tapered — lens, teardrop, and curved asymmetric.

const PETAL_SHAPES = [
  // Classic lens: pointed at both ends, widest in the middle
  { d: "M0,5 Q8,0 30,5 Q8,10 0,5Z",                           w: 30, h: 10 },
  // Teardrop: rounded tip on one side, sharp point on the other
  { d: "M0,5 Q3,0 22,3 Q28,5 22,7 Q3,10 0,5Z",               w: 28, h: 10 },
  // Curved / banana: asymmetric, slightly bowed along its length
  { d: "M0,7 Q6,0 20,2 Q28,4 26,9 Q18,14 4,11 Q-1,9 0,7Z",   w: 28, h: 14 },
  // Slim lance: very narrow, like a thin willow leaf
  { d: "M0,4 Q10,0 32,4 Q10,8 0,4Z",                          w: 32, h:  8 },
];

// ── App ───────────────────────────────────────────────────────────────────────

const LIVE_SOURCES = ["met", "rijks", "aic", "europeana", "loc"];

export default function Posy() {
  const [state, setState] = useState("idle");
  const [artwork, setArtwork] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [feedbackText, setFeedbackText] = useState('');
  const [feedbackState, setFeedbackState] = useState('idle'); // idle | sending | sent
  const [context, setContext] = useState("");
  const [contextState, setContextState] = useState("idle"); // idle | loading | loaded
  const [askState, setAskState]         = useState("idle"); // idle | open | loading | answered
  const [question, setQuestion]         = useState("");
  const [answer, setAnswer]             = useState("");
  const [bouquetIndex] = useState(() => Math.floor(Math.random() * BOUQUETS.length));

  // Falling petals — randomised once per session, shown during loading
  const [petals] = useState(() =>
    Array.from({ length: 20 }, () => ({
      left:     Math.random() * 100,
      scale:    0.7 + Math.random() * 0.7,   // 0.7–1.4× the base SVG size
      type:     Math.floor(Math.random() * PETAL_SHAPES.length),
      fallDur:  11 + Math.random() * 8,
      driftDur: 4  + Math.random() * 5,
      delay:   -(Math.random() * 16),
    }))
  );

  // Decorative bottom row — randomised once per visit
  const [bouquetRow] = useState(() => {
    const vw = typeof window !== "undefined" ? window.innerWidth : 1200;
    const count = Math.ceil(vw / 46) + 2;
    return Array.from({ length: count }, () => ({
      variant: Math.floor(Math.random() * BOUQUETS.length),
      scale:   0.7  + Math.random() * 0.55,
      opacity: 0.28 + Math.random() * 0.28,
      rotate:  -12  + Math.random() * 24,
    }));
  });

  // Filter state — null means "All" (no filter active)
  const [filters, setFilters] = useState({ source: null, era: null, culture: null });
  // Ref so discover() always reads the latest filters without being in its dep array
  const filtersRef = useRef({ source: null, era: null, culture: null });

  const BouquetComponent = BOUQUETS[bouquetIndex];

  // discover() accepts an optional filtersOverride so filter changes can pass fresh
  // values immediately (setState is async; the ref is updated synchronously before calling).
  const discover = useCallback(async (filtersOverride) => {
    const activeFilters = filtersOverride !== undefined ? filtersOverride : filtersRef.current;
    setState("loading");
    setArtwork(null);
    setImageLoaded(false);
    setImageError(false);
    setContext("");
    setContextState("idle");
    setAskState("idle");
    setQuestion("");
    setAnswer("");
    try {
      const art = await fetchArtwork(activeFilters);
      if (art.empty) {
        setState("no_results");
        return;
      }
      setArtwork(art);
      setState("loaded");
    } catch (e) {
      console.error(e);
      setState("error");
    }
  }, []); // stable — reads filters via ref

  // Called by FilterBar. Handles the live-source rule (auto-clears era/culture),
  // syncs the ref, and triggers a re-fetch if we're not in the initial idle state.
  function handleFiltersChange(newFilters) {
    const cleaned = LIVE_SOURCES.includes(newFilters.source)
      ? { ...newFilters, era: null, culture: null }
      : newFilters;
    filtersRef.current = cleaned;
    setFilters(cleaned);
    if (state !== "idle") {
      discover(cleaned);
    }
  }

  const askQuestion = useCallback(async (q) => {
    if (!q.trim() || !artwork) return;
    setAskState("loading");
    try {
      const res = await fetch("/api/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title:      artwork.title,
          artist:     artwork.artist,
          date:       artwork.date,
          origin:     artwork.origin,
          medium:     artwork.medium,
          collection: artwork.collection,
          context,           // existing "tell me more" paragraph for reference
          question:   q,
        }),
      });
      if (!res.ok) throw new Error("Question failed");
      const data = await res.json();
      setAnswer(data.answer || "");
      setAskState("answered");
    } catch (e) {
      console.error(e);
      setAskState("open");  // fall back so user can retry
    }
  }, [artwork, context]);

  async function submitFeedback() {
    if (!feedbackText.trim()) return;
    setFeedbackState('sending');
    try {
      await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: feedbackText }),
      });
      setFeedbackState('sent');
    } catch (e) {
      setFeedbackState('idle');
    }
  }

  const tellMeMore = useCallback(async () => {
    if (!artwork || contextState === "loading" || contextState === "loaded") return;
    setContextState("loading");
    try {
      // Pass current artwork data to get context for THIS specific object
      const res = await fetch("/api/context", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: artwork.title,
          artist: artwork.artist,
          date: artwork.date,
          origin: artwork.origin,
          medium: artwork.medium,
          collection: artwork.collection,
          imageUrl: artwork.imageUrl,
        }),
      });
      if (!res.ok) throw new Error("Context fetch failed");
      const data = await res.json();
      setContext(data.context || "");
      setContextState("loaded");
    } catch (e) {
      console.error(e);
      setContextState("idle");
    }
  }, [artwork, contextState]);

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.ink,
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 0 80px 0",
    }}>
      <header style={{ width: "100%", maxWidth: 720, padding: "32px 32px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${COLORS.faint}`, paddingBottom: 16,
        }}>
          <div
            onClick={() => {
              if (state === "idle") return;
              setState("idle");
              setArtwork(null);
              setImageLoaded(false);
              setImageError(false);
              setContext("");
              setContextState("idle");
              setAskState("idle");
              setQuestion("");
              setAnswer("");
            }}
            style={{ display: "flex", alignItems: "center", gap: 14, cursor: state !== "idle" ? "pointer" : "default" }}
          >
            <BouquetComponent />
            <div>
              <span style={{ fontSize: 32, fontWeight: 400, letterSpacing: "0.18em", textTransform: "uppercase", lineHeight: 1 }}>
                Posy
              </span>
              <span style={{ fontSize: 11, color: COLORS.muted, marginLeft: 14, letterSpacing: "0.1em" }}>
                open collections
              </span>
            </div>
          </div>
          <button onClick={() => {
            setShowAbout(v => !v);
            if (showAbout) {
              setFeedbackText('');
              setFeedbackState('idle');
            }
          }} style={{
            background: "transparent", border: "none", color: COLORS.muted,
            fontSize: 11, letterSpacing: "0.12em", textTransform: "uppercase",
            cursor: "pointer", fontFamily: "inherit", padding: 0,
          }}>{showAbout ? "close" : "about"}</button>
        </div>

        {showAbout && (
          <div style={{
            marginTop: 12, padding: "12px 16px", background: COLORS.panel,
            fontSize: 13, color: COLORS.muted, lineHeight: 1.9,
            borderLeft: `2px solid ${COLORS.faint}`, animation: "fadeIn 0.25s ease",
          }}>
            Posy is a wandering curator. Every image comes from an open archive somewhere
            in the world — a museum, a library, a national collection. None of it was chosen
            for you. All of it might be.

            <div style={{ borderTop: `1px solid ${COLORS.faint}`, margin: "12px 0" }} />

            {feedbackState === 'sent' ? (
              <p style={{ margin: 0, fontStyle: "italic" }}>thank you.</p>
            ) : (
              <div>
                <textarea
                  value={feedbackText}
                  onChange={e => setFeedbackText(e.target.value)}
                  placeholder="what's working, what isn't, what you found..."
                  rows={3}
                  style={{
                    width: "100%", background: "transparent", border: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.35)",
                    color: "#ffffff", fontFamily: "inherit",
                    fontSize: 13, fontStyle: "italic",
                    padding: "4px 0", outline: "none",
                    letterSpacing: "0.02em", resize: "none",
                    lineHeight: 1.7, boxSizing: "border-box",
                  }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10 }}>
                  <button
                    onClick={submitFeedback}
                    disabled={feedbackState === 'sending'}
                    style={{
                      background: "transparent", border: "1px solid rgba(255,255,255,0.6)",
                      color: "#ffffff", padding: "6px 20px",
                      fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase",
                      cursor: feedbackState === 'sending' ? "default" : "pointer",
                      fontFamily: "inherit", opacity: feedbackState === 'sending' ? 0.5 : 1,
                      transition: "all 0.22s ease",
                    }}
                  >
                    {feedbackState === 'sending' ? 'sending' : 'feedback'}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Filter bar — hidden until troubleshooting is complete
      <div style={{ width: "100%", maxWidth: 720, padding: "0 32px" }}>
        <FilterBar filters={filters} onChange={handleFiltersChange} />
      </div>
      */}

      <main style={{ width: "100%", maxWidth: 720, padding: "0 32px", flex: 1 }}>

        {state === "idle" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            paddingTop: "14vh", animation: "fadeIn 0.8s ease",
          }}>
            <p style={{
              fontSize: "clamp(20px, 3.5vw, 28px)",
              color: "rgba(255,255,255,0.88)",
              marginBottom: 48,
              fontStyle: "italic",
              textAlign: "center",
              lineHeight: 1.5,
            }}>
              Something from the archive, for you.
            </p>
            <PosyButton onClick={discover} label="see something" large />
          </div>
        )}

        {state === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "14vh" }}>
            <Spinner />
            <p style={{ color: COLORS.muted, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 18 }}>
              searching the archive
            </p>
          </div>
        )}

        {state === "error" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "14vh" }}>
            <p style={{ color: COLORS.muted, marginBottom: 28, fontSize: 14, fontStyle: "italic" }}>
              Couldn't reach the archive.
            </p>
            <PosyButton onClick={discover} label="see something" />
          </div>
        )}

        {state === "no_results" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "14vh" }}>
            <p style={{ color: COLORS.muted, marginBottom: 6, fontSize: 14, fontStyle: "italic", textAlign: "center" }}>
              Nothing in the archive matches these filters.
            </p>
            <p style={{ color: COLORS.muted, marginBottom: 28, fontSize: 11, letterSpacing: "0.06em", opacity: 0.7, textAlign: "center" }}>
              Try widening the era or region.
            </p>
            <PosyButton onClick={() => discover()} label="try again" />
          </div>
        )}

        {state === "loaded" && artwork && (
          <div style={{ animation: "fadeIn 0.5s ease", paddingTop: 28 }}>
            <div style={{ marginBottom: 10, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.muted }}>
              {artwork.collection}
            </div>

            <div style={{
              width: "100%", background: COLORS.panel, marginBottom: 20,
              minHeight: imageLoaded ? 0 : 280,
              display: "flex", alignItems: "center", justifyContent: "center", position: "relative",
            }}>
              {!imageLoaded && !imageError && <div style={{ position: "absolute" }}><Spinner /></div>}
              {imageError ? (
                <div style={{ color: COLORS.muted, fontSize: 13, fontStyle: "italic", padding: "60px 40px", textAlign: "center" }}>
                  Image unavailable —{" "}
                  {artwork.sourceUrl && (
                    <a href={artwork.sourceUrl} target="_blank" rel="noopener noreferrer" style={{ color: COLORS.muted }}>
                      view in collection ↗
                    </a>
                  )}
                </div>
              ) : (
                <img
                  src={artwork.imageUrl}
                  alt={artwork.title}
                  onLoad={() => setImageLoaded(true)}
                  onError={() => { setImageLoaded(true); setImageError(true); }}
                  style={{ width: "100%", display: "block", opacity: imageLoaded ? 1 : 0, transition: "opacity 0.8s ease" }}
                />
              )}
            </div>

            <h2 style={{ fontSize: "clamp(18px, 3vw, 26px)", fontWeight: 400, margin: "0 0 8px", lineHeight: 1.3 }}>
              {artwork.title}
            </h2>

            <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: "0.04em", lineHeight: 2, marginBottom: 14 }}>
              {artwork.artist && artwork.artist !== "Unknown" && <span>{artwork.artist}</span>}
              {artwork.artist && artwork.artist !== "Unknown" && (artwork.date || artwork.origin) && (
                <span style={{ margin: "0 8px", opacity: 0.5 }}>·</span>
              )}
              {[artwork.date, artwork.origin].filter(Boolean).join(", ")}
              {artwork.medium && <span style={{ display: "block", fontStyle: "italic" }}>{artwork.medium}</span>}
            </div>

            {/* Context area */}
            {contextState === "idle" && (
              <div style={{ marginBottom: 14 }}>
                <button
                  onClick={tellMeMore}
                  style={{
                    background: "transparent", border: "none",
                    color: COLORS.muted, fontSize: 11,
                    letterSpacing: "0.12em", textTransform: "uppercase",
                    cursor: "pointer", fontFamily: "inherit", padding: 0,
                    textDecoration: "none",
                    borderBottom: "1px solid rgba(255,255,255,0.2)",
                    paddingBottom: 1,
                  }}
                  onMouseEnter={e => e.target.style.color = "#ffffff"}
                  onMouseLeave={e => e.target.style.color = COLORS.muted}
                >
                  tell me more
                </button>
              </div>
            )}

            {contextState === "loading" && (
              <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
                <Spinner small />
                <span style={{ fontSize: 11, color: COLORS.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                  thinking
                </span>
              </div>
            )}

            {contextState === "loaded" && context && (
              <div style={{ animation: "fadeIn 0.5s ease", marginBottom: 14 }}>
                <div style={{ borderTop: `1px solid ${COLORS.faint}`, margin: "0 0 18px" }} />
                <p style={{ fontSize: 15, lineHeight: 1.95, color: "rgba(255,255,255,0.85)", margin: "0 0 16px", fontStyle: "italic" }}>
                  {context}
                </p>

                {/* ── Ask a question ──────────────────────────────────── */}

                {askState === "idle" && (
                  <button
                    onClick={() => setAskState("open")}
                    style={{
                      background: "transparent", border: "none",
                      color: COLORS.muted, fontSize: 11,
                      letterSpacing: "0.12em", textTransform: "uppercase",
                      cursor: "pointer", fontFamily: "inherit", padding: 0,
                      borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 1,
                    }}
                    onMouseEnter={e => e.target.style.color = "#ffffff"}
                    onMouseLeave={e => e.target.style.color = COLORS.muted}
                  >
                    ask a question
                  </button>
                )}

                {askState === "open" && (
                  <form
                    onSubmit={e => { e.preventDefault(); askQuestion(question); }}
                    style={{ display: "flex", alignItems: "center", gap: 10 }}
                  >
                    <input
                      type="text"
                      value={question}
                      onChange={e => setQuestion(e.target.value)}
                      placeholder="what would you like to know?"
                      autoFocus
                      style={{
                        flex: 1, background: "transparent", border: "none",
                        borderBottom: "1px solid rgba(255,255,255,0.35)",
                        color: "#ffffff", fontFamily: "inherit",
                        fontSize: 13, fontStyle: "italic",
                        padding: "4px 0", outline: "none",
                        letterSpacing: "0.02em",
                      }}
                    />
                    <button
                      type="submit"
                      style={{
                        background: "transparent", border: "none",
                        color: COLORS.muted, fontSize: 16, cursor: "pointer",
                        padding: 0, fontFamily: "inherit", lineHeight: 1,
                        flexShrink: 0,
                      }}
                      onMouseEnter={e => e.target.style.color = "#ffffff"}
                      onMouseLeave={e => e.target.style.color = COLORS.muted}
                    >
                      →
                    </button>
                  </form>
                )}

                {askState === "loading" && (
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <Spinner small />
                    <span style={{ fontSize: 11, color: COLORS.muted, letterSpacing: "0.1em", textTransform: "uppercase" }}>
                      thinking
                    </span>
                  </div>
                )}

                {askState === "answered" && answer && (
                  <div style={{ animation: "fadeIn 0.4s ease" }}>
                    <p style={{ fontSize: 11, color: COLORS.muted, fontStyle: "italic", margin: "0 0 8px", letterSpacing: "0.04em", opacity: 0.8 }}>
                      "{question}"
                    </p>
                    <p style={{ fontSize: 15, lineHeight: 1.95, color: "rgba(255,255,255,0.85)", margin: "0 0 14px" }}>
                      {answer}
                    </p>
                    <button
                      onClick={() => { setAskState("open"); setQuestion(""); setAnswer(""); }}
                      style={{
                        background: "transparent", border: "none",
                        color: COLORS.muted, fontSize: 11,
                        letterSpacing: "0.12em", textTransform: "uppercase",
                        cursor: "pointer", fontFamily: "inherit", padding: 0,
                        borderBottom: "1px solid rgba(255,255,255,0.2)", paddingBottom: 1,
                      }}
                      onMouseEnter={e => e.target.style.color = "#ffffff"}
                      onMouseLeave={e => e.target.style.color = COLORS.muted}
                    >
                      ask another
                    </button>
                  </div>
                )}
              </div>
            )}

            <div style={{ borderTop: `1px solid ${COLORS.faint}`, margin: "18px 0" }} />

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              {artwork.sourceUrl ? <LinkOut href={artwork.sourceUrl} label="view in collection ↗" /> : <span />}
              <PosyButton onClick={discover} label="see something" small />
            </div>
          </div>
        )}
      </main>

      {/* Falling petals — loading screen only */}
      {state === "loading" && petals.map((p, i) => (
        <div
          key={i}
          style={{
            position:       "fixed",
            left:           `${p.left}%`,
            top:            0,
            pointerEvents:  "none",
            zIndex:         10,
            animation:      `petalDrift ${p.driftDur}s linear ${p.delay}s infinite`,
          }}
        >
          <svg
            width={PETAL_SHAPES[p.type].w * p.scale}
            height={PETAL_SHAPES[p.type].h * p.scale}
            viewBox={`0 0 ${PETAL_SHAPES[p.type].w} ${PETAL_SHAPES[p.type].h}`}
            style={{ display: "block", animation: `petalFall ${p.fallDur}s linear ${p.delay}s infinite` }}
          >
            <path d={PETAL_SHAPES[p.type].d} fill="rgba(255,255,255,0.82)" />
          </svg>
        </div>
      ))}

      {/* Decorative bouquet row — fixed at bottom, idle screen only */}
      {state === "idle" && (
        <div style={{
          position:      "fixed",
          bottom:        0,
          left:          0,
          right:         0,
          display:       "flex",
          alignItems:    "flex-end",
          overflow:      "hidden",
          gap:           2,
          pointerEvents: "none",
          animation:     "fadeIn 1.4s ease",
          zIndex:        0,
        }}>
          {bouquetRow.map((b, i) => {
            const Bq = BOUQUETS[b.variant];
            return (
              <div key={i} style={{
                opacity:         b.opacity,
                transform:       `scale(${b.scale}) rotate(${b.rotate}deg)`,
                transformOrigin: "bottom center",
                flexShrink:      0,
                lineHeight:      0,
              }}>
                <Bq />
              </div>
            );
          })}
        </div>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes petalFall {
          /* Variable vertical speed: slow → catches air → drops → glides in */
          0%   { transform: translateY(-60px); opacity: 0; }
          6%   { opacity: 1; }
          18%  { transform: translateY(10vh); }
          48%  { transform: translateY(50vh); }
          72%  { transform: translateY(65vh); }
          92%  { opacity: 0.7; }
          100% { transform: translateY(115vh); opacity: 0; }
        }
        @keyframes petalDrift {
          /* Wide, lazy arcs — rotation follows horizontal direction like a real petal */
          0%   { transform: translateX(0px)   rotate(-4deg); }
          22%  { transform: translateX(85px)  rotate(13deg); }
          45%  { transform: translateX(35px)  rotate(5deg);  }
          68%  { transform: translateX(-75px) rotate(-15deg); }
          88%  { transform: translateX(-18px) rotate(-4deg); }
          100% { transform: translateX(12px)  rotate(2deg);  }
        }
        input::placeholder { color: rgba(255,255,255,0.35); font-style: italic; }
      `}</style>
    </div>
  );
}

function Spinner({ small }) {
  const size = small ? 16 : 28;
  return (
    <div style={{
      width: size, height: size,
      border: "1px solid rgba(255,255,255,0.3)",
      borderTop: "1px solid rgba(255,255,255,0.9)",
      borderRadius: "50%", animation: "spin 1.4s linear infinite",
      flexShrink: 0,
    }} />
  );
}

function PosyButton({ onClick, label, small, large }) {
  const [hovered, setHovered] = useState(false);
  const padding  = large ? "22px 72px"  : small ? "8px 22px"  : "14px 44px";
  const fontSize = large ? 15           : small ? 11           : 12;
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.2)" : "transparent",
        border: `1px solid rgba(255,255,255,${hovered ? "0.9" : "0.6"})`,
        color: "#ffffff",
        padding,
        fontSize,
        letterSpacing: "0.18em", textTransform: "uppercase",
        cursor: "pointer", transition: "all 0.22s ease", fontFamily: "inherit",
      }}
    >{label}</button>
  );
}

function LinkOut({ href, label }) {
  const [hovered, setHovered] = useState(false);
  return (
    <a href={href} target="_blank" rel="noopener noreferrer"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        fontSize: 11, letterSpacing: "0.1em", textTransform: "uppercase",
        color: hovered ? "#ffffff" : COLORS.muted,
        textDecoration: "none",
        borderBottom: `1px solid ${hovered ? "rgba(255,255,255,0.5)" : "transparent"}`,
        paddingBottom: 1, transition: "all 0.2s",
      }}
    >{label}</a>
  );
}
