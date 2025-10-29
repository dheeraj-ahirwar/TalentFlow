import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../services/api';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function CreateJob() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    slug: '',
    status: 'active',
    tags: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()),
      };
      await jobsApi.create(payload);
      alert('✅ Job created successfully!');
      navigate('/');
    } catch (err) {
      alert('❌ Error creating job');
    }
  };

  return (
    <div
      className="min-vh-100 d-flex justify-content-center align-items-center"
      style={{
        background: 'linear-gradient(135deg, #74ebd5 0%, #ACB6E5 100%)',
      }}
    >
      <div
        className="card shadow-lg p-4"
        style={{
          width: '100%',
          maxWidth: '600px',
          borderRadius: '20px',
          background: 'rgba(255, 255, 255, 0.95)',
        }}
      >
        {/* Header */}
        <div className="text-center mb-4">
          <h3 className="fw-bold text-primary">
            <i className="bi bi-briefcase-fill me-2"></i>Add New Job
          </h3>
          <p className="text-muted small">
            Fill in the details below to create a new job listing.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-card-text me-2 text-secondary"></i>Job Title
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Enter job title"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-link-45deg me-2 text-secondary"></i>Slug
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="slug"
              value={form.slug}
              onChange={handleChange}
              placeholder="e.g., software-engineer"
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label fw-semibold">
              <i className="bi bi-toggles2 me-2 text-secondary"></i>Status
            </label>
            <select
              className="form-select form-select-lg"
              name="status"
              value={form.status}
              onChange={handleChange}
            >
              <option value="active">🟢 Active</option>
              <option value="closed">🔴 Closed</option>
              <option value="draft">🟡 Draft</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="form-label fw-semibold">
              <i className="bi bi-tags-fill me-2 text-secondary"></i>Tags
            </label>
            <input
              type="text"
              className="form-control form-control-lg"
              name="tags"
              value={form.tags}
              onChange={handleChange}
              placeholder="e.g., remote, full-time, react"
            />
          </div>

          {/* Buttons */}
          <div className="d-flex justify-content-between">
            <button
              type="button"
              className="btn btn-outline-secondary btn-lg px-4"
              onClick={() => navigate('/')}
            >
              <i className="bi bi-arrow-left-circle me-2"></i>Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary btn-lg px-4"
              style={{
                background:
                  'linear-gradient(90deg, #007bff 0%, #00c6ff 100%)',
                border: 'none',
              }}
            >
              <i className="bi bi-save2 me-2"></i>Save Job
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
