import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AppFooter from "../../components/layout/AppFooter.jsx";
import "./publicPages.css";

import { loginUser } from "../../services/authService";

const LoginPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
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
      await loginUser(form);
      navigate("/dashboard");
    } catch (err) {
      const message = err?.response?.data?.message || "Login failed. Please check your credentials.";
      setError(message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="public-page auth-page">
      <section className="auth-card">
        <h1>Welcome back</h1>
        <p>Login to continue to your Titan Trades dashboard.</p>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={handleChange("email")}
            required
          />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            placeholder="••••••••"
            value={form.password}
            onChange={handleChange("password")}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <button type="submit" className="primary-btn auth-submit" disabled={submitting}>
            {submitting ? "Signing In..." : "Sign In"}
          </button>
        </form>

        <p className="auth-footer">
          New here? <Link to="/register">Create an account</Link>
        </p>
      </section>
      <AppFooter variant="public" />
    </main>
  );
};

export default LoginPage;
