import { useMemo, useState } from "react";
import DashboardLayout from "./DashboardLayout";

const alumni = [
  { name: "Arjun Kumar", role: "Cybersecurity Analyst", company: "TCS", match: 95, initials: "AK", color: "blue" },
  { name: "Priya Sharma", role: "Cloud Engineer", company: "Microsoft", match: 92, initials: "PS", color: "orange" },
  { name: "Rahul Singh", role: "Data Engineer", company: "Infosys", match: 89, initials: "RS", color: "green" },
];

const internships = [
  ["Cyber Security Intern", "TCS", "Remote"],
  ["Cloud Engineer Intern", "Microsoft", "Bengaluru"],
  ["Data Analyst Intern", "Infosys", "Pune"],
];

const StudentDashboard = () => {
  const [goal, setGoal] = useState("");
  const [activeGoal, setActiveGoal] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [notice, setNotice] = useState("");

  const visibleAlumni = useMemo(() => {
    const query = (searchTerm.trim() || activeGoal).toLowerCase();
    if (!query) return alumni;
    return alumni.filter((person) => `${person.name} ${person.role} ${person.company}`.toLowerCase().includes(query));
  }, [activeGoal, searchTerm]);

  const visibleInternships = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    if (!query) return internships;
    return internships.filter(([title, company, location]) => `${title} ${company} ${location}`.toLowerCase().includes(query));
  }, [searchTerm]);

  const handleSearch = () => {
    const nextGoal = goal.trim();
    setActiveGoal(nextGoal);
    setNotice(nextGoal ? `Showing alumni matches for ${nextGoal}.` : "Enter a career goal to find alumni matches.");
  };

  return (
    <DashboardLayout searchTerm={searchTerm} onSearchChange={(event) => setSearchTerm(event.target.value)}>
      <section className="career-section hero-panel"><div><p className="section-kicker">AI career companion</p><h2>Shape your next career move</h2><p>Tell us where you want to go and we will connect you with people who have already made the journey.</p></div><div className="search-box"><input type="text" placeholder="e.g. Cybersecurity Analyst" value={goal} onChange={(event) => setGoal(event.target.value)} onKeyDown={(event) => event.key === "Enter" && handleSearch()} /><button onClick={handleSearch}>Find Alumni <span>→</span></button></div></section>
      {notice && <p className="notice" role="status">{notice}</p>}

      <section className="stats-grid" aria-label="Your statistics">{[["42", "Alumni Matches", "+12%"], ["18", "Mentors", "+8%"], ["12", "Internships", "+24%"], ["7", "Referrals", "+3%"]].map(([value, label, change]) => <article className="stat-card" key={label}><div className="stat-icon">✦</div><div><strong>{value}</strong><p>{label}</p><small>{change} <span>this month</span></small></div></article>)}</section>

      <section className="content-section"><div className="section-heading"><div><p className="section-kicker">Your network</p><h2>Recommended Alumni</h2></div></div><div className="alumni-grid">{visibleAlumni.length ? visibleAlumni.map((person) => <article className="alumni-card" key={person.name}><div className={`person-avatar ${person.color}`}>{person.initials}</div><div className="person-info"><h3>{person.name}</h3><p>{person.role}</p><span>{person.company}</span></div><div className="match-score"><strong>{person.match}%</strong><span>match</span></div><button className="connect-btn" onClick={() => alert("Connection request sent")}>Connect</button></article>) : <p className="empty-state">No alumni match that search yet.</p>}</div></section>

      <div className="lower-grid"><section className="content-section"><div className="section-heading"><div><p className="section-kicker">Opportunities</p><h2>Recommended Internships</h2></div></div><div className="internship-grid">{visibleInternships.length ? visibleInternships.map(([title, company, location]) => <article className="internship-card" key={title}><div className="company-mark">{company.slice(0, 1)}</div><div><h3>{title}</h3><p>{company} <span>·</span> {location}</p></div><button onClick={() => alert("Application submitted")}>Apply</button></article>) : <p className="empty-state">No internships match that search yet.</p>}</div></section><section className="career-path"><div className="section-heading"><div><p className="section-kicker">AI recommendation</p><h2>Career Path</h2></div><span className="ai-badge">AI</span></div><div className="skill-group"><div className="skill-label"><span>Current skills</span><b>75%</b></div><div className="progress"><span className="progress-current" /></div><div className="tag-list"><span>Linux</span><span>Networking</span><span>Python</span></div></div><div className="skill-group"><div className="skill-label"><span>Skill gaps</span><b>Next up</b></div><div className="tag-list pale"><span>SIEM</span><span>Threat Hunting</span></div></div><div className="path-next"><span>↗</span><div><b>Recommended next step</b><p>Build a home SOC lab project</p></div></div></section></div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
