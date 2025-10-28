import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom'
import { jobsApi } from '../services/api'

export default function JobDetail(){
  const { id } = useParams()
  const [job,setJob] = useState(null)
  useEffect(()=>{ jobsApi.get(id).then(setJob).catch(()=>setJob(null)) },[id])
  if (!job) return <div>Loading...</div>
  return (
    <div>
      <h2>{job.title}</h2>
      <div className="card">
        <div>Slug: {job.slug}</div>
        <div>Status: {job.status}</div>
        <div>Tags: {job.tags?.join(', ')}</div>
      </div>
    </div>
  )
}
