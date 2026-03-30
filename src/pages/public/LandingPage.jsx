import React from "react";
import { Link } from "react-router-dom";
import AppFooter from "../../components/layout/AppFooter.jsx";
import "./publicPages.css";

const features = [
  "Live holdings and positions synced with backend data",
  "Fast trade snapshots with P&L visibility",
  "Clean portfolio views for smarter decision-making",
];

const LandingPage = () => {
  return (
    <main className="public-page landing-page">
      <section className="hero-card">
        <p className="badge">Titan Trades Dashboard</p>
        <h1>Trade smarter with Titan Trades built for clarity and speed.</h1>
        <p className="hero-copy">
          Track holdings, monitor positions, and review key metrics in one modern
          workspace. Designed for active traders who want a crisp, focused view
          of market activity.
        </p>

        <div className="hero-actions">
          <Link className="primary-btn" to="/login">
            Login
          </Link>
          <Link className="secondary-btn" to="/register">
            Register
          </Link>
        </div>

        <div className="feature-grid">
          {features.map((feature) => (
            <div key={feature} className="feature-card">
              {feature}
            </div>
          ))}
        </div>
      </section>
      <AppFooter variant="public" />
    </main>
  );
};

export default LandingPage;
