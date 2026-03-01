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
          borderBottom: `1px solid ${COLORS.faint}`, paddingBottom: 14,
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <BouquetLogo />
            <div>
              <span style={{ fontSize: 20, fontWeight: 400, letterSpacing: "0.22em", textTransform: "uppercase" }}>Posy</span>
              <span style={{ fontSize: 11, color: COLORS.muted, marginLeft: 12, letterSpacing: "0.08em" }}>open collections</span>
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
            marginTop: 14, padding: "14px 18px", background: COLORS.panel,
            fontSize: 13, color: COLORS.muted, lineHeight: 1.9,
            borderLeft: `2px solid ${COLORS.faint}`, animation: "fadeIn 0.25s ease",
          }}>
            Posy draws from the Art Institute of Chicago's open-access collection —
            50,000+ public domain works spanning every culture and era.
            Images come directly from the museum. Context is written by Claude.
          </div>
        )}
      </header>

      <main style={{ width: "100%", maxWidth: 700, padding: "0 32px", flex: 1 }}>

        {state === "idle" && (
          <div style={{
            display: "flex", flexDirection: "column", alignItems: "center",
            paddingTop: "18vh", animation: "fadeIn 0.8s ease",
          }}>
            <p style={{ fontSize: 14, color: COLORS.muted, marginBottom: 40, fontStyle: "italic" }}>
              Something from the archive, for you.
            </p>
            <PosyButton onClick={discover} label="see something" />
          </div>
        )}

        {state === "loading" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "18vh" }}>
            <Spinner />
            <p style={{ color: COLORS.muted, fontSize: 11, letterSpacing: "0.14em", textTransform: "uppercase", marginTop: 20 }}>
              searching the archive
            </p>
          </div>
        )}

        {state === "error" && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: "18vh" }}>
            <p style={{ color: COLORS.muted, marginBottom: 32, fontSize: 14, fontStyle: "italic" }}>
              Couldn't reach the archive.
            </p>
            <PosyButton onClick={discover} label="see something" />
          </div>
        )}

        {state === "loaded" && artwork && (
          <div style={{ animation: "fadeIn 0.5s ease", paddingTop: 40 }}>
            <div style={{ marginBottom: 12, fontSize: 10, letterSpacing: "0.14em", textTransform: "uppercase", color: COLORS.muted }}>
              {artwork.collection}
            </div>

            <div style={{
              width: "100%", background: COLORS.panel, marginBottom: 22,
              minHeight: imageLoaded ? 0 : 260,
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

            <h2 style={{ fontSize: "clamp(17px, 2.8vw, 24px)", fontWeight: 400, margin: "0 0 8px", lineHeight: 1.3 }}>
              {artwork.title}
            </h2>

            <div style={{ fontSize: 12, color: COLORS.muted, letterSpacing: "0.04em", lineHeight: 2, marginBottom: 18 }}>
              {artwork.artist && artwork.artist !== "Unknown" && <span>{artwork.artist}</span>}
              {artwork.artist && artwork.artist !== "Unknown" && (artwork.date || artwork.origin) && (
                <span style={{ margin: "0 8px", opacity: 0.5 }}>·</span>
              )}
              {[artwork.date, artwork.origin].filter(Boolean).join(", ")}
              {artwork.medium && <span style={{ display: "block", fontStyle: "italic" }}>{artwork.medium}</span>}
            </div>

            <div style={{ borderTop: `1px solid ${COLORS.faint}`, margin: "16px 0 20px" }} />

            <p style={{ fontSize: 15, lineHeight: 1.95, color: "rgba(255,255,255,0.85)", margin: "0 0 42px", fontStyle: "italic" }}>
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
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
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
