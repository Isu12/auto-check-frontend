"use client";

import React, { useState, useEffect } from "react";

const images = [
  "/images/banner.jpg",
  "/images/jeep.jpg",
  "/images/BMW.jpg",
  "/images/CAT.jpg",
  "/images/Ducati.jpg",
  "/images/Hilux.jpg",
];

// Added background images for each feature card
const cardBackgrounds = [
  "/images/history.jpg",
  "/images/hilux2.jpg",
  "/images/mody.jpg",
  "/images/bike.jpg",
];

const features = [
  {
    title: "Vehicle History",
    description: "Get complete history reports including accidents, ownership, and more.",
  },
  {
    title: "Service Records",
    description: "Access detailed maintenance and service history for any vehicle.",
  },
  {
    title: "Modification Tracking",
    description: "See all aftermarket modifications and upgrades made to the vehicle.",
  },
  {
    title: "Insurance Claim History",
    description: "View all insurance claims made on the vehicle including accident details.",
  }
];

const SearchSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ width: "100%" }}>
      {/* Hero Section with Image Slideshow */}
      <div
        style={{
          position: "relative",
          width: "107.8%",
          height: "800px",
          backgroundImage: `linear-gradient(to right, rgba(0,0,0,0), rgba(0,0,0,0.3)), url(${images[currentImageIndex]})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          transition: "background-image 1s ease-in-out",
          left: "-100px",
          right: "-300px",
          marginTop: "-50px"
        }}
      >
        {/* Dark Overlay */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.5)",
          }}
        ></div>

        {/* Content */}
        <div
          style={{
            position: "relative",
            textAlign: "center",
            color: "white",
            zIndex: 1,
            padding: "20px",
          }}
        >
          <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>
            Find Your Perfect Vehicle
          </h1>
          <p
            style={{
              fontSize: "18px",
              lineHeight: "1.6",
              color: "white",
              margin: "10px 0",
              maxWidth: "800px",
            }}
          >
            Discover vehicle history, service records, repairs, and modifications to make an informed decision on your next purchase.
          </p>

          {/* Track Vehicle Button */}
          <div
            style={{
              marginTop: "30px",
              display: "flex",
              justifyContent: "center",
            }}
          >
            <button
              style={{
                backgroundColor: "#3f51b5",
                color: "white",
                border: "none",
                padding: "15px 40px",
                borderRadius: "30px",
                cursor: "pointer",
                fontSize: "18px",
                fontWeight: "bold",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
                transition: "transform 0.2s, background-color 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.backgroundColor = "#303f9f";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.backgroundColor = "#3f51b5";
              }}
            >
              Track Vehicle
            </button>
          </div>
        </div>
      </div>

      {/* Features Cards Section */}
      <div style={{
        padding: "60px 20px",
        backgroundColor: "#f8f9fa",
        marginTop: "-40px",
        width: "100%",
      }}>
        <div style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          display: "flex",
          flexDirection: "column",
          alignItems: "center"
        }}>
          {/* Centered Heading */}
          <h2 style={{
            fontSize: "40px",
            marginBottom: "10px",
            color: "#333",
            textAlign: "center",
          }}>
            Why Choose AutoCheck?
          </h2>

          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "30px",
            width: "100%"
          }}>
            {features.map((feature, index) => (
              <div key={index} style={{
                position: "relative",
                borderRadius: "12px",
                padding: "30px",
                boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)",
                transition: "transform 0.3s ease",
                textAlign: "center",
                transform: "translateY(-5px)",
                marginTop: "50px",
                height: "300px",
                overflow: "hidden",
                color: "white"
              }}>
                {/* Card Background Image with Dark Overlay */}
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundImage: `url(${cardBackgrounds[index]})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  zIndex: -2
                }}></div>
                <div style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  backgroundColor: "rgba(0, 0, 0, 0.7)",
                  zIndex: -1
                }}></div>

                <div style={{
                  fontSize: "50px",
                  marginBottom: "20px"
                }}>
                  
                </div>
                <h3 style={{
                  fontSize: "22px",
                  marginTop:"60px",
                  marginBottom: "15px",
                  color: "white"
                }}>
                  {feature.title}
                </h3>
                <p style={{
                  color: "rgba(255, 255, 255, 0.9)",
                  lineHeight: "1.6"
                }}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;