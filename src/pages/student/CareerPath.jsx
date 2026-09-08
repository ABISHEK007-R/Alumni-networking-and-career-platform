import { useEffect, useState } from "react";
import api from "../../api/client";
import DashboardLayout from "./DashboardLayout";

const CareerPath = () => {
  const [path, setPath] = useState({ currentSkills: [], recommendedSkills: [], nextStep: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadCareerPath = async () => {
      try {
        setLoading(true);
        const response = await api.get("/career-path");
        setPath(response.data || { currentSkills: [], recommendedSkills: [], nextStep: "" });
        setError("");
      } catch (requestError) {
        setError(requestError.response?.data?.message || "Unable to load your career path right now.");
      } finally {
        setLoading(false);
      }
    };

    loadCareerPath();
  }, []);

  return (
    <DashboardLayout title="Career Path" eyebrow="AI recommendation">
      <section className="page-intro directory-intro">
        <p className="section-kicker">AI recommendation</p>
        <h2>Career Path</h2>
        <p>Build a practical roadmap from your current skills to your target role.</p>
      </section>

      {error && <div className="directory-alert error">{error}</div>}

      {loading ? (
        <div className="directory-state">Loading your career path...</div>
      ) : (
        <div className="career-path" style={{ padding: "20px" }}>
          <div className="skill-group">
            <div className="skill-label"><span>Current skills</span><b>{path.currentSkills.length}</b></div>
            <div className="progress"><span className="progress-current" /></div>
            <div className="tag-list">
              {(path.currentSkills || []).map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          </div>

          <div className="skill-group">
            <div className="skill-label"><span>Recommended next skills</span><b>Next up</b></div>
            <div className="tag-list pale">
              {(path.recommendedSkills || []).map((skill) => <span key={skill}>{skill}</span>)}
            </div>
          </div>

          <div className="path-next">
            <span>↗</span>
            <div>
              <b>Recommended next step</b>
              <p>{path.nextStep || "Keep learning and build a project portfolio."}</p>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
};

export default CareerPath;
