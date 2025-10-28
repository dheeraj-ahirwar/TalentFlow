import Dexie from 'dexie'
import { v4 as uuid } from 'uuid'

export const db = new Dexie('talentflow_db')

db.version(1).stores({
  jobs: 'id, title, slug, status, tags, order',
  candidates: 'id, name, email, jobId, stage',
  timelines: 'id, candidateId, events',
  assessments: 'jobId, data',
  responses: '++id, jobId, candidateId, response'
})

export async function seedIfNeeded(){
  const jobsCount = await db.jobs.count()
  if (jobsCount > 0) return

  const tagsPool = ['frontend','backend','design','devops','ml','data']
  const jobs = Array.from({length:25}).map((_,i)=>{
    const id = uuid()
    return {
      id,
      title: `Job ${i+1} — ${tagsPool[i%tagsPool.length]}`,
      slug: `job-${i+1}`,
      status: i%5===0? 'archived' : 'active',
      tags:[tagsPool[i%tagsPool.length]],
      order: i
    }
  })
  await db.jobs.bulkPut(jobs)

  const stages = ['applied','screen','tech','offer','hired','rejected']
  const candidates = []
  for(let i=0;i<1000;i++){
    const jid = jobs[i%jobs.length].id
    candidates.push({id: uuid(), name:`Candidate ${i+1}`, email:`cand${i+1}@example.com`, jobId: jid, stage: stages[Math.floor(Math.random()*stages.length)]})
  }
  await db.candidates.bulkPut(candidates)

  const timelines = candidates.map(c=>({id:uuid(), candidateId:c.id, events:[{when:Date.now(), stage:c.stage, note:'Seeded'}]}))
  await db.timelines.bulkPut(timelines)

  const assessments = []
  for(let j=0;j<3;j++){
    const jobId = jobs[j].id
    const data = {
      title: `Assessment for ${jobs[j].title}`,
      sections: [
        {id:uuid(), title:'General', questions: [
          {id:uuid(), type:'short', label:'Tell us about yourself', required:true},
          {id:uuid(), type:'single', label:'Do you have 3+ years experience?', options:['Yes','No'], required:true},
        ]}
      ]
    }
    assessments.push({jobId, data})
  }
  await db.assessments.bulkPut(assessments)
}
