import React from "react";

const SearchSection = () => {
  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "600px",
        backgroundImage: `url(${process.env.PUBLIC_URL}/images/image1.jpg), linear-gradient(to right, #000, #333)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      ></div>

      <div
        style={{
          position: "relative",
          textAlign: "center",
          color: "white", 
          zIndex: 1,
        }}
      >
        <h1>Find Your Perfect Vehicle</h1>
        <p
          style={{
            fontSize: "18px",
            lineHeight: "1.6",
            color: "white", // Use white for visibility
            margin: "10px 0",
          }}
        >
          Discover a wide range of vehicles suited to your needs. Compare prices,
          features, and make an informed decision on your next purchase.
        </p>

        <div
          style={{
            marginTop: "20px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "50%",
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
