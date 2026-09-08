import PlaceholderPage from "./student/PlaceholderPage";

const AlumniDashboard = () => (
  <PlaceholderPage
    title="Alumni Dashboard"
    eyebrow="Alumni workspace"
    description="Manage your alumni profile, mentor students, and share opportunities with the community."
    items={[
      ["Mentorship requests", "Review students looking for guidance.", "blue"],
      ["Share an opportunity", "Post an internship or referral for students.", "green"],
      ["Your network", "Reconnect with alumni from your college.", "orange"],
    ]}
  />
);

export default AlumniDashboard;
