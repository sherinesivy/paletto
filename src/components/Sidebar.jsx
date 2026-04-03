import { useState } from "react";
import "./Sidebar.css";

const THEME_GROUPS = [
  {
    label: "Nature",
    themes: [
      { id: "sunset over the ocean", label: "Sunset", emoji: "🌅" },
      { id: "deep enchanted forest", label: "Deep Forest", emoji: "🌲" },
      { id: "ocean depths bioluminescent", label: "Ocean Depths", emoji: "🌊" },
      { id: "sahara desert golden hour", label: "Desert Sand", emoji: "🏜️" },
      { id: "aurora borealis night sky", label: "Aurora Borealis", emoji: "🌌" },
      { id: "cherry blossom spring garden", label: "Cherry Blossom", emoji: "🌸" },
      { id: "volcanic lava and ash", label: "Volcanic", emoji: "🌋" },
    ],
  },
  {
    label: "Moods",
    themes: [
      { id: "melancholy rainy day", label: "Melancholy", emoji: "🌧️" },
      { id: "euphoria golden light", label: "Euphoria", emoji: "✨" },
      { id: "nostalgia 90s childhood", label: "Nostalgia", emoji: "📼" },
      { id: "dark mystery gothic", label: "Mystery", emoji: "🔮" },
      { id: "serene calm meditation", label: "Calm", emoji: "🕊️" },
      { id: "romantic love roses candles", label: "Romantic", emoji: "🕯️" },
    ],
  },
  {
    label: "Aesthetics",
    themes: [
      { id: "coquette pink ribbons bows", label: "Coquette", emoji: "🎀" },
      { id: "cyberpunk neon city rain", label: "Cyberpunk", emoji: "🤖" },
      { id: "cottagecore wildflower meadow", label: "Cottagecore", emoji: "🌻" },
      { id: "vaporwave retro pastel", label: "Vaporwave", emoji: "🌴" },
      { id: "dark academia library books", label: "Dark Academia", emoji: "📚" },
      { id: "coastal grandmother beach linen", label: "Coastal", emoji: "⛵" },
      { id: "old money vintage luxury", label: "Old Money", emoji: "🏛️" },
    ],
  },
  {
    label: "Seasons",
    themes: [
      { id: "spring bloom wildflowers", label: "Spring", emoji: "🌷" },
      { id: "summer heat golden sunshine", label: "Summer", emoji: "☀️" },
      { id: "autumn fall harvest leaves", label: "Autumn", emoji: "🍂" },
      { id: "winter frost snow ice", label: "Winter", emoji: "❄️" },
    ],
  },
];

export default function Sidebar({
  activeTheme, setActiveTheme, isOpen,
  appTheme, setAppTheme, appThemes,
  favourites, toggleFavourite,
}) {
  const [tab, setTab] = useState("themes");

  return (
    <aside className={`sidebar ${isOpen ? "open" : ""}`}>
      <div className="sidebar-logo">
        <span className="logo-mark">P</span>
        <span className="logo-text">Paletto</span>
      </div>

      <div className="sidebar-tabs">
        {["themes", "app", "favs"].map((t) => (
          <button key={t} className={`stab ${tab === t ? "active" : ""}`} onClick={() => setTab(t)}>
            {t === "themes" ? "Themes" : t === "app" ? "Style" : `Saved${favourites.length ? ` (${favourites.length})` : ""}`}
          </button>
        ))}
      </div>

      <div className="sidebar-scroll">
        {tab === "themes" && (
          <>
            <p className="sidebar-hint">Click to generate instantly</p>
            {THEME_GROUPS.map((group) => (
              <div key={group.label} className="theme-group">
                <p className="group-label">{group.label}</p>
                {group.themes.map((theme) => (
                  <button
                    key={theme.id}
                    className={`theme-btn ${activeTheme === theme.id ? "active" : ""}`}
                    onClick={() => setActiveTheme(theme.id)}
                  >
                    <span className="theme-emoji">{theme.emoji}</span>
                    <span className="theme-label">{theme.label}</span>
                    {activeTheme === theme.id && <span className="theme-active-dot" />}
                  </button>
                ))}
              </div>
            ))}
          </>
        )}

        {tab === "app" && (
          <>
            <p className="sidebar-hint">Change the app's look</p>
            {appThemes.map((theme) => (
              <button
                key={theme.id}
                className={`app-theme-btn ${appTheme.id === theme.id ? "active" : ""}`}
                onClick={() => setAppTheme(theme)}
              >
                <div className="app-theme-swatches">
                  {[theme.vars["--bg"], theme.vars["--accent"], theme.vars["--text"], theme.vars["--bg-3"]].map((c, i) => (
  <div key={i} className="app-theme-chip" style={{ background: c }} />
))}
                </div>
                <div className="app-theme-info">
                  <span className="app-theme-emoji">{theme.emoji}</span>
                  <span className="app-theme-name">{theme.name}</span>
                </div>
                {appTheme.id === theme.id && (
                  <svg className="check-icon" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12"/>
                  </svg>
                )}
              </button>
            ))}
          </>
        )}

        {tab === "favs" && (
          <>
            {favourites.length === 0 ? (
              <div className="empty-favs">
                <span>🤍</span>
                <p>No saved palettes yet.<br/>Hit the heart on any palette.</p>
              </div>
            ) : (
              <>
                <p className="sidebar-hint">{favourites.length} saved palette{favourites.length !== 1 ? "s" : ""}</p>
                {favourites.map((fav) => (
                  <div key={fav.savedAt} className="fav-item">
                    <div className="fav-chips">
                      {fav.colors.map((c, i) => <div key={i} className="fav-chip" style={{ background: c }} />)}
                    </div>
                    <div className="fav-meta">
                      <span className="fav-name">{fav.name}</span>
                    </div>
                    <button className="fav-remove" onClick={() => toggleFavourite(fav)}>
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                        <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                      </svg>
                    </button>
                  </div>
                ))}
              </>
            )}
          </>
        )}
      </div>

      <div className="sidebar-footer">
        <span className="badge-dot-sm" />
        <span>Powered by NVIDIA NIM</span>
      </div>
    </aside>
  );
}