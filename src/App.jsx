import React from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import Jobs from './routes/Jobs';
import JobDetail from './routes/JobDetail';
import Candidates from './routes/Candidates';
import CandidateDetail from './routes/CandidateDetail';
import Assessments from './routes/Assessments';
import CreateJob from './routes/CreateJob';
import { Container, Navbar, Nav } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function App() {
  const location = useLocation();

  return (
    <div
      className="min-vh-100 d-flex flex-column"
      style={{
        background: 'linear-gradient(135deg, #f3f8ff 0%, #e6f0ff 50%, #fff 100%)',
      }}
    >
      {/* 🌟 Navbar */}
      <Navbar
        expand="lg"
        className="shadow-sm sticky-top"
        style={{
          background: 'rgba(255, 255, 255, 0.8)',
          backdropFilter: 'blur(12px)',
        }}
      >
        <Container>
          <Navbar.Brand
            as={Link}
            to="/"
            className="fw-bold"
            style={{
              fontSize: '1.4rem',
              color: '#007bff',
            }}
          >
            <i className="bi bi-lightning-charge-fill text-warning me-2"></i>
            TalentFlow <span className="text-secondary">Hiring Platform</span>
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <Nav.Link
                as={Link}
                to="/jobs"
                active={location.pathname.startsWith('/jobs')}
                className="fw-semibold text-dark mx-2"
                style={{
                  borderBottom:
                    location.pathname.startsWith('/jobs') ? '2px solid #0d6efd' : 'none',
                }}
              >
                <i className="bi bi-briefcase-fill me-1 text-primary"></i> Jobs
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/candidates"
                active={location.pathname.startsWith('/candidates')}
                className="fw-semibold text-dark mx-2"
                style={{
                  borderBottom:
                    location.pathname.startsWith('/candidates') ? '2px solid #0d6efd' : 'none',
                }}
              >
                <i className="bi bi-people-fill me-1 text-success"></i> Candidates
              </Nav.Link>
              <Nav.Link
                as={Link}
                to="/assessments"
                active={location.pathname.startsWith('/assessments')}
                className="fw-semibold text-dark mx-2"
                style={{
                  borderBottom:
                    location.pathname.startsWith('/assessments') ? '2px solid #0d6efd' : 'none',
                }}
              >
                <i className="bi bi-check2-circle me-1 text-danger"></i> Assessments
              </Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* ✨ Main Content Area */}
      <Container className="flex-grow-1 py-5">
        <div
          className="p-4 rounded-4 shadow-sm"
          style={{
            backgroundColor: 'white',
            minHeight: '70vh',
          }}
        >
          <Routes>
            <Route path="/" element={<Jobs />} />
            <Route path="/jobs" element={<Jobs />} />
            <Route path="/jobs/:id" element={<JobDetail />} />
             <Route path="/create" element={<CreateJob />} /> 
            <Route path="/candidates" element={<Candidates />} />
            <Route path="/candidates/:id" element={<CandidateDetail />} />
            <Route path="/assessments" element={<Assessments />} />
          </Routes>
        </div>
      </Container>

      {/* 💙 Footer */}
      <footer
        className="text-center text-muted py-3 border-top mt-auto"
        style={{
          background: 'linear-gradient(90deg, #e3f2fd, #ffffff)',
        }}
      >
        <small>
          © {new Date().getFullYear()} <strong className="text-primary">TalentFlow</strong> — Built
          with <span className="text-danger">❤️</span> using React & Bootstrap
        </small>
      </footer>
    </div>
  );
}
