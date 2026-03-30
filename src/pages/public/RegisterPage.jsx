import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppFooter from "../../components/layout/AppFooter.jsx";
import "./publicPages.css";

import { registerUser } from "../../services/authService";

const RegisterPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field) => (e) => {
    setForm((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    try {
      await registerUser(form);
      navigate("/login");
    } catch (err) {
      const message = err?.response?.data?.message || "Registration failed. Please try again.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="public-page auth-page">
      <section className="auth-card">
        <h1>Create your account</h1>
        <p>Get started with Titan Trades and access your trading workspace.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            type="text"
            placeholder="Jane Doe"
            value={form.name}
            onChange={handleChange("name")}
            required
          />

          <label htmlFor="register-email">Email</label>
          <input
            id="register-email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            required
          />

          <label htmlFor="register-password">Password</label>
          <input
            id="register-password"
            type="password"
            placeholder="Create password"
            value={form.password}
            onChange={handleChange("password")}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="primary-btn auth-submit" disabled={submitting}>
            {submitting ? "Creating Account..." : "Create Account"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </section>
      <AppFooter variant="public" />
    </main>
  );
};

export default RegisterPage;
