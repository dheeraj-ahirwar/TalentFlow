import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { jobsApi } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";

export default function JobDetail() {
  const { id } = useParams();
  const [job, setJob] = useState(null);

  useEffect(() => {
    jobsApi
      .get(id)
      .then(setJob)
      .catch(() => setJob(null));
  }, [id]);

  if (!job)
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-3 text-muted">Loading job details...</p>
      </div>
    );

  return (
    <div className="container py-5">
      <div className="text-center mb-5">
        <h2 className="fw-bold text-gradient mb-2">{job.title}</h2>
        <p className="text-muted">
          Manage and track the details of this open position.
        </p>
      </div>

      <div className="card shadow-lg border-0 rounded-4 p-4">
        <div className="row mb-3">
          <div className="col-md-6">
            <strong className="text-secondary">Slug:</strong>{" "}
            <span className="text-dark">{job.slug}</span>
          </div>
          <div className="col-md-6">
            <strong className="text-secondary">Status:</strong>{" "}
            <span
              className={`badge px-3 py-2 ${
                job.status === "active"
                  ? "bg-success"
                  : job.status === "closed"
                  ? "bg-danger"
                  : "bg-secondary"
              }`}
            >
              {job.status}
            </span>
          </div>
        </div>

        <div className="mb-3">
          <strong className="text-secondary">Tags:</strong>{" "}
          {job.tags?.length ? (
            job.tags.map((tag, i) => (
              <span key={i} className="badge bg-info text-dark me-2">
                {tag}
              </span>
            ))
          ) : (
            <span className="text-muted">No tags available</span>
          )}
        </div>

        <div className="mt-4">
          <Link to="/jobs" className="btn btn-outline-primary rounded-pill px-4">
            ← Back to Job List
          </Link>
        </div>
      </div>
    </div>
  );
}
