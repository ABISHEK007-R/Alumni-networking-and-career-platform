import { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "../student/DashboardLayout";

const InternshipPosts = () => {
  const [posts, setPosts] = useState([]);
  const [form, setForm] = useState({ company: "", role: "", location: "", description: "", applyLink: "" });
  const [error, setError] = useState("");
  useEffect(() => { api.get("/internships").then((response) => setPosts(response.data || [])).catch((requestError) => setError(requestError.response?.data?.message || "Unable to load internship posts.")); }, []);
  const createPost = async (event) => { event.preventDefault(); try { const response = await api.post("/internships", form); setPosts((current) => [response.data, ...current]); setForm({ company: "", role: "", location: "", description: "", applyLink: "" }); } catch (requestError) { setError(requestError.response?.data?.message || "Unable to create internship post."); } };
  return <DashboardLayout title="Internship Posts" eyebrow="Alumni workspace"><section className="page-intro directory-intro"><p className="section-kicker">Opportunities</p><h2>Internship Posts</h2><p>Review and publish opportunities shared with the student community.</p></section>{error && <div className="directory-alert error">{error}</div>}<form className="profile-form" onSubmit={createPost}><div className="profile-grid">{Object.keys(form).map((field) => <label key={field}>{field}<input required={field !== "description" && field !== "applyLink"} value={form[field]} onChange={(event) => setForm((current) => ({ ...current, [field]: event.target.value }))} /></label>)}</div><button type="submit">Publish internship</button></form><div className="directory-grid">{posts.length ? posts.map((post) => <article className="directory-card" key={post.id}><div className="directory-card-header"><div className="directory-avatar">{(post.company || "I").slice(0, 2).toUpperCase()}</div><div><h3>{post.role}</h3><p>{post.company}</p></div></div><div className="directory-meta"><div><span className="directory-label">Location</span><strong>{post.location}</strong></div><div><span className="directory-label">Link</span><strong>{post.applyLink ? "Available" : "Not shared"}</strong></div></div></article>) : <div className="directory-state">No internship posts yet.</div>}</div></DashboardLayout>;
};
export default InternshipPosts;
