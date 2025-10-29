import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { jobsApi } from "../services/api";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";

export default function JobList({ jobs = [], onReorder }) {
  // local copy to allow optimistic updates & smooth immediate UI
  const [localJobs, setLocalJobs] = useState(jobs);

  useEffect(() => setLocalJobs(jobs), [jobs]);

  const handleDragEnd = async (result) => {
    if (!result.destination) return;
    const from = result.source.index;
    const to = result.destination.index;
    if (from === to) return;

    const reordered = Array.from(localJobs);
    const [moved] = reordered.splice(from, 1);
    reordered.splice(to, 0, moved);

    // optimistic UI
    setLocalJobs(reordered);
    if (onReorder) onReorder(from, to);

    try {
      await jobsApi.reorder(moved.id, { fromOrder: from, toOrder: to });
    } catch (err) {
      // rollback
      alert("Reorder failed — rolling back");
      setLocalJobs(jobs);
      if (onReorder) onReorder(); // let parent refresh
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <div className="text-center mb-5">
  <h2 className="fw-bold job-title-gradient mb-2">
    🚀 Available Job Positions
  </h2>
  <p className="text-muted fs-6">
    Drag and reorder job cards easily — manage your open roles efficiently.
  </p>
</div>


      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="jobs">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="list-group"
            >
              {localJobs.length === 0 ? (
                <div className="card p-4 text-center">
                  <div className="h5 mb-2">No jobs available</div>
                  <div className="text-muted small">Create a new job to get started.</div>
                </div>
              ) : (
                localJobs.map((j, idx) => (
                  <Draggable key={String(j.id)} draggableId={String(j.id)} index={idx}>
                    {(prov, snapshot) => (
                      <div
                        ref={prov.innerRef}
                        {...prov.draggableProps}
                        className={`list-group-item mb-3 border-0 rounded-3 job-item ${snapshot.isDragging ? "dragging" : ""}`}
                        style={{
                          ...prov.draggableProps.style,
                          cursor: snapshot.isDragging ? "grabbing" : "grab",
                        }}
                        aria-roledescription="Draggable job"
                      >
                        <div className="d-flex align-items-center justify-content-between gap-3">
                          <div className="d-flex align-items-center gap-3" style={{ minWidth: 0 }}>
                            {/* drag handle */}
                            <div {...prov.dragHandleProps} className="drag-handle d-flex align-items-center justify-content-center">
                              <i className="bi bi-grip-vertical" aria-hidden />
                            </div>

                            {/* avatar */}
                            <div className="job-avatar d-flex align-items-center justify-content-center">
                              {j.title?.charAt(0)?.toUpperCase() ?? "J"}
                            </div>

                            {/* main info */}
                            <div style={{ minWidth: 0 }}>
                              <Link to={`/jobs/${j.id}`} className="fw-semibold text-decoration-none job-title">
                                {j.title}
                              </Link>
                              <div className="text-muted small text-truncate mt-1 job-tags">
                                {j.tags?.length
                                  ? j.tags.map((t, i) => (
                                      <span key={i} className="badge tag-badge me-1">{t}</span>
                                    ))
                                  : <span className="text-muted">No tags</span>}
                              </div>
                            </div>
                          </div>

                          <div className="d-flex align-items-center gap-2">
                            <span className={`badge ${j.status === "active" ? "bg-success" : j.status === "closed" ? "bg-danger" : "bg-secondary"}`}>
                              {j.status}
                            </span>
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => window.open(`/jobs/${j.id}`, "_self")}
                              aria-label={`Open ${j.title}`}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </Draggable>
                ))
              )}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </div>
  );
}
