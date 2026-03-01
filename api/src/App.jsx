import { useState, useCallback } from "react";

async function fetchArtwork() {
  const res = await fetch("/api/artwork");
  if (!res.ok) throw new Error(`Server error ${res.status}`);
  return res.json();
}

const COLORS = {
  bg: "#89c4e1",
  ink: "#ffffff",
  muted: "rgba(255,255,255,0.6)",
  faint: "rgba(255,255,255,0.25)",
  panel: "rgba(255,255,255,0.12)",
};

function BouquetLogo() {
  return (
    <svg width="38" height="44" viewBox="0 0 38 44" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
      <line x1="19" y1="38" x2="14" y2="24" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="19" y1="38" x2="19" y2="22" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="19" y1="38" x2="24" y2="24" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="19" y1="38" x2="10" y2="26" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="19" y1="38" x2="28" y2="26" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <path d="M16 30 Q11 27 12 23 Q15 26 16 30Z" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M22 30 Q27 27 26 23 Q23 26 22 30Z" stroke="white" strokeWidth="1" fill="none" strokeLinecap="round"/>
      <path d="M14 36 Q19 39 24 36" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      <circle cx="10" cy="20" r="1.5" stroke="white" strokeWidth="1"/>
      <line x1="10" y1="17" x2="10" y2="15" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="10" y1="23" x2="10" y2="25" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7" y1="20" x2="5" y2="20" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="13" y1="20" x2="15" y2="20" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7.9" y1="17.9" x2="6.5" y2="16.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12.1" y1="22.1" x2="13.5" y2="23.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12.1" y1="17.9" x2="13.5" y2="16.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7.9" y1="22.1" x2="6.5" y2="23.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <circle cx="19" cy="16" r="2" stroke="white" strokeWidth="1.1"/>
      <circle cx="19" cy="12" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="23" cy="14" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="15" cy="14" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="22.4" cy="18.4" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="15.6" cy="18.4" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M28 22 Q26 17 28 13 Q30 17 28 22Z" stroke="white" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M28 22 Q25 18 25 14 Q27.5 17 28 22Z" stroke="white" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M28 22 Q31 18 31 14 Q28.5 17 28 22Z" stroke="white" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <circle cx="14" cy="10" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="14" y1="11" x2="14" y2="13" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <circle cx="24" cy="9" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="24" y1="10" x2="24" y2="12" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  );
}

export default function Posy() {
  const [state, setState] = useState("idle");
  const [artwork, setArtwork] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAbout, setShowAbout] = useState(false);

  const discover = useCallback(async () => {
    setState("loading");
    setArtwork(null);
    setImageLoaded(false);
    setImageError(false);
    try {
      const art = await fetchArtwork();
      setArtwork(art);
      setState("loaded");
    } catch (e) {
      console.error(e);
      setState("error");
    }
  }, []);

  return (
    <div style={{
      minHeight: "100vh",
      background: COLORS.bg,
      color: COLORS.ink,
      fontFamily: "'Palatino Linotype', 'Book Antiqua', Palatino, Georgia, serif",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: "0 0 100px 0",
    }}>
      <header style={{ width: "100%", maxWidth: 700, padding: "40px 32px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
