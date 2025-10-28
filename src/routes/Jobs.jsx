import React, {useEffect, useState} from 'react'
import { jobsApi } from '../services/api'
import JobList from '../components/JobList'
import JobForm from '../components/JobForm'

export default function Jobs(){
  const [jobs, setJobs] = useState([])
  const [page,setPage] = useState(1)
  const [query,setQuery] = useState('')
  const [showForm,setShowForm] = useState(false)

  async function load(){
    const res = await jobsApi.list({page, pageSize:10, search: query})
    setJobs(res.items)
  }

  useEffect(()=>{ load() },[page,query])

  return (
    <div>
      <div className="flex" style={{justifyContent:'space-between',alignItems:'center'}}>
        <h2>Jobs</h2>
        <div className="flex space">
          <input placeholder="Search title..." value={query} onChange={e=>setQuery(e.target.value)} />
          <button className="button" onClick={()=>setShowForm(true)}>New Job</button>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <JobList jobs={jobs} onReorder={async (from,to)=>{
          await load()
        }}/>
      </div>

      {showForm && <JobForm onClose={()=>{setShowForm(false); load()}} />}
    </div>
  )
}
