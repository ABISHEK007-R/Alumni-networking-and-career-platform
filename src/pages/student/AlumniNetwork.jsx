import { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "./DashboardLayout";
import "./AlumniNetwork.css";

const AlumniNetwork = () => {
  const [outgoingRequests, setOutgoingRequests] = useState([]);
  const [acceptedConnections, setAcceptedConnections] = useState([]);
  const [suggestedAlumni, setSuggestedAlumni] = useState([]);
  const [connectionState, setConnectionState] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError("");
      const [outgoingResponse, acceptedResponse, alumniResponse] = await Promise.all([
        api.get("/connections/outgoing"),
        api.get("/connections/accepted"),
        api.get("/alumni"),
      ]);
      console.log("[AlumniNetwork] GET /connections/outgoing response", outgoingResponse.status, outgoingResponse.data);
      console.log("[AlumniNetwork] GET /connections/accepted response", acceptedResponse.status, acceptedResponse.data);
      console.log("[AlumniNetwork] GET /alumni response", alumniResponse.status, alumniResponse.data);
      const outgoing = (outgoingResponse.data || []).filter((connection) => connection.status !== "ACCEPTED");
      const accepted = acceptedResponse.data || [];
      setOutgoingRequests(outgoing);
      setAcceptedConnections(accepted);
      const statuses = {};
      [...outgoing, ...accepted].forEach((connection) => {
        statuses[connection.senderId] = connection.status;
        statuses[connection.receiverId] = connection.status;
      });
      setConnectionState(statuses);
      const currentUser = JSON.parse(localStorage.getItem("currentUser") || "{}");
      const relatedIds = new Set(Object.keys(statuses).map(String));
      setSuggestedAlumni((alumniResponse.data || [])
        .filter((alumnus) => String(alumnus.id) !== String(currentUser.id) && !relatedIds.has(String(alumnus.id)))
        .slice(0, 4));
    } catch (requestError) {
      console.error("[AlumniNetwork] Failed to load connection data", {
        url: requestError.config?.baseURL && requestError.config?.url
          ? `${requestError.config.baseURL}${requestError.config.url}`
          : requestError.config?.url,
        status: requestError.response?.status,
        response: requestError.response?.data,
        message: requestError.message,
        error: requestError,
      });
      setOutgoingRequests([]);
      setAcceptedConnections([]);
      setSuggestedAlumni([]);
      setError(requestError.response?.data?.message || "Unable to load connection requests right now.");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestAction = async (connectionId, action) => {
    try {
      const response = await api.put(`/connections/${connectionId}/${action}`);
      console.log(`[AlumniNetwork] PUT /connections/${connectionId}/${action} response`, response.status, response.data);
      await loadRequests();
    } catch (requestError) {
      console.error(`[AlumniNetwork] Failed to ${action} connection ${connectionId}`, {
        url: requestError.config?.baseURL && requestError.config?.url
          ? `${requestError.config.baseURL}${requestError.config.url}`
          : requestError.config?.url,
        status: requestError.response?.status,
        response: requestError.response?.data,
        message: requestError.message,
        error: requestError,
      });
      setError(requestError.response?.data?.message || "Unable to update the request.");
    }
  };

  const handleSuggestedConnect = async (alumnus) => {
    try {
      const response = await api.post(`/connections/request/${alumnus.id}`);
      console.log(`[AlumniNetwork] POST /connections/request/${alumnus.id} response`, response.status, response.data);
      setConnectionState((current) => ({ ...current, [alumnus.id]: response.data?.status || "PENDING" }));
    } catch (requestError) {
      console.error(`[AlumniNetwork] Failed to send connection request to ${alumnus.id}`, {
        url: requestError.config?.baseURL && requestError.config?.url
          ? `${requestError.config.baseURL}${requestError.config.url}`
          : requestError.config?.url,
        status: requestError.response?.status,
        response: requestError.response?.data,
        message: requestError.message,
        error: requestError,
      });
      setError(requestError.response?.data?.message || "Connection request could not be sent.");
    }
  };

  const renderConnectionCard = (connection, type) => {
    const otherName = connection.receiverName;
    const description = type === "outgoing"
        ? `Request sent to ${connection.receiverName}.`
        : `You are connected with ${otherName}.`;

    return (
      <article className="network-request-card" key={connection.id}>
        <div className="network-request-avatar">{(otherName || "A").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div>
        <div className="network-request-body">
          <div className="network-request-header"><h3>{otherName || "Unknown contact"}</h3><span className={`request-status ${String(connection.status).toLowerCase()}`}>{connection.status}</span></div>
          <p>{description}</p>
        </div>
        <div className="network-request-meta"><span>{connection.receiverCompany || "Company not shared"}</span><span>{connection.receiverSkills || "Skills not shared"}</span></div>
      </article>
    );
  };

  useEffect(() => {
    loadRequests();
  }, []);

  return (
    <DashboardLayout title="Your network" eyebrow="Alumni network">
      <section className="page-intro directory-intro">
        <p className="section-kicker">Network</p>
        <h2>Connection Requests</h2>
        <p>Track incoming connections, accepted introductions, and pending outreach from your professional circle.</p>
      </section>

      {error && <div className="directory-alert error">{error}</div>}

      {loading ? (
        <div className="directory-state">Loading your requests...</div>
      ) : outgoingRequests.length === 0 && acceptedConnections.length === 0 ? (
        <div className="directory-state">No connections yet</div>
      ) : (
        <>
          {outgoingRequests.length > 0 && <section className="network-section"><div className="section-heading"><h2>Sent requests</h2></div><div className="network-request-list">{outgoingRequests.map((connection) => renderConnectionCard(connection, "outgoing"))}</div></section>}
          {acceptedConnections.length > 0 && <section className="network-section"><div className="section-heading"><h2>Connected alumni</h2></div><div className="network-request-list">{acceptedConnections.map((connection) => renderConnectionCard(connection, "accepted"))}</div></section>}
        </>
      )}

      <section className="content-section">
        <div className="section-heading"><div><p className="section-kicker">Grow your network</p><h2>Suggested Alumni</h2></div></div>
        {suggestedAlumni.length === 0 ? <div className="directory-state">No suggested alumni available.</div> : <div className="directory-grid">
          {suggestedAlumni.map((alumnus) => <article className="directory-card" key={alumnus.id}>
            <div className="directory-card-header"><div className="directory-avatar">{(alumnus.name || "A").split(" ").map((part) => part[0]).join("").slice(0, 2).toUpperCase()}</div><div><h3>{alumnus.name}</h3><p>{alumnus.role || "Alumni"}</p></div></div>
            <div className="directory-meta"><div><span className="directory-label">Company</span><strong>{alumnus.company || "Not shared"}</strong></div><div><span className="directory-label">Location</span><strong>{alumnus.location || "Not shared"}</strong></div></div>
            <div className="directory-footer"><span>{alumnus.skills || "Skills not listed"}</span><button type="button" disabled={connectionState[alumnus.id] === "PENDING" || connectionState[alumnus.id] === "ACCEPTED"} onClick={() => handleSuggestedConnect(alumnus)}>{connectionState[alumnus.id] === "PENDING" ? "Requested" : connectionState[alumnus.id] === "ACCEPTED" ? "Connected" : "Connect"}</button></div>
          </article>)}
        </div>}
      </section>
    </DashboardLayout>
  );
};

export default AlumniNetwork;
