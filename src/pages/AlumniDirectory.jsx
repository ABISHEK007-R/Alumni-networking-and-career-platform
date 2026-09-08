import { useEffect, useMemo, useState } from "react";
import api from "../api/client";
import DashboardLayout from "./student/DashboardLayout";
import "./AlumniDirectory.css";

const readStoredUser = () => {
  try {
    const raw = localStorage.getItem("currentUser") || localStorage.getItem("alumniUser");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const AlumniDirectory = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [connectionState, setConnectionState] = useState({});

  const currentUser = readStoredUser();

  const loadUsers = async () => {
    try {
      setLoading(true);
      setError("");

      const [usersResponse, connectionsResponse] = await Promise.all([
        api.get("/alumni"),
        api.get("/connections/me"),
      ]);

      setUsers(usersResponse.data || []);
      const nextStatuses = {};
      (connectionsResponse.data || []).forEach((connection) => {
        const otherUserId = String(connection.senderId) === String(currentUser?.id)
          ? connection.receiverId
          : connection.senderId;
        if (otherUserId) {
          nextStatuses[otherUserId] = connection.status;
        }
      });
      setConnectionState(nextStatuses);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to load the alumni directory right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = async (user) => {
    try {
      const response = await api.post(`/connections/request/${user.id}`);

      setConnectionState((prev) => ({ ...prev, [user.id || user.email]: response.data?.status || "PENDING" }));
    } catch (requestError) {
      const message = requestError.response?.data?.message || "Connection request could not be sent.";
      setError(message);
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const visibleUsers = currentUser ? users.filter((user) => String(user.id) !== String(currentUser.id)) : users;

    if (!query) return visibleUsers;

    return visibleUsers.filter((user) => {
      const searchable = [
        user.name,
        user.skills,
        user.college,
        user.location,
        user.role,
        user.company,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return searchable.includes(query);
    });
  }, [currentUser, searchTerm, users]);

  const renderSkillTags = (skills) => {
    if (!skills) {
      return <span className="directory-skill-tag empty">No skills listed</span>;
    }

    return skills
      .split(",")
      .map((skill) => skill.trim())
      .filter(Boolean)
      .slice(0, 4)
      .map((skill, index) => (
        <span className="directory-skill-tag" key={`${skill}-${index}`}>
          {skill}
        </span>
      ));
  };

  return (
    <DashboardLayout searchTerm={searchTerm} onSearchChange={(event) => setSearchTerm(event.target.value)}>
      <section className="page-intro directory-intro">
        <p className="section-kicker">Network</p>
        <h2>Alumni Directory</h2>
        <p>Discover graduates, mentors, and professionals from your community who can help you grow.</p>
      </section>

      <div className="directory-toolbar">
        <label className="directory-search" aria-label="Search alumni">
          <span>⌕</span>
          <input
            type="text"
            placeholder="Search by name, skills, or college"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />
        </label>

        <button type="button" className="directory-refresh-button" onClick={loadUsers}>
          Refresh
        </button>
      </div>

      {error && <div className="directory-alert error">{error}</div>}

      {loading ? (
        <div className="directory-state">Loading alumni profiles...</div>
      ) : filteredUsers.length === 0 ? (
        <div className="directory-state">No alumni match your current search.</div>
      ) : (
        <div className="directory-grid">
          {filteredUsers.map((user) => {
            const key = user.id || user.email;
            const initials = (user.name || "A")
              .split(" ")
              .map((part) => part[0])
              .join("")
              .slice(0, 2)
              .toUpperCase();

            const roleText = user.role || "Member";
            const status = connectionState[key];

            return (
              <article className="directory-card" key={key}>
                <div className="directory-card-header">
                  <div className="directory-avatar">{initials}</div>
                  <div>
                    <h3>{user.name}</h3>
                    <p>{roleText}</p>
                  </div>
                </div>

                <div className="directory-meta">
                  <div>
                    <span className="directory-label">College</span>
                    <strong>{user.college || "Not shared"}</strong>
                  </div>
                  <div>
                    <span className="directory-label">Location</span>
                    <strong>{user.location || "Not shared"}</strong>
                  </div>
                </div>

                <div className="directory-skill-list">{renderSkillTags(user.skills)}</div>

                <div className="directory-footer">
                  <span>{user.company || "Career profile"}</span>
                  <button
                    type="button"
                    className={status ? "directory-connect-button is-requested" : "directory-connect-button"}
                    onClick={() => handleConnect(user)}
                    disabled={status === "PENDING" || status === "ACCEPTED"}
                  >
                    {status === "PENDING" ? "Requested" : status === "ACCEPTED" ? "Connected" : "Connect"}
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </DashboardLayout>
  );
};

export default AlumniDirectory;
