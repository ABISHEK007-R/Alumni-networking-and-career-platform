import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/client";
import "./Register.css";

const Register = () => {
  const [userType, setUserType] = useState("");
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    college: "",
    company: "",
    role: "",
    skills: "",
    experience: "",
    location: "",
    certifications: "",
    projects: "",
    mentorship: "Yes",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsSubmitting(true);

    try {
      await api.post("/auth/register", {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: userType.toUpperCase(),
        college: formData.college,
        company: formData.company,
        skills: formData.skills,
        location: formData.location,
        certifications: formData.certifications,
        projects: formData.projects,
      });
      setMessage("Registration successful. Redirecting to login...");
      window.setTimeout(() => navigate("/"), 900);
    } catch (requestError) {
      setError(requestError.response?.data?.message || "Unable to register. Check that the backend is running.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="auth-page register-page">
      <section className="auth-hero" aria-label="Alumni Connect AI community">
        <div className="auth-hero-glow auth-hero-glow-one" />
        <div className="auth-hero-glow auth-hero-glow-two" />
        <div className="auth-brand"><span className="auth-brand-mark">AC</span><span>Alumni Connect <b>AI</b></span></div>
        <div className="auth-hero-copy">
          <p className="auth-kicker">A network built around growth</p>
          <h1>Your people, your opportunities, your next chapter.</h1>
          <p>Join a community where students find direction and alumni create impact through meaningful professional connections.</p>
          <div className="auth-benefits"><span>Build meaningful connections</span><span>Share knowledge and opportunities</span><span>Grow with your community</span></div>
        </div>
        <div className="auth-network-card auth-network-card-main"><span className="network-pulse" /><strong>Community is growing</strong><small>New connections every day</small></div>
        <div className="auth-network-card auth-network-card-small"><span>↗</span><strong>Make an impact</strong><small>Share what you know</small></div>
        <div className="auth-network-lines" aria-hidden="true"><i /><i /><i /><i /></div>
      </section>

      <main className="auth-panel register-panel">
        <div className="auth-card register-card">
          <div className="auth-card-header">
            <p className="auth-kicker">Join the community</p>
            <h2>Create your account</h2>
            <p>Set up your profile and start building your professional network.</p>
          </div>

        {!userType && (
          <div className="role-selection">
            <h3>How will you use Alumni Connect AI?</h3>
            <p>Select the path that best describes you.</p>

            <button
              className="role-btn role-btn-student"
              onClick={() => setUserType("Student")}
            >
              <span className="role-icon">◎</span><span><strong>I'm a student</strong><small>Find mentors, internships, and direction</small></span><b>→</b>
            </button>

            <button
              className="role-btn role-btn-alumni"
              onClick={() => setUserType("Alumni")}
            >
              <span className="role-icon">✦</span><span><strong>I'm an alumni</strong><small>Share experience and support the next generation</small></span><b>→</b>
            </button>
          </div>
        )}

        {userType && (
          <form onSubmit={handleSubmit} className="register-form">

            {message && <p className="success-banner" role="status">{message}</p>}
            {error && <p className="error-banner" role="alert">{error}</p>}

            <div className="register-form-heading"><button type="button" className="change-role" onClick={() => setUserType("")}>← Change role</button><span className="selected-role">{userType}</span><h3>Create your {userType.toLowerCase()} profile</h3></div>

            <div className="form-grid">

              <div className="form-group">
                <label htmlFor="register-name">Full name</label>
                <input
                  id="register-name"
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                />
              </div>

              {userType === "Student" && (
                <div className="form-group">
                  <label htmlFor="register-college">College</label>
                  <input
                    id="register-college"
                    type="text"
                    name="college"
                    required
                    onChange={handleChange}
                  />
                </div>
              )}

              {userType === "Alumni" && (
                <>
                  <div className="form-group">
                    <label htmlFor="register-company">Company</label>
                    <input
                      id="register-company"
                      type="text"
                      name="company"
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-role">Role</label>
                    <input
                      id="register-role"
                      type="text"
                      name="role"
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label htmlFor="register-experience">Experience</label>
                    <input
                      id="register-experience"
                      type="text"
                      name="experience"
                      placeholder="3 Years"
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label htmlFor="register-skills">Skills</label>
                <input
                  id="register-skills"
                  type="text"
                  name="skills"
                  placeholder="Java, AWS, Cybersecurity"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-location">Location</label>
                <input
                  id="register-location"
                  type="text"
                  name="location"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-certifications">Certifications</label>
                <input
                  id="register-certifications"
                  type="text"
                  name="certifications"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-projects">Projects</label>
                <input
                  id="register-projects"
                  type="text"
                  name="projects"
                  onChange={handleChange}
                />
              </div>

              {userType === "Alumni" && (
                <div className="form-group">
                  <label htmlFor="register-mentorship">Mentorship availability</label>

                  <select
                    id="register-mentorship"
                    name="mentorship"
                    onChange={handleChange}
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label htmlFor="register-email">Email address</label>
                <input
                  id="register-email"
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="register-password">Password</label>
                <input
                  id="register-password"
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                />
              </div>

            </div>

            <button className="register-btn auth-submit">
              {isSubmitting ? "Creating account..." : "Register"}
            </button>
            <div className="auth-switch"><span>Already have an account?</span><button type="button" onClick={() => navigate("/")}>Sign in</button></div>

          </form>
        )}
      </div>
      <p className="auth-legal">By creating an account, you agree to our Terms of Service and Privacy Policy.</p>
      </main>
    </div>
    
  );
};

export default Register;