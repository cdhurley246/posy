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

// ── Bouquet variations ────────────────────────────────────────────────────────

function BouquetA() {
  // Loose, asymmetric — tall stems, daisy + tulip + bud
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
      {/* Daisy left */}
      <circle cx="11" cy="24" r="2" stroke="white" strokeWidth="1"/>
      <line x1="11" y1="20" x2="11" y2="18" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="11" y1="28" x2="11" y2="30" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7" y1="24" x2="5" y2="24" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="15" y1="24" x2="17" y2="24" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="8.2" y1="21.2" x2="6.8" y2="19.8" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="13.8" y1="26.8" x2="15.2" y2="28.2" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="13.8" y1="21.2" x2="15.2" y2="19.8" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="8.2" y1="26.8" x2="6.8" y2="28.2" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      {/* Center rose */}
      <circle cx="22" cy="19" r="2.5" stroke="white" strokeWidth="1.1"/>
      <path d="M22 14 Q25 16 22 19 Q19 16 22 14Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M17 17 Q19 14 22 16 Q20 19 17 17Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M27 17 Q25 14 22 16 Q24 19 27 17Z" stroke="white" strokeWidth="1" fill="none"/>
      {/* Tulip right */}
      <path d="M33 27 Q31 21 33 16 Q35 21 33 27Z" stroke="white" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M33 27 Q30 22 30 17 Q32.5 21 33 27Z" stroke="white" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      <path d="M33 27 Q36 22 36 17 Q33.5 21 33 27Z" stroke="white" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
      {/* Buds */}
      <circle cx="16" cy="12" r="1.2" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="16" y1="13.2" x2="16" y2="16" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <circle cx="28" cy="11" r="1.2" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="28" y1="12.2" x2="28" y2="15" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  );
}

function BouquetB() {
  // Compact, rounded — three flowers close together
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
      {/* Left — poppy */}
      <circle cx="13" cy="26" r="1.8" stroke="white" strokeWidth="1"/>
      <path d="M13 22 Q16 23 16 26 Q13 27 13 22Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M13 22 Q10 23 10 26 Q13 27 13 22Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M9 26 Q10 23 13 23 Q13 26 9 26Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M17 26 Q16 23 13 23 Q13 26 17 26Z" stroke="white" strokeWidth="0.9" fill="none"/>
      {/* Center — full bloom */}
      <circle cx="22" cy="21" r="2.2" stroke="white" strokeWidth="1.1"/>
      <circle cx="22" cy="16.5" r="1.4" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="26" cy="18.5" r="1.4" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="18" cy="18.5" r="1.4" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="25.2" cy="23" r="1.4" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="18.8" cy="23" r="1.4" stroke="white" strokeWidth="1" fill="none"/>
      {/* Right — anemone */}
      <circle cx="31" cy="26" r="1.8" stroke="white" strokeWidth="1"/>
      <path d="M31 22 Q34 23 34 26 Q31 27 31 22Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M31 22 Q28 23 28 26 Q31 27 31 22Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M27 26 Q28 23 31 23 Q31 26 27 26Z" stroke="white" strokeWidth="0.9" fill="none"/>
      <path d="M35 26 Q34 23 31 23 Q31 26 35 26Z" stroke="white" strokeWidth="0.9" fill="none"/>
      {/* Buds */}
      <circle cx="17" cy="14" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="17" y1="15" x2="17" y2="18" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <circle cx="27" cy="13" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="27" y1="14" x2="27" y2="17" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  );
}

