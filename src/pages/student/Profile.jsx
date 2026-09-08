import { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "./DashboardLayout";

const emptyProfile = { name: "", email: "", college: "", company: "", skills: "", location: "", certifications: "", projects: "", role: "" };

const Profile = () => {
	const [profile, setProfile] = useState(emptyProfile);
	const [loading, setLoading] = useState(true);
	const [saving, setSaving] = useState(false);
	const [message, setMessage] = useState("");
	const [error, setError] = useState("");

	useEffect(() => {
		const loadProfile = async () => {
			try {
				const response = await api.get("/users/me");
				setProfile({ ...emptyProfile, ...response.data });
			} catch (requestError) {
				setError(requestError.response?.data?.message || "Unable to load your profile.");
			} finally {
				setLoading(false);
			}
		};

		loadProfile();
	}, []);

	const handleChange = (event) => setProfile((current) => ({ ...current, [event.target.name]: event.target.value }));

	const saveProfile = async (event) => {
		event.preventDefault();
		setSaving(true);
		setMessage("");
		setError("");
		try {
			const response = await api.put("/users/me", profile);
			setProfile({ ...emptyProfile, ...response.data });
			const updatedUser = { ...JSON.parse(localStorage.getItem("currentUser") || "{}"), ...response.data };
			localStorage.setItem("currentUser", JSON.stringify(updatedUser));
			localStorage.setItem("alumniUser", JSON.stringify(updatedUser));
			setMessage("Profile saved successfully.");
		} catch (requestError) {
			setError(requestError.response?.data?.message || "Unable to save your profile.");
		} finally {
			setSaving(false);
		}
	};

	return (
		<DashboardLayout title="Profile" eyebrow="Your profile">
			<section className="page-intro directory-intro"><p className="section-kicker">Your profile</p><h2>Profile</h2><p>Keep your profile current so recommendations stay relevant.</p></section>
			{loading ? <div className="directory-state">Loading your profile...</div> : <form className="profile-form" onSubmit={saveProfile}>
				{message && <div className="directory-alert success">{message}</div>}
				{error && <div className="directory-alert error">{error}</div>}
				<div className="profile-grid">{[["name", "Name"], ["email", "Email"], ["college", "College"], ["company", "Company"], ["skills", "Skills"], ["location", "Location"], ["certifications", "Certifications"], ["projects", "Projects"]].map(([name, label]) => <label key={name}>{label}<input name={name} value={profile[name] || ""} onChange={handleChange} disabled={name === "email"} /></label>)}</div>
				<button type="submit" disabled={saving}>{saving ? "Saving..." : "Save changes"}</button>
			</form>}
		</DashboardLayout>
	);
};

export default Profile;
