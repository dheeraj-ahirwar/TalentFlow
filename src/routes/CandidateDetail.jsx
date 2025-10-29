import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { candidatesApi } from "../services/api";

/**
 * CandidateDetail - styled detail page
 */
export default function CandidateDetail() {
  const { id } = useParams();
  const [cand, setCand] = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    candidatesApi
      .get(id)
      .then((res) => {
        if (!mounted) return;
        setCand(res.candidate ?? null);
        setTimeline(Array.isArray(res.timeline) ? res.timeline : []);
      })
      .catch((err) => {
        console.error("Failed to load candidate", err);
        if (mounted) setCand(null);
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: "center", padding: 28 }}>
        <div className="h2">Loading candidate…</div>
        <div className="small muted">Please wait while we fetch data.</div>
      </div>
    );
  }

  if (!cand) {
    return (
      <div className="card empty" style={{ textAlign: "center" }}>
        <div className="h2">Candidate not found</div>
        <div className="small muted">The candidate may have been removed.</div>
        <div style={{ marginTop: 12 }}>
          <Link to="/candidates" className="button secondary">Back to list</Link>
        </div>
      </div>
    );
  }

  const formatDate = (iso) => {
    try {
      const d = new Date(iso);
      return d.toLocaleString();
    } catch {
      return iso;
    }
  };

  return (
    <div className="grid" style={{ gap: 16 }}>
      {/* Header */}
      <div className="card" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 12,
              display: "grid",
              placeItems: "center",
              color: "#fff",
              fontWeight: 700,
              fontSize: 22,
              background: "#0b74de",
              boxShadow: "0 8px 20px rgba(11,116,222,0.12)",
            }}
            aria-hidden
          >
            {cand.name?.charAt(0)?.toUpperCase() ?? "?"}
          </div>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700 }}>{cand.name}</div>
            <div className="small muted">{cand.title ?? cand.role ?? "Candidate"}</div>
            <div className="small muted">{cand.location ?? ""}</div>
          </div>
        </div>

        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <a className="button" href={`mailto:${cand.email}`}>Email</a>
          <Link to={`/candidates/${id}/edit`} className="button secondary">Edit</Link>
          <Link to="/candidates" className="button secondary">Back</Link>
        </div>
      </div>

      {/* Details */}
      <div className="card" style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
        {/* Left - profile & bio */}
        <div>
          <h3 style={{ marginTop: 0 }}>Profile</h3>
          <div className="small muted" style={{ marginBottom: 8 }}>Email</div>
          <div className="card-compact" style={{ marginBottom: 12 }}>{cand.email}</div>

          <div className="small muted" style={{ marginBottom: 8 }}>Stage</div>
          <div className="card-compact" style={{ marginBottom: 12 }}>{cand.stage ?? "Unknown"}</div>

          {cand.skills && cand.skills.length > 0 && (
            <>
              <div className="small muted" style={{ marginBottom: 8 }}>Skills</div>
              <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
                {cand.skills.map((s, i) => (
                  <div key={i} className="tag" style={{ marginBottom: 6 }}>{s}</div>
                ))}
              </div>
            </>
          )}

          {cand.notes && (
            <>
              <div className="small muted mt-1">Notes</div>
              <div className="card-compact mt-1" style={{ whiteSpace: "pre-wrap" }}>{cand.notes}</div>
            </>
          )}
        </div>

        {/* Right - quick info */}
        <aside>
          <div className="small muted">Applied On</div>
          <div className="card-compact" style={{ marginBottom: 12 }}>{formatDate(cand.appliedAt ?? cand.createdAt ?? "")}</div>

          <div className="small muted">Phone</div>
          <div className="card-compact" style={{ marginBottom: 12 }}>{cand.phone ?? "—"}</div>

          <div className="small muted">Source</div>
          <div className="card-compact" style={{ marginBottom: 12 }}>{cand.source ?? "—"}</div>
        </aside>
      </div>

      {/* Timeline */}
      <div>
        <h3 style={{ marginBottom: 8 }}>Timeline</h3>
        <div className="list">
          {timeline.length === 0 ? (
            <div className="card empty">No timeline events yet.</div>
          ) : (
            timeline.map((e, i) => (
              <div key={i} className="card" style={{ display: "flex", gap: 12, alignItems: "flex-start" }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", marginTop: 6, background: "#0b74de" }} />
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <div style={{ fontWeight: 700 }}>{e.stage}</div>
                    <div className="small muted">{formatDate(e.when)}</div>
                  </div>
                  {e.note && <div className="small mt-1" style={{ whiteSpace: "pre-wrap" }}>{e.note}</div>}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
