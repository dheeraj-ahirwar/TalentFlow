import React, { useEffect, useState } from "react";
import { db } from "../services/db";
import AssessmentBuilder from "./AssessmentBuilder";

export default function Assessments() {
  const [assessments, setAssessments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.assessments
      .toArray()
      .then((a) => {
        setAssessments(a);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="card" style={{ textAlign: "center", padding: "40px" }}>
        <h4>Loading Assessments...</h4>
        <div className="small muted">Please wait while we fetch data.</div>
      </div>
    );
  }

  return (
    <div className="assessments-page">
      <div className="header">
        <h2 className="page-title">📋 Assessments</h2>
        <p className="small muted">Manage and edit candidate assessments easily.</p>
      </div>

      {assessments.length === 0 ? (
        <div className="card empty" style={{ textAlign: "center", padding: "32px" }}>
          <h4>No Assessments Found</h4>
          <div className="small muted">
            You haven't created any assessments yet.
          </div>
        </div>
      ) : (
        <div className="list" style={{ marginTop: 16 }}>
          {assessments.map((a) => (
            <div key={a.jobId} className="card assessment-card">
              <div className="card-header" style={{ marginBottom: 12 }}>
                <h4 style={{ margin: 0 }}>{a.data.title}</h4>
                <div className="small muted">
                  Job ID: <strong>{a.jobId}</strong>
                </div>
              </div>
              <AssessmentBuilder jobId={a.jobId} initial={a.data} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
