import React, { useState } from "react";
import "./Register.css";

const Register = () => {
  const [userType, setUserType] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log({
      userType,
      ...formData,
    });

    alert("Registration Successful!");
  };

  return (
    <div className="register-container">
      <div className="register-card">

        <div className="register-header">
          <h1>Alumni Connect AI</h1>
          <p>AI Powered Alumni Career & Networking Platform</p>
        </div>

        {!userType && (
          <div className="role-selection">
            <h2>Register As</h2>

            <button
              className="role-btn"
              onClick={() => setUserType("Student")}
            >
              Student
            </button>

            <button
              className="role-btn"
              onClick={() => setUserType("Alumni")}
            >
              Alumni
            </button>
          </div>
        )}

        {userType && (
          <form onSubmit={handleSubmit} className="register-form">

            <h2>{userType} Registration</h2>

            <div className="form-grid">

              <div className="form-group">
                <label>Name</label>
                <input
                  type="text"
                  name="name"
                  required
                  onChange={handleChange}
                />
              </div>

              {userType === "Student" && (
                <div className="form-group">
                  <label>College</label>
                  <input
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
                    <label>Company</label>
                    <input
                      type="text"
                      name="company"
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Role</label>
                    <input
                      type="text"
                      name="role"
                      required
                      onChange={handleChange}
                    />
                  </div>

                  <div className="form-group">
                    <label>Experience</label>
                    <input
                      type="text"
                      name="experience"
                      placeholder="3 Years"
                      onChange={handleChange}
                    />
                  </div>
                </>
              )}

              <div className="form-group">
                <label>Skills</label>
                <input
                  type="text"
                  name="skills"
                  placeholder="Java, AWS, Cybersecurity"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Location</label>
                <input
                  type="text"
                  name="location"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Certifications</label>
                <input
                  type="text"
                  name="certifications"
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Projects</label>
                <input
                  type="text"
                  name="projects"
                  onChange={handleChange}
                />
              </div>

              {userType === "Alumni" && (
                <div className="form-group">
                  <label>Mentorship Availability</label>

                  <select
                    name="mentorship"
                    onChange={handleChange}
                  >
                    <option>Yes</option>
                    <option>No</option>
                  </select>
                </div>
              )}

              <div className="form-group">
                <label>Email</label>
                <input
                  type="email"
                  name="email"
                  required
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  required
                  onChange={handleChange}
                />
              </div>

            </div>

            <button className="register-btn">
              Register
            </button>

            <button
              type="button"
              className="back-btn"
              onClick={() => setUserType("")}
            >
              Back
            </button>

          </form>
        )}
      </div>
    </div>
  );
};

export default Register;