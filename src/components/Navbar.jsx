import "./Navbar.css";

export default function Navbar({ sidebarOpen, setSidebarOpen, appTheme, favouriteCount }) {
  return (
    <nav className="navbar">
      <div className="navbar-left">
        <button className="nav-icon-btn" onClick={() => setSidebarOpen((p) => !p)}>
          <span className={`hamburger ${sidebarOpen ? "open" : ""}`}>
            <span /><span /><span />
          </span>
        </button>
        <span className="nav-page-title">Generate</span>
      </div>
      <div className="navbar-right">
        <div className="nav-badge"><span className="badge-dot" />NVIDIA NIM</div>
        {favouriteCount > 0 && (
          <div className="nav-fav-count">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="var(--accent)" stroke="var(--accent)" strokeWidth="1.5">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
            {favouriteCount}
          </div>
        )}
        <div className="nav-theme-indicator">{appTheme?.emoji} <span>{appTheme?.name}</span></div>
      </div>
    </nav>
  );
}