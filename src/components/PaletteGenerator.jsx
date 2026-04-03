import { useState, useEffect, useRef } from "react";
import { generatePalettes } from "../lib/generatePalette";
import "./PaletteGenerator.css";

const PER_PAGE = 6;

function luminance(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return 0.299 * r + 0.587 * g + 0.114 * b;
}

function Swatch({ color, index }) {
  const [copied, setCopied] = useState(false);
  const [visible, setVisible] = useState(false);
  const light = luminance(color) > 160;

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 40);
    return () => clearTimeout(t);
  }, [index]);

  const handleCopy = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(color);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <div
      className={`swatch ${visible ? "visible" : ""}`}
      style={{ backgroundColor: color, "--i": index }}
      onClick={handleCopy}
    >
      <div className={`swatch-info ${light ? "dark-text" : ""}`}>
        <span className="swatch-hex">{copied ? "Copied!" : color.toUpperCase()}</span>
      </div>
    </div>
  );
}

function PaletteCard({ palette, isFavourite, toggleFavourite, setPreviewPalette, previewPalette }) {
  const isPreviewing = previewPalette?.name === palette.name;
  const [copiedAll, setCopiedAll] = useState(false);
  
   const copyAll = (e) => {                           // ← add this function
    e.stopPropagation();
    navigator.clipboard.writeText(palette.colors.join(", "));
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 1500);
  };

  const exportCSS = (e) => {
    e.stopPropagation();
    const css = palette.colors.map((c, i) => `  --color-${i + 1}: ${c};`).join("\n");
    const blob = new Blob([`:root {\n${css}\n}\n`], { type: "text/css" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${palette.name.replace(/\s+/g, "-").toLowerCase()}.css`;
    a.click();
  };

  return (
    <div className={`palette-card ${isPreviewing ? "previewing" : ""}`}>
      <div className="palette-row">
        {palette.colors.map((color, i) => (
          <Swatch key={color + i} color={color} index={i} />
        ))}
      </div>
      <div className="card-footer">
        <span className="card-name">{palette.name}</span>
        <div className="card-actions">
          <button
            className={`card-btn test-btn ${isPreviewing ? "active" : ""}`}
            onClick={() => setPreviewPalette(isPreviewing ? null : palette)}
            title="Test as app theme"
          >
            {isPreviewing ? "Restore" : "Test theme"}
          </button>
          <button className="card-btn icon-btn" onClick={copyAll} title="Copy all hex codes">
    {copiedAll ? (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <polyline points="20 6 9 17 4 12"/>
      </svg>
    ) : (
      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
        <rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
      </svg>
    )}
  </button>
          <button className="card-btn icon-btn" onClick={exportCSS} title="Export CSS">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="7 10 12 15 17 10"/>
              <line x1="12" y1="15" x2="12" y2="3"/>
            </svg>
          </button>
          <button
            className={`card-btn icon-btn heart-btn ${isFavourite(palette) ? "loved" : ""}`}
            onClick={() => toggleFavourite(palette)}
            title="Save to favourites"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill={isFavourite(palette) ? "var(--accent)" : "none"} stroke="var(--accent)" strokeWidth="2">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default function PaletteGenerator({
  activeTheme, setActiveTheme,
  toggleFavourite, isFavourite,
  previewPalette, setPreviewPalette,
}) {
  const [prompt, setPrompt] = useState("");
  const [allPalettes, setAllPalettes] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastPrompt, setLastPrompt] = useState("");
  const inputRef = useRef(null);

  // ✅ FIX: sidebar click now auto-generates
  useEffect(() => {
    if (activeTheme) {
      setPrompt(activeTheme);
      handleGenerate(activeTheme);
    }
  }, [activeTheme]);

  const handleGenerate = async (customPrompt) => {
    const finalPrompt = (customPrompt || prompt).trim();
    if (!finalPrompt) return;
    setLoading(true);
    setError(null);
    setAllPalettes([]);
    setPage(1);
    setLastPrompt(finalPrompt);
    try {
      // ✅ FIX: calls generatePalettes (plural) asking for 15
      const results = await generatePalettes(finalPrompt, PER_PAGE);
      setAllPalettes(results);
    } catch (err) {
      setError("Generation failed — check your API key or try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = async () => {
    if (!lastPrompt) return;
    setLoading(true);
    setError(null);
    try {
      const more = await generatePalettes(lastPrompt, PER_PAGE);
      setAllPalettes((prev) => [...prev, ...more]);
      setPage((p) => p + 1);
    } catch (err) {
      setError("Failed to load more — try again.");
    } finally {
      setLoading(false);
    }
  };

  const visiblePalettes = allPalettes.slice(0, page * PER_PAGE);

  return (
    <main className="generator">
      <div className="hero">
        <h1 className="hero-title">
          {lastPrompt ? lastPrompt : "Colour Palette Generator"}
        </h1>
        <p className="hero-sub">
          {allPalettes.length > 0
            ? `${allPalettes.length} palettes generated · click any swatch to copy hex`
            : "Type a vibe, mood, or pick a theme from the sidebar"}
        </p>
      </div>

      <div className="input-section">
        <div className="input-wrap">
          <svg className="input-icon" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input
            ref={inputRef}
            className="prompt-input"
            type="text"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleGenerate()}
            placeholder="e.g. coquette, rainy Tokyo, golden hour Tuscany..."
          />
          {prompt && (
            <button className="clear-btn" onClick={() => { setPrompt(""); setActiveTheme(null); }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
        <button
          className="generate-btn"
          onClick={() => handleGenerate()}
          disabled={loading || !prompt.trim()}
        >
          {loading
            ? <span className="btn-loading"><span className="spinner" />Generating…</span>
            : "Generate →"}
        </button>
      </div>

      {error && <p className="error-msg">{error}</p>}

      {allPalettes.length === 0 && !loading && (
        <div className="empty-state">
          <div className="empty-swatches">
            {["#fdf0f5","#f7c5d5","#e8a0b8","#c4687a","#8b3a52"].map((c, i) => (
              <div key={i} className="empty-swatch" style={{ backgroundColor: c, opacity: 0.3 + i * 0.15 }} />
            ))}
          </div>
          <p className="empty-label">Your palettes will appear here</p>
        </div>
      )}

      {loading && (
        <div className="loading-grid">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="palette-card skeleton-card">
              <div className="palette-row">
                {[...Array(5)].map((_, j) => (
                  <div key={j} className="swatch skeleton-swatch" style={{ animationDelay: `${j * 0.08}s` }} />
                ))}
              </div>
              <div className="card-footer skeleton-footer" />
            </div>
          ))}
        </div>
      )}

      {visiblePalettes.length > 0 && (
        <>
          <div className="palettes-grid">
            {visiblePalettes.map((palette, idx) => (
              <PaletteCard
                key={palette.name + idx}
                palette={palette}
                isFavourite={isFavourite}
                toggleFavourite={toggleFavourite}
                setPreviewPalette={setPreviewPalette}
                previewPalette={previewPalette}
              />
            ))}
          </div>

          <div className="pagination">
            <button
              className="load-more-btn"
              onClick={handleLoadMore}
              disabled={loading}
            >
              {loading ? "Loading…" : "Load more →"}
            </button>
            <span className="page-count">Page {page}</span>
          </div>
        </>
      )}
    </main>
  );
}