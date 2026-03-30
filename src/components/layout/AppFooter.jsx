import React from "react";
import "./appFooter.css";

const AppFooter = ({ variant = "dashboard" }) => {
  return (
    <footer className={`app-footer app-footer--${variant}`}>
      <div className="app-footer__inner">
        <div className="app-footer__brand">
          <p className="app-footer__eyebrow">Titan Trades</p>
          <h2>Built for traders who want a cleaner view of the market.</h2>
        </div>

        <div className="app-footer__contact">
          <p className="app-footer__title">Contact</p>
          <p>Pankaj Dey</p>
          <a href="tel:7439480223">7439480223</a>
          <a href="mailto:pankajdey.dev@gmail.com">pankajdey.dev@gmail.com</a>
        </div>

        <div className="app-footer__meta">
          <p className="app-footer__title">Platform</p>
          <p>Portfolio tracking</p>
          <p>Order monitoring</p>
          <p>Paper trading workspace</p>
        </div>
      </div>
    </footer>
  );
};

export default AppFooter;
