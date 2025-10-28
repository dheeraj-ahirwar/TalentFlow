import React, {useEffect, useState} from 'react'
import { db } from '../services/db'
import AssessmentBuilder from './AssessmentBuilder'

export default function Assessments(){
  const [assessments, setAssessments] = useState([])
  useEffect(()=>{
    db.assessments.toArray().then(a=>setAssessments(a))
  },[])

  return (
    <div>
      <h2>Assessments</h2>
      <div className="list">
        {assessments.map(a=> (
          <div key={a.jobId} className="card">
            <h4>{a.data.title}</h4>
            <AssessmentBuilder jobId={a.jobId} initial={a.data} />
          </div>
        ))}
      </div>
    </div>
  )
}
