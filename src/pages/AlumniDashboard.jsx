import { useEffect, useState } from "react";
import api from "../api/client";
import useAuthUser from "../hooks/useAuthUser";
import useDashboardData from "../hooks/useDashboardData";
import DashboardLayout from "./student/DashboardLayout";

const AlumniDashboard = () => {
  const { user } = useAuthUser();
  const { summary, loading: summaryLoading, error: summaryError } = useDashboardData();
  const [connections, setConnections] = useState([]);

  useEffect(() => {
    api.get("/connections/me").then((response) => setConnections(response.data || [])).catch(() => setConnections([]));
  }, []);

  return (
    <DashboardLayout title={user?.name ? `Welcome back, ${user.name}` : "Welcome back"} eyebrow="Alumni workspace">
      <section className="page-intro directory-intro"><p className="section-kicker">Alumni workspace</p><h2>Community activity</h2><p>Manage your network and share opportunities with the community.</p></section>
      {summaryError && <div className="directory-alert error">{summaryError}</div>}
      {summaryLoading ? <div className="directory-state">Loading your dashboard...</div> : <>
        <section className="stats-grid" aria-label="Alumni statistics">
          {[[summary.alumniCount, "Students in directory"], [summary.mentorCount, "Mentors"], [summary.internshipCount, "Internships"], [summary.referralCount, "Referrals"]].map(([value, label]) => <article className="stat-card" key={label}><div className="stat-icon">✦</div><div><strong>{value || 0}</strong><p>{label}</p></div></article>)}
        </section>
        <section className="content-section"><div className="section-heading"><div><p className="section-kicker">Recent activity</p><h2>Connection activity</h2></div></div>{connections.length === 0 ? <div className="directory-state">No connection activity yet.</div> : <div className="network-request-list">{connections.slice(0, 5).map((connection) => <article className="network-request-card" key={connection.id}><div className="network-request-body"><h3>{connection.senderName} and {connection.receiverName}</h3><p>Status: {connection.status}</p></div></article>)}</div>}</section>
      </>}
    </DashboardLayout>
  );
};

export default AlumniDashboard;
