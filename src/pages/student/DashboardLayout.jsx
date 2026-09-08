import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import { clearAuthStorage } from "../../auth/storage";
import useAuthUser from "../../hooks/useAuthUser";
import "./StudentDashboard.css";

const studentNavigationItems = [
  ["/dashboard", "▦", "Dashboard"],
  ["/alumni-directory", "◎", "Alumni Directory"],
  ["/network", "◎", "Alumni Network"],
  ["/mentors", "✦", "Mentors"],
  ["/internships", "▣", "Internships"],
  ["/career-path", "⌁", "Career Path"],
  ["/messages", "✉", "Messages"],
  ["/profile", "◉", "Profile"],
];

const alumniNavigationItems = [
  ["/alumni/dashboard", "▦", "Dashboard"],
  ["/student-network", "◎", "Student Network"],
  ["/mentorship-requests", "✦", "Mentorship Requests"],
  ["/internship-posts", "▣", "Internship Posts"],
  ["/referrals", "↗", "Referrals"],
  ["/messages", "✉", "Messages"],
  ["/profile", "◉", "Profile"],
];

const DashboardLayout = ({ children, title = "Dashboard", eyebrow = "Workspace", searchTerm = "", onSearchChange }) => {
  const navigate = useNavigate();
  const { user } = useAuthUser();
  const [profileMenuOpen, setProfileMenuOpen] = useState(false);
  const isAlumni = user?.role === "ALUMNI";
  const navigationItems = isAlumni ? alumniNavigationItems : studentNavigationItems;
  const dashboardPath = isAlumni ? "/alumni/dashboard" : "/dashboard";
  const initials = (user?.name || "--")
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const handleLogout = () => {
    clearAuthStorage();
    navigate("/login", { replace: true, state: { message: "Logged out successfully" } });
  };

  return (
    <div className="student-dashboard">
      <aside className="dashboard-sidebar">
        <div className="brand"><span className="brand-mark">AC</span><span>Alumni Connect <b>AI</b></span></div>
        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {navigationItems.map(([path, icon, label]) => {
            const targetPath = label === "Dashboard" ? dashboardPath : path;
            return <NavLink className="nav-item" to={targetPath} key={label} end={targetPath === dashboardPath}>
              <span>{icon}</span> {label}
            </NavLink>;
          })}
        </nav>
      </aside>
      <main className="dashboard-main">
        <header className="topbar">
          <div><p className="eyebrow">{eyebrow}</p><h1>{title}</h1></div>
          <div className="topbar-actions"><label className="global-search"><span>⌕</span><input aria-label="Search dashboard" placeholder="Search anything..." value={searchTerm} onChange={onSearchChange || (() => {})} /></label><button className="icon-button" aria-label="View notifications">♢<i /></button><div className="profile-menu"><button className="profile-trigger" type="button" aria-expanded={profileMenuOpen} aria-haspopup="menu" onClick={() => setProfileMenuOpen((open) => !open)}><span className="profile-name">{user?.name || "Loading profile"}</span><span className="profile-avatar" aria-hidden="true">{initials}</span></button>{profileMenuOpen && <div className="profile-dropdown" role="menu"><button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); navigate("/profile"); }}>My Profile</button><button type="button" role="menuitem" onClick={() => { setProfileMenuOpen(false); navigate("/profile"); }}>Settings</button><button type="button" role="menuitem" onClick={handleLogout}>Logout</button></div>}</div></div>
        </header>
        {children}
      </main>
    </div>
  );
};

export default DashboardLayout;
