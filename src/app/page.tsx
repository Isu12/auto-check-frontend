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

const SearchSection = () => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000); // Change image every 5 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      style={{
        position: "relative",
        width: "108.5%",
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

        {/* Search Bar */}
        <div
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "center",
            width: "100%",
            maxWidth: "1000px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              backgroundColor: "white",
              borderRadius: "20px",
              padding: "5px 10px",
              width: "100%",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)",
            }}
          >
            <input
              type="text"
              placeholder="Search for a vehicle..."
              style={{
                flex: 1,
                border: "none",
                outline: "none",
                padding: "10px",
                borderRadius: "20px",
                fontSize: "16px",
              }}
            />
            <button
              style={{
                backgroundColor: "#3f51b5",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "20px",
                cursor: "pointer",
                marginLeft: "10px",
                fontSize: "16px",
                fontWeight: "bold",
              }}
            >
              Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchSection;