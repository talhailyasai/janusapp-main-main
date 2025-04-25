import React from "react";
import { Link } from "react-router-dom";

const LandingFooter = () => {
  return (
    <>
      <hr></hr>
      <div className="landing-footer">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Produkt</h3>
            <ul>
              <Link to="/features" target="_blank">
                Funktioner
              </Link>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Resurser</h3>
            <ul>
              <li>
                <Link to="/blogs" target="_blank">
                  Blog
                </Link>
              </li>
              <li>
                FAQ{" "}
                <span className="material-symbols-outlined lock-icon">
                  lock
                </span>
              </li>
              <li>
                Support{" "}
                <span className="material-symbols-outlined lock-icon">
                  lock
                </span>
              </li>
            </ul>
          </div>

          <div className="footer-section">
            <h3>Företag</h3>
            <ul>
              <li>
                <Link to="/about" target="_blank">
                  Om
                </Link>
              </li>
              <li>
                <Link to="/affiliate" target="_blank">
                  Affiliate/Partner
                </Link>
              </li>
              <li>
                <Link to="/security" target="_blank">
                  Förtroende/Säkerhet
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <p className="copyright-content">ⓒ BalancePoint AB 2025</p>
      <div className="footer-banner">
        <div className="banner-links">
          <Link to="/privacy-policy" target="_blank">
            Integritetspolicy
          </Link>
          <Link to="/terms" target="_blank">
            Användarvillkor
          </Link>
          <Link to="/cookie-policy" target="_blank">
            Cookiepolicy
          </Link>
        </div>
      </div>
    </>
  );
};

export default LandingFooter;
