import { NavLink, useNavigate } from "react-router-dom";
import "./StudentDashboard.css";

const navigationItems = [
  ["/student/dashboard", "▦", "Dashboard"],
  ["/alumni-network", "◎", "Alumni Network"],
  ["/mentors", "✦", "Mentors"],
  ["/internships", "▣", "Internships"],
  ["/career-path", "⌁", "Career Path"],
  ["/messages", "✉", "Messages"],
  ["/profile", "◉", "Profile"],
];

const DashboardLayout = ({ children, title = "Welcome back, Student", eyebrow = "Student workspace", searchTerm = "", onSearchChange }) => {
  const navigate = useNavigate();

  return (
    <div className="student-dashboard">
      <aside className="dashboard-sidebar">
        <div className="brand"><span className="brand-mark">AC</span><span>Alumni Connect <b>AI</b></span></div>
        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {navigationItems.map(([path, icon, label]) => (
            <NavLink className="nav-item" to={path} key={path} end={path === "/student/dashboard"}>
              <span>{icon}</span> {label}{label === "Messages" && <em>3</em>}
            </NavLink>
          ))}
        </nav>
        <button className="logout-button" onClick={() => { localStorage.removeItem("authToken"); localStorage.removeItem("alumniUser"); localStorage.removeItem("currentUser"); navigate("/", { replace: true }); }}><span>↪</span> Logout</button>
      </aside>
      <main className="dashboard-main">
        <header className="topbar">
          <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>
          <div className="topbar-actions"><label className="global-search"><span>⌕</span><input aria-label="Search dashboard" placeholder="Search anything..." value={searchTerm} onChange={onSearchChange || (() => {})} /></label><button className="icon-button" aria-label="View notifications">♢<i /></button><div className="profile-avatar">JS</div></div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
