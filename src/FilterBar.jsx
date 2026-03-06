// ── FilterBar ─────────────────────────────────────────────────────────────────
// Three pill groups: Source, Era, Region.
// Each group is radio-style: one active selection, "All" clears it.
// Era + Region are dimmed when a live-API source is selected (they only
// apply to the Smithsonian archive in the DB).

const COLORS = {
  ink:   "#ffffff",
  muted: "rgba(255,255,255,0.55)",
  faint: "rgba(255,255,255,0.22)",
};

const LIVE_SOURCES = ["met", "rijks", "aic", "europeana", "loc"];

const SOURCES = [
  { value: null,          label: "All" },
  { value: "smithsonian", label: "Smithsonian" },
  { value: "met",         label: "Met" },
  { value: "rijks",       label: "Rijks" },
  { value: "aic",         label: "Art Inst." },
  { value: "europeana",   label: "Europeana" },
  { value: "loc",         label: "LOC" },
];

const ERAS = [
  { value: null,          label: "All" },
  { value: "before-1500", label: "Before 1500" },
  { value: "1500-1800",   label: "1500–1800" },
  { value: "1800-1900",   label: "1800–1900" },
  { value: "1900-1950",   label: "1900–1950" },
  { value: "after-1950",  label: "After 1950" },
];

const REGIONS = [
  { value: null,     label: "All" },
  { value: "france", label: "France" },
  { value: "italy",  label: "Italy" },
  { value: "usa",    label: "USA" },
  { value: "china",  label: "China" },
  { value: "japan",  label: "Japan" },
  { value: "europe", label: "Europe" },
];

// ── Pill ──────────────────────────────────────────────────────────────────────

function Pill({ label, active, onClick, disabled }) {
  return (
    <button
      onClick={disabled ? undefined : onClick}
      style={{
        background:    active ? "rgba(255,255,255,0.18)" : "transparent",
        border:        `1px solid ${active ? "rgba(255,255,255,0.75)" : COLORS.faint}`,
        color:         active ? COLORS.ink : COLORS.muted,
        padding:       "4px 11px",
        fontSize:      9,
        letterSpacing: "0.12em",
        textTransform: "uppercase",
        cursor:        disabled ? "default" : "pointer",
        fontFamily:    "inherit",
        borderRadius:  0,
        whiteSpace:    "nowrap",
        opacity:       disabled ? 0.35 : 1,
        transition:    "all 0.15s ease",
        flexShrink:    0,
      }}
    >
      {label}
    </button>
  );
}

// ── FilterGroup ───────────────────────────────────────────────────────────────

function FilterGroup({ label, options, active, onSelect, disabled }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
      <span style={{
        fontSize:      8,
        letterSpacing: "0.18em",
        textTransform: "uppercase",
        color:         disabled ? "rgba(255,255,255,0.25)" : "rgba(255,255,255,0.38)",
        flexShrink:    0,
        minWidth:      44,
      }}>
        {label}
      </span>
      <div style={{
        display:    "flex",
        gap:        5,
        overflowX:  "auto",
        paddingBottom: 2,           /* leaves room for focus rings if added later */
        scrollbarWidth: "none",     /* Firefox */
        msOverflowStyle: "none",    /* IE */
      }}>
        {options.map(opt => (
          <Pill
            key={opt.value ?? "__all__"}
            label={opt.label}
            active={active === opt.value}
            disabled={disabled && opt.value !== null}
            onClick={() => onSelect(opt.value)}
          />
        ))}
      </div>
    </div>
  );
}

// ── FilterBar (exported) ──────────────────────────────────────────────────────

export default function FilterBar({ filters, onChange }) {
  const isLive = LIVE_SOURCES.includes(filters.source);

  function set(key, value) {
    onChange({ ...filters, [key]: value });
  }

  return (
    <div style={{
      display:       "flex",
      flexDirection: "column",
      gap:           9,
      padding:       "14px 0 16px",
      borderBottom:  `1px solid ${COLORS.faint}`,
    }}>
      <FilterGroup
        label="Source"
        options={SOURCES}
        active={filters.source}
        onSelect={v => set("source", v)}
      />
      <FilterGroup
        label="Era"
        options={ERAS}
        active={filters.era}
        onSelect={v => set("era", v)}
        disabled={isLive}
      />
      <FilterGroup
        label="Region"
        options={REGIONS}
        active={filters.culture}
        onSelect={v => set("culture", v)}
        disabled={isLive}
      />
    </div>
  );
}