function BouquetC() {
  // Tall and wild — grasses, wildflowers, sprawling
  return (
    <svg width="44" height="52" viewBox="0 0 44 52" fill="none" xmlns="http://www.w3.org/2000/svg">
      <line x1="22" y1="47" x2="14" y2="26" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="20" y2="24" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="24" y2="24" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="30" y2="26" stroke="white" strokeWidth="1.2" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="10" y2="30" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      <line x1="22" y1="47" x2="34" y2="30" stroke="white" strokeWidth="1.1" strokeLinecap="round"/>
      {/* Grass blades */}
      <path d="M14 26 Q12 20 10 15" stroke="white" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M30 26 Q32 20 34 15" stroke="white" strokeWidth="0.9" fill="none" strokeLinecap="round"/>
      <path d="M18 36 Q13 33 14 28 Q17 31 18 36Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M26 36 Q31 33 30 28 Q27 31 26 36Z" stroke="white" strokeWidth="1" fill="none"/>
      <path d="M15 45 Q22 49 29 45" stroke="white" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
      {/* Left wildflower */}
      <circle cx="10" cy="23" r="1.5" stroke="white" strokeWidth="1"/>
      <line x1="10" y1="20" x2="10" y2="18" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="10" y1="26" x2="10" y2="28" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7" y1="23" x2="5" y2="23" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="13" y1="23" x2="15" y2="23" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7.9" y1="20.9" x2="6.5" y2="19.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12.1" y1="25.1" x2="13.5" y2="26.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="12.1" y1="20.9" x2="13.5" y2="19.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="7.9" y1="25.1" x2="6.5" y2="26.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      {/* Center tall flower */}
      <circle cx="22" cy="17" r="2.2" stroke="white" strokeWidth="1.1"/>
      <circle cx="22" cy="12.5" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="25.8" cy="14.3" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="18.2" cy="14.3" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="25" cy="19.5" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      <circle cx="19" cy="19.5" r="1.3" stroke="white" strokeWidth="1" fill="none"/>
      {/* Right wildflower */}
      <circle cx="34" cy="23" r="1.5" stroke="white" strokeWidth="1"/>
      <line x1="34" y1="20" x2="34" y2="18" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="34" y1="26" x2="34" y2="28" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="31" y1="23" x2="29" y2="23" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="37" y1="23" x2="39" y2="23" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="31.9" y1="20.9" x2="30.5" y2="19.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="36.1" y1="25.1" x2="37.5" y2="26.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="36.1" y1="20.9" x2="37.5" y2="19.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      <line x1="31.9" y1="25.1" x2="30.5" y2="26.5" stroke="white" strokeWidth="1" strokeLinecap="round"/>
      {/* Small buds */}
      <circle cx="18" cy="9" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="18" y1="10" x2="18" y2="13" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
      <circle cx="26" cy="8" r="1" stroke="white" strokeWidth="0.9" fill="none"/>
      <line x1="26" y1="9" x2="26" y2="12" stroke="white" strokeWidth="0.9" strokeLinecap="round"/>
    </svg>
  );
}

const BOUQUETS = [BouquetA, BouquetB, BouquetC];

function BouquetLogo({ index }) {
  const B = BOUQUETS[index % BOUQUETS.length];
  return <B />;
}

// ── App ───────────────────────────────────────────────────────────────────────

export default function Posy() {
  const [state, setState] = useState("idle");
  const [artwork, setArtwork] = useState(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [bouquetIndex] = useState(() => Math.floor(Math.random() * BOUQUETS.length));

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
      padding: "0 0 80px 0",
    }}>
      <header style={{ width: "100%", maxWidth: 720, padding: "32px 32px 0" }}>
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          borderBottom: `1px solid ${COLORS.faint}`, paddingBottom: 16,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <BouquetLogo index={bouquetIndex} />
            <div>
              <span style={{
                fontSize: 32, fontWeight: 400,
                letterSpacing: "0.18em", textTransform: "uppercase",
                lineHeight: 1,
              }}>Posy</span>
              <span style={{ fontSize: 11, color: COLORS.muted, marginLeft: 14, letterSpacing: "0.1em" }}>
                open collections
              </span>
            </div>
          </div>
          <button onClick={() => setShowAbout(v => !v)} style={{
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
            Posy draws from the Art Institute of Chicago, Rijksmuseum, and Metropolitan Museum
            of Art — hundreds of thousands of open-access works spanning every culture and era.
            Images come directly from the museums. Context is written by Claude.
          </div>
        )}
      </header>

      <main style={{ width: "100%", maxWidth: 720, padding: "0 32px", flex: 1 }}>

        {state === "idle" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            paddingTop: "14vh", animation: "fadeIn 0.8s ease",
          }}>
            <p style={{ fontSize: 15, color: COLORS.muted, marginBottom: 32, fontStyle: "italic" }}>
              Something from the archive, for you.
            </p>
            <PosyButton onClick={discover} label="see something" />
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

            <div style={{ borderTop: `1px solid ${COLORS.faint}`, margin: "14px 0 18px" }} />

            <p style={{ fontSize: 15, lineHeight: 1.95, color: "rgba(255,255,255,0.85)", margin: "0 0 32px", fontStyle: "italic" }}>
              {artwork.context}
            </p>

            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 }}>
              {artwork.sourceUrl ? <LinkOut href={artwork.sourceUrl} label="view in collection ↗" /> : <span />}
              <PosyButton onClick={discover} label="see something" small />
            </div>
          </div>
        )}
      </main>

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

function Spinner() {
  return (
    <div style={{
      width: 28, height: 28,
      border: "1px solid rgba(255,255,255,0.3)",
      borderTop: "1px solid rgba(255,255,255,0.9)",
      borderRadius: "50%", animation: "spin 1.4s linear infinite",
    }} />
  );
}

function PosyButton({ onClick, label, small }) {
  const [hovered, setHovered] = useState(false);
  return (
    <button onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "rgba(255,255,255,0.2)" : "transparent",
        border: `1px solid rgba(255,255,255,${hovered ? "0.9" : "0.6"})`,
        color: "#ffffff",
        padding: small ? "8px 22px" : "14px 44px",
        fontSize: small ? 11 : 12,
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
