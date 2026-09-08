import DashboardLayout from "./DashboardLayout";

const PlaceholderPage = ({ title, eyebrow, description, items }) => (
  <DashboardLayout title={title} eyebrow={eyebrow}>
    <section className="page-intro">
      <p className="section-kicker">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{description}</p>
    </section>
    <section className="placeholder-grid">
      {items.map(([heading, detail, tone]) => (
        <article className={`placeholder-card ${tone}`} key={heading}>
          <span className="placeholder-icon">✦</span>
          <div><h3>{heading}</h3><p>{detail}</p></div>
        </article>
      ))}
    </section>
  </DashboardLayout>
);

export default PlaceholderPage;
