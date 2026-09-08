import React, { useState } from "react";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [goal, setGoal] = useState("");

  const alumni = [
    {
      name: "Arjun Kumar",
      role: "Cybersecurity Analyst",
      company: "TCS",
      match: "95%",
    },
    {
      name: "Priya Sharma",
      role: "Cloud Engineer",
      company: "Microsoft",
      match: "92%",
    },
    {
      name: "Rahul Singh",
      role: "Data Engineer",
      company: "Infosys",
      match: "89%",
    },
  ];

  const handleSearch = () => {
    if (!goal) {
      alert("Please enter your career goal");
      return;
    }

    alert(`Searching Alumni for: ${goal}`);
  };

  const handleConnect = (name) => {
    alert(`Connection request sent to ${name}`);
  };

  const handleApply = (company) => {
    alert(`Application submitted to ${company}`);
  };

  return (
    <div className="student-dashboard">
      {/* Header */}
      <div className="dashboard-header">
        <h1>Welcome Back Student 👋</h1>
        <p>AI Powered Alumni Career & Networking Platform</p>
      </div>

      {/* Career Goal */}
      <div className="career-section">
        <h2>Career Goal</h2>

        <div className="search-box">
          <input
            type="text"
            placeholder="I want to become a Cybersecurity Analyst"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
          />

          <button onClick={handleSearch}>
            Find Alumni
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <h2>42</h2>
          <p>Alumni Matches</p>
        </div>

        <div className="stat-card">
          <h2>18</h2>
          <p>Mentors</p>
        </div>

        <div className="stat-card">
          <h2>12</h2>
          <p>Internships</p>
        </div>

        <div className="stat-card">
          <h2>7</h2>
          <p>Referrals</p>
        </div>
      </div>

      {/* Alumni Section */}
      <div className="section">
        <h2>Recommended Alumni</h2>

        <div className="alumni-grid">
          {alumni.map((person, index) => (
            <div className="alumni-card" key={index}>
              <h3>{person.name}</h3>
              <p>{person.role}</p>
              <p>{person.company}</p>

              <div className="match-badge">
                {person.match} Match
              </div>

              <button
                className="connect-btn"
                onClick={() => handleConnect(person.name)}
              >
                Connect
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Internship Section */}
      <div className="section">
        <h2>Recommended Internships</h2>

        <div className="internship-grid">
          <div className="internship-card">
            <h3>Cyber Security Intern</h3>
            <p>TCS</p>

            <button
              onClick={() => handleApply("TCS")}
            >
              Apply
            </button>
          </div>

          <div className="internship-card">
            <h3>Cloud Engineer Intern</h3>
            <p>Microsoft</p>

            <button
              onClick={() => handleApply("Microsoft")}
            >
              Apply
            </button>
          </div>

          <div className="internship-card">
            <h3>Data Analyst Intern</h3>
            <p>Infosys</p>

            <button
              onClick={() => handleApply("Infosys")}
            >
              Apply
            </button>
          </div>
        </div>
      </div>

      {/* Career Path */}
      <div className="career-path">
        <h2>AI Career Path Recommendation</h2>

        <ul>
          <li>
            <strong>Current Skills:</strong> Linux, Networking
          </li>

          <li>
            <strong>Skill Gaps:</strong> SIEM, Threat Hunting
          </li>

          <li>
            <strong>Recommended Certifications:</strong>
            {" "}Security+, CEH, CHFI
          </li>

          <li>
            <strong>Suggested Projects:</strong>
            {" "}Home SOC Lab, Vulnerability Scanner
          </li>

          <li>
            <strong>Career Roadmap:</strong>
            {" "}SOC Analyst → Security Analyst →
            Cybersecurity Engineer
          </li>
        </ul>
      </div>
    </div>
  );
};

export default StudentDashboard;