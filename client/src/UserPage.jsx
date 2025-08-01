import React from "react";

export function UserPage() {
  const personalInfo = {
    "Account Number": "3024982387",
    Username: "Aryan.Stirk2",
    Email: "aryan.stirk2nd@gmail.com",
    "Mobile Phone": "+620932938232",
    Address: "Gotham Road 21, San Francisco",
  };

  const boxStyle = {
    position: "absolute",
    width: 331,
    height: 38,
    left: 22,
    background: "#F4F4F4",
    borderRadius: 10,
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0 14px",
    boxSizing: "border-box",
    fontFamily: "'San Francisco Display', sans-serif",
  };

  const labelStyle = {
    fontWeight: 500,
    fontSize: 12,
    lineHeight: "21px",
    letterSpacing: "0.003em",
    color: "#5164BF",
  };

  const valueStyle = {
    fontWeight: 400,
    fontSize: 12,
    lineHeight: "21px",
    letterSpacing: "0.003em",
    color: "#001A4D",
    opacity: 0.4,
    maxWidth: "60%",
    textAlign: "right",
    overflowWrap: "break-word",
  };

  return (
    <div className="App">
      <div className="App-header2" >
        <h1 className="TitleUpload" >
          USER DETAILS
        </h1>

        <h2
          className="userProfileHeader"
        >
          Your Profile Information
        </h2>

        <div
          className="profileHolder"
        >
        </div>

        <div
          style={{
            position: "absolute",
            width: 221,
            height: 22,
            left: 0,
            top: 355,
            fontFamily: "'San Francisco Display', sans-serif",
            fontStyle: "normal",
            fontWeight: 700,
            fontSize: 17,
            lineHeight: "22px",
            letterSpacing: "0.004em",
            color: "#5164BF",
            opacity: 0.8,
          }}
        >
          Personal Information
        </div>
        
        <div style={{ ...boxStyle, top: 388 }}>
          <div style={labelStyle}>Account Number</div>
          <div style={valueStyle}>{personalInfo["Account Number"]}</div>
        </div>

        <div style={{ ...boxStyle, top: 388 + 48 }}>
          <div style={labelStyle}>Username</div>
          <div style={valueStyle}>{personalInfo.Username}</div>
        </div>

        <div style={{ ...boxStyle, top: 388 + 2 * 48 }}>
          <div style={labelStyle}>Email</div>
          <div style={valueStyle}>{personalInfo.Email}</div>
        </div>

        <div style={{ ...boxStyle, top: 388 + 3 * 48 }}>
          <div style={labelStyle}>Mobile Phone</div>
          <div style={valueStyle}>{personalInfo["Mobile Phone"]}</div>
        </div>

        <div style={{ ...boxStyle, top: 388 + 4 * 48 }}>
          <div style={labelStyle}>Address</div>
          <div style={valueStyle}>{personalInfo.Address}</div>
        </div>
      </div>
    </div>
  );
}
