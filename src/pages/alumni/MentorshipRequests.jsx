import { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../student/DashboardLayout";

const MentorshipRequests = () => {
  const [requests, setRequests] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("currentUser") || "null");
    console.log("Current user:", user);
    api.get("/mentorship-requests/incoming")
      .then((response) => {
        console.log("Mentorship requests response:", response.data);
        setRequests(response.data || []);
      })
      .catch((requestError) => {
        console.error("Mentorship requests error:", {
          url: requestError.config?.baseURL && requestError.config?.url
            ? `${requestError.config.baseURL}${requestError.config.url}`
            : requestError.config?.url,
          status: requestError.response?.status,
          response: requestError.response?.data,
          message: requestError.message,
        });
        setError(requestError.response?.data?.message || "Unable to load mentorship requests.");
      });
  }, []);
  const update = async (id, action) => {
    try {
      const response = await api.put(`/mentorship-requests/${id}/${action}`);
      const acceptedRequestId = response.data?.id ?? id;
      console.log("Mentorship request status update response:", response.data);
      setRequests((prev) => {
        console.log("Requests before filter", prev);
        console.log("Accepted ID", acceptedRequestId);
        const filteredRequests = prev.filter((request) => request?.id !== acceptedRequestId);
        console.log("Requests after filter", filteredRequests);
        return filteredRequests;
      });
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to update request.");
    }
  };
  return <DashboardLayout title="Mentorship Requests" eyebrow="Alumni workspace"><section className="page-intro directory-intro"><p className="section-kicker">Guidance</p><h2>Mentorship Requests</h2><p>Review students asking for your experience and support.</p></section>{error && <div className="directory-alert error">{error}</div>}<div className="network-request-list">{requests.length ? requests.map((request) => <article className="network-request-card" key={request.id}><div className="network-request-body"><h3>{request.studentName}</h3><p>{request.message || "Requested mentorship."}</p></div><div className="network-request-actions"><button className="network-accept" onClick={() => update(request.id, "accept")}>Accept</button><button className="network-reject" onClick={() => update(request.id, "reject")}>Reject</button></div></article>) : <div className="directory-state">No mentorship requests.</div>}</div></DashboardLayout>;
};
export default MentorshipRequests;
