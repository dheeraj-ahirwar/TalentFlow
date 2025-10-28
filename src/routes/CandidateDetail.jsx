import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { candidatesApi } from '../services/api'

export default function CandidateDetail(){
  const { id } = useParams()
  const [cand,setCand] = useState(null)
  const [timeline,setTimeline] = useState([])
  useEffect(()=>{
    candidatesApi.get(id).then(res=>{ setCand(res.candidate); setTimeline(res.timeline) })
  },[id])

  if (!cand) return <div>Loading...</div>
  return (
    <div>
      <h2>{cand.name}</h2>
      <div className="card">
        <div>Email: {cand.email}</div>
        <div>Stage: {cand.stage}</div>
      </div>
      <h3>Timeline</h3>
      <div className="list">
        {timeline.map((e,i)=> (
          <div key={i} className="card small">{new Date(e.when).toLocaleString()} — {e.stage}</div>
        ))}
      </div>
    </div>
  )
}
