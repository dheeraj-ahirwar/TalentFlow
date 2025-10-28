import React from 'react'
import { useForm } from 'react-hook-form'

export default function AssessmentPreview({data}){
  const { register, handleSubmit } = useForm()
  const onSubmit = vals => { alert('Submit (local only) ' + JSON.stringify(vals)) }
  return (
    <div>
      <h4>Preview: {data.title}</h4>
      <form onSubmit={handleSubmit(onSubmit)}>
        {data.sections.map(sec=> (
          <div key={sec.id} className="card">
            <h5>{sec.title}</h5>
            {sec.questions.map(q=> (
              <div key={q.id} style={{marginBottom:8}}>
                <label>{q.label}</label>
                {q.type==='short' && <input {...register(q.id)} />}
                {q.type==='single' && q.options?.map(opt=> (
                  <div key={opt}><label><input type="radio" {...register(q.id)} value={opt} />{opt}</label></div>
                ))}
              </div>
            ))}
          </div>
        ))}
        <button className="button" type="submit">Submit</button>
      </form>
    </div>
  )
}
