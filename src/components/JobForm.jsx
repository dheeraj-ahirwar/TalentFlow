import React from "react";
import { useForm } from "react-hook-form";
import { jobsApi } from "../services/api";

export default function JobForm({ onClose, job }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: job || { title: "", slug: "", tags: "", status: "active" },
  });

  const onSubmit = async (data) => {
    try {
      if (job) await jobsApi.patch(job.id, data);
      else await jobsApi.create(data);
      onClose();
    } catch (err) {
      alert("Save failed: " + err.message);
    }
  };

  return (
    <div className="card job-form">
      <h3 style={{ marginBottom: "16px" }}>{job ? "Edit Job" : "Create Job"}</h3>

      <form onSubmit={handleSubmit(onSubmit)} className="form-grid">
        <div className="form-group">
          <label>Title</label>
          <input
            {...register("title", { required: true })}
            placeholder="Enter job title"
            className={`input ${errors.title ? "error" : ""}`}
          />
          {errors.title && <span className="error-text">Title is required</span>}
        </div>

        <div className="form-group">
          <label>Slug</label>
          <input
            {...register("slug", { required: true })}
            placeholder="Unique slug (e.g. frontend-dev)"
            className={`input ${errors.slug ? "error" : ""}`}
          />
          {errors.slug && <span className="error-text">Slug is required</span>}
        </div>

        <div className="form-group">
          <label>Tags</label>
          <input
            {...register("tags")}
            placeholder="Comma-separated (e.g. React, Node, UI)"
            className="input"
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="button">
            Save
          </button>
          <button
            type="button"
            onClick={onClose}
            className="button button-secondary"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
