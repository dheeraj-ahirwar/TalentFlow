import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { jobsApi } from '../services/api';
import JobList from '../components/JobList';

export default function Jobs() {
  const [jobs, setJobs] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  async function load() {
    const res = await jobsApi.list({ page, pageSize: 10, search: query });
    setJobs(res.items);
  }

  useEffect(() => {
    load();
  }, [page, query]);

  return (
    <div className="container mt-5 mb-5 p-4 bg-light rounded shadow-sm">
      {/* Header Section */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-center mb-4">
        <h3 className="text-primary fw-bold text-center mb-3 mb-md-0">
        
        </h3>

        <div className="d-flex gap-2">
          <input
            type="text"
            placeholder="Search by title..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="form-control"
            style={{ width: '250px' }}
          />
          <button
            className="btn btn-success fw-semibold"
            onClick={() => navigate('/create')}
          >
            <i className="bi bi-plus-circle me-1"></i> Add Job
          </button>
        </div>
      </div>

      {/* Job List Section */}
      <div>
        {jobs.length > 0 ? (
          <JobList
            jobs={jobs}
            onReorder={async (from, to) => {
              await load();
            }}
          />
        ) : (
          <div className="text-center text-muted py-4 fst-italic">
            No jobs found. Try searching for something else.
          </div>
        )}
      </div>
    </div>
  );
}
