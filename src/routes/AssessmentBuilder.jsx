import React, {useState} from 'react'
import AssessmentPreview from '../components/AssessmentPreview'
import { assessmentsApi } from '../services/api'

export default function AssessmentBuilder({jobId, initial}){
  const [data,setData] = useState(initial)
  const save = async ()=>{ await assessmentsApi.put(jobId, data); alert('Saved') }
  const addQuestion = ()=>{ const sec = data.sections[0]; sec.questions.push({id: crypto.randomUUID(), type:'short', label:'New question'}); setData({...data}) }

  return (
    <div style={{display:'flex',gap:12}}>
      <div style={{flex:1}}>
        <div><strong>{data.title}</strong></div>
        <div className="small">Sections: {data.sections.length}</div>
        <button className="button" onClick={addQuestion}>Add Q</button>
        <button className="button" style={{marginLeft:8}} onClick={save}>Save</button>
      </div>
      <div style={{flex:1}}>
        <AssessmentPreview data={data} />
      </div>
    </div>
  )
}
