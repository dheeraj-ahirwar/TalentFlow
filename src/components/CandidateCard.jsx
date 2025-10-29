import React from "react";
import { Link } from "react-router-dom";

export default function CandidateCard({ candidate }) {
  // Pick a random color for the avatar background (based on name hash)
  const colors = ["#0b74de", "#34a853", "#fbbc05", "#e8453c", "#8e44ad"];
  const color = colors[candidate.name.charCodeAt(0) % colors.length];

  // Stage color styles
  const stageColors = {
    Applied: "#0b74de",
    Shortlisted: "#34a853",
    Interviewed: "#fbbc05",
    Hired: "#4CAF50",
    Rejected: "#E8453C",
  };

  return (
    <div
      className="card candidate-card"
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 18px",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        {/* Avatar circle */}
        <div
          style={{
            width: 42,
            height: 42,
            borderRadius: "50%",
            background: color,
            color: "#fff",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontWeight: "600",
            fontSize: "1rem",
          }}
        >
          {candidate.name?.charAt(0).toUpperCase()}
        </div>

        {/* Candidate info */}
        <div>
          <Link
            to={`/candidates/${candidate.id}`}
            style={{ textDecoration: "none", color: "#222" }}
          >
            <strong style={{ fontSize: "1.05rem" }}>{candidate.name}</strong>
          </Link>
          <div className="small muted">{candidate.email}</div>
        </div>
      </div>

      {/* Stage badge */}
      <div
        className="stage-badge"
        style={{
          background: stageColors[candidate.stage] || "#ddd",
          color: "#fff",
          padding: "4px 10px",
          borderRadius: "20px",
          fontSize: "0.8rem",
          fontWeight: 500,
          textTransform: "capitalize",
        }}
      >
        {candidate.stage || "Unknown"}
      </div>
    </div>
  );
}
