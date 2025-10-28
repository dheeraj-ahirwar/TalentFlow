import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Jobs from './routes/Jobs'
import JobDetail from './routes/JobDetail'
import Candidates from './routes/Candidates'
import CandidateDetail from './routes/CandidateDetail'
import Assessments from './routes/Assessments'

export default function App(){
  return (
    <div className="app-shell">
      <div className="header">
        <h1>TalentFlow — Mini Hiring Platform</h1>
        <nav className="flex space">
          <Link to="/jobs">Jobs</Link>
          <Link to="/candidates">Candidates</Link>
          <Link to="/assessments">Assessments</Link>
        </nav>
      </div>
      <div style={{marginTop:12}}>
        <Routes>
          <Route path="/" element={<Jobs/>} />
          <Route path="/jobs" element={<Jobs/>} />
          <Route path="/jobs/:id" element={<JobDetail/>} />
          <Route path="/candidates" element={<Candidates/>} />
          <Route path="/candidates/:id" element={<CandidateDetail/>} />
          <Route path="/assessments" element={<Assessments/>} />
        </Routes>
      </div>
    </div>
  )
}
