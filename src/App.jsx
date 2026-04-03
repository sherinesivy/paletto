import { useState, useEffect } from "react";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";
import PaletteGenerator from "./components/PaletteGenerator";
import { APP_THEMES, applyTheme } from "./themes";
import "./App.css";

const DEFAULT_THEME = APP_THEMES.find((t) => t.id === "blush-and-cream") || APP_THEMES[1];

export default function App() {
  const [activeTheme, setActiveTheme] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [appTheme, setAppTheme] = useState(DEFAULT_THEME);
  const [favourites, setFavourites] = useState(() => {
    try { return JSON.parse(localStorage.getItem("paletto-favs") || "[]"); }
    catch { return []; }
  });
  const [previewPalette, setPreviewPalette] = useState(null);

  useEffect(() => { applyTheme(appTheme.vars); }, [appTheme]);

  useEffect(() => {
    localStorage.setItem("paletto-favs", JSON.stringify(favourites));
  }, [favourites]);

  useEffect(() => {
    if (previewPalette) {
      const vars = {
        "--bg":         previewPalette.colors[0],
        "--bg-2":       previewPalette.colors[1],
        "--bg-3":       previewPalette.colors[2],
        "--border":     "rgba(255,255,255,0.12)",
        "--text":       "#f8f4f0",
        "--text-muted": "rgba(248,244,240,0.4)",
        "--text-dim":   "rgba(248,244,240,0.65)",
        "--accent":     previewPalette.colors[3],
        "--accent-dim": previewPalette.colors[3] + "28",
        "--accent-text":"#fff",
      };
      applyTheme(vars);
    } else {
      applyTheme(appTheme.vars);
    }
  }, [previewPalette, appTheme]);

  const toggleFavourite = (palette) => {
    setFavourites((prev) => {
      const exists = prev.some((f) => f.name === palette.name);
      if (exists) return prev.filter((f) => f.name !== palette.name);
      return [{ ...palette, savedAt: Date.now() }, ...prev];
    });
  };

  const isFavourite = (palette) => favourites.some((f) => f.name === palette.name);

  return (
    <div className="app-shell">
      <Sidebar
        activeTheme={activeTheme}
        setActiveTheme={setActiveTheme}
        isOpen={sidebarOpen}
        appTheme={appTheme}
        setAppTheme={(theme) => { setPreviewPalette(null); setAppTheme(theme); }}
        appThemes={APP_THEMES}
        favourites={favourites}
        toggleFavourite={toggleFavourite}
      />
      <div className={`main-area ${sidebarOpen ? "sidebar-open" : ""}`}>
        <Navbar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          appTheme={appTheme}
          favouriteCount={favourites.length}
        />
        <PaletteGenerator
          activeTheme={activeTheme}
          setActiveTheme={setActiveTheme}
          toggleFavourite={toggleFavourite}
          isFavourite={isFavourite}
          previewPalette={previewPalette}
          setPreviewPalette={setPreviewPalette}
        />
      </div>
    </div>
  );
}