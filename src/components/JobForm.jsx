import React from 'react'
import { useForm } from 'react-hook-form'
import { jobsApi } from '../services/api'

export default function JobForm({onClose, job}){
  const { register, handleSubmit } = useForm({defaultValues: job||{title:'',slug:'',tags:[],status:'active'}})
  const onSubmit = async (data)=>{
    try{
      if (job) await jobsApi.patch(job.id,data)
      else await jobsApi.create(data)
      onClose()
    }catch(err){ alert('Save failed: '+err.message) }
  }

  return (
    <div className="card">
      <h3>{job? 'Edit Job':'Create Job'}</h3>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div><input {...register('title',{required:true})} placeholder="Title" /></div>
        <div><input {...register('slug',{required:true})} placeholder="Slug (unique)" /></div>
        <div><input {...register('tags')} placeholder="comma separated tags" /></div>
        <div style={{marginTop:8}}>
          <button type="submit" className="button">Save</button>
          <button type="button" onClick={onClose} style={{marginLeft:8}}>Cancel</button>
        </div>
      </form>
    </div>
  )
}
