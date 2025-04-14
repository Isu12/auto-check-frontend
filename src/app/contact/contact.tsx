"use client"
import React from 'react';
import './ContactPage.css';
import { FaPhone, FaMapMarkerAlt, FaClock, FaInfoCircle } from 'react-icons/fa';

const ContactPage = () => {
  return (
    <div className="contact-page">
      <div className="contact-header">
        <h1>Department of Motor Traffic - Contact Us</h1>
        <p>Reach out to our offices during working hours</p>
      </div>

      <div className="contact-container">
        <div className="contact-info">
          {/* Narahenpita Branch */}
          <div className="contact-card">
            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Narahenpita Main Office</h3>
            <p>341 Elvitigala Mawatha, Colombo 00500</p>
            <div className="contact-hours">
              <h4><FaClock /> Working Hours:</h4>
              <p>Monday: 9:00 AM – 6:00 PM</p>
              <p>Tuesday - Friday: 9:00 AM – 3:00 PM</p>
              <p>Saturday - Sunday: Closed</p>
              <p className="note"><FaInfoCircle /> Hours may differ on public holidays</p>
            </div>
            <p><strong>Phone:</strong> <a href="tel:+94112033333">0112 033 333</a></p>
          </div>

          {/* Werahera Branch */}
          <div className="contact-card">
            <div className="contact-icon">
              <FaMapMarkerAlt />
            </div>
            <h3>Werahera Branch Office</h3>
            <p>Department of Motor Traffic Rd, Boralesgamuwa</p>
            <div className="contact-hours">
              <h4><FaClock /> Working Hours:</h4>
              <p>Monday - Friday: 9:00 AM – 4:00 PM</p>
              <p>Saturday - Sunday: Closed</p>
              <p className="note"><FaInfoCircle /> Hours may differ on public holidays</p>
            </div>
            <p><strong>Phone:</strong> <a href="tel:+94112518950">0112 518 950</a></p>
          </div>

          {/* General Information */}
          <div className="contact-card">
            <div className="contact-icon">
              <FaInfoCircle />
            </div>
            <h3>Important Notes</h3>
            <ul className="notes-list">
              <li>Closed on all public holidays</li>
              <li>Special holiday hours may apply during festive seasons</li>
              <li>Last token issued 30 minutes before closing</li>
              <li>Online services available 24/7 via <a href="https://www.motortraffic.gov.lk">www.motortraffic.gov.lk</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Maps Section */}
      <div className="maps-container">
        <div className="map-section">
          <h2>Narahenpita Main Office Location</h2>
          <div className="map-container">
            <iframe
              title="Narahenpita DMT Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3960.92324374057!2d79.8762023153286!3d6.902253595016711!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae2597b7c006ba5%3A0x89a5e9d0a8d5b3e4!2sDepartment%20of%20Motor%20Traffic!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
        </div>

        <div className="map-section">
          <h2>Werahera Branch Office Location</h2>
          <div className="map-container">
            <iframe
              title="Werahera DMT Location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3961.071111111111!2d79.9538889153284!3d6.843888895028889!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae251c7b7c006ba%3A0x89a5e9d0a8d5b3e4!2sDepartment%20of%20Motor%20Traffic%20Werahera!5e0!3m2!1sen!2slk!4v1620000000000!5m2!1sen!2slk"
              width="100%"
              height="400"
              style={{ border: 0 }}
              allowFullScreen={true}
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;