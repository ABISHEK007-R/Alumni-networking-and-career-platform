import { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../student/DashboardLayout";

const Referrals = () => {
  const [referrals, setReferrals] = useState([]);
  const [error, setError] = useState("");
  useEffect(() => { api.get("/referrals/me").then((response) => setReferrals(response.data || [])).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load referrals.")); }, []);
  return <DashboardLayout title="Referrals" eyebrow="Alumni workspace"><section className="page-intro directory-intro"><p className="section-kicker">Support</p><h2>Referrals</h2><p>Track referral requests and their progress.</p></section>{error && <div className="directory-alert error">{error}</div>}<div className="network-request-list">{referrals.length ? referrals.map((referral) => <article className="network-request-card" key={referral.id}><div className="network-request-body"><h3>{referral.studentName}</h3><p>{referral.opportunity || "Referral request"} · {referral.status}</p></div></article>) : <div className="directory-state">No referrals yet.</div>}</div></DashboardLayout>;
};
export default Referrals;
