import React from 'react'
import { Link } from 'react-router-dom'

export default function CandidateCard({candidate}){
  return (
    <div className="card" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
      <div>
        <Link to={`/candidates/${candidate.id}`}><strong>{candidate.name}</strong></Link>
        <div className="small">{candidate.email}</div>
      </div>
      <div className="small">{candidate.stage}</div>
    </div>
  )
}
