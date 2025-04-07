import React from "react";
import Link from "next/link";
import { Facebook, Twitter, Instagram, Linkedin } from "lucide-react";
import styles from "./footer.module.css";

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        {/* Logo Section */}
        <div className={styles.logoContainer}>
          <p className={styles.tagline}>Track the complete history of your vehicle, including service, repair, accident, and echo test records, to ensure its reliability and safety.</p>
        </div>

        {/* Navigation Links */}
        <nav className={styles.linksContainer}>
          <ul className={styles.linksList}>
            <li><Link href="/" className={styles.link}>Home</Link></li>
            <li><Link href="/about" className={styles.link}>About Us</Link></li>
            <li><Link href="/contact" className={styles.link}>Contact</Link></li>
            <li><Link href="/services" className={styles.link}>Services</Link></li>
          </ul>
        </nav>

        {/* Social Media Icons */}
        <div className={styles.socialContainer}>
          <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className={styles.socialIcon}>
            <Facebook size={24} />
          </a>
          <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className={styles.socialIcon}>
            <Twitter size={24} />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className={styles.socialIcon}>
            <Instagram size={24} />
          </a>
          <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className={styles.socialIcon}>
            <Linkedin size={24} />
          </a>
        </div>
      </div>

      {/* Footer Bottom */}
      <div className={styles.footerBottom}>
        <p>&copy; 2025 WE_IT_05. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
