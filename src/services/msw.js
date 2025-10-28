import { setupWorker, rest } from 'msw'
import { db, seedIfNeeded } from './db'

function randLatency(){ return 200 + Math.floor(Math.random()*1000) }
function maybeFail(rate=0.08){ return Math.random() < rate }

const handlers = [
  rest.get('/api/jobs', async (req,res,ctx)=>{
    const search = req.url.searchParams.get('search') || ''
    const status = req.url.searchParams.get('status') || ''
    const page = parseInt(req.url.searchParams.get('page')||'1')
    const pageSize = parseInt(req.url.searchParams.get('pageSize')||'10')
    let collection = await db.jobs.toArray()
    if (search) collection = collection.filter(j=>j.title.toLowerCase().includes(search.toLowerCase()))
    if (status) collection = collection.filter(j=>j.status===status)
    collection = collection.sort((a,b)=>a.order - b.order)
    const total = collection.length
    const start = (page-1)*pageSize
    const pageItems = collection.slice(start, start+pageSize)
    return res(ctx.delay(randLatency()), ctx.json({items:pageItems, total}))
  }),

  rest.get('/api/jobs/:id', async (req,res,ctx)=>{
    const {id} = req.params
    const job = await db.jobs.get(id)
    if (!job) return res(ctx.status(404), ctx.json({message:'Not found'}))
    return res(ctx.delay(randLatency()), ctx.json(job))
  }),

  rest.post('/api/jobs', async (req,res,ctx)=>{
    const body = await req.json()
    const existing = await db.jobs.where('slug').equals(body.slug).first()
    if (existing) return res(ctx.delay(randLatency()), ctx.status(400), ctx.json({message:'Slug not unique'}))
    const id = body.id || ('j-'+Date.now())
    const order = await db.jobs.count()
    const job = {...body, id, order}
    await db.jobs.put(job)
    return res(ctx.delay(randLatency()), ctx.status(201), ctx.json(job))
  }),

  rest.patch('/api/jobs/:id', async (req,res,ctx)=>{
    const {id} = req.params
    const body = await req.json()
    await db.jobs.update(id, body)
    const job = await db.jobs.get(id)
    return res(ctx.delay(randLatency()), ctx.json(job))
  }),

  rest.patch('/api/jobs/:id/reorder', async (req,res,ctx)=>{
    const {id} = req.params
    const body = await req.json()
    if (maybeFail(0.08)) return res(ctx.delay(randLatency()), ctx.status(500), ctx.json({message:'Simulated server error'}))
    const from = body.fromOrder
    const to = body.toOrder
    const all = await db.jobs.orderBy('order').toArray()
    const item = all.splice(from,1)[0]
    all.splice(to,0,item)
    await Promise.all(all.map((it,idx)=>db.jobs.update(it.id,{order:idx})))
    return res(ctx.delay(randLatency()), ctx.json({fromOrder:from,toOrder:to}))
  }),

  rest.get('/api/candidates', async (req,res,ctx)=>{
    const search = req.url.searchParams.get('search') || ''
    const stage = req.url.searchParams.get('stage') || ''
    const page = parseInt(req.url.searchParams.get('page')||'1')
    const pageSize = parseInt(req.url.searchParams.get('pageSize')||'50')
    let collection = await db.candidates.toArray()
    if (search) collection = collection.filter(c=> c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()))
    if (stage) collection = collection.filter(c=>c.stage===stage)
    const total = collection.length
    const start = (page-1)*pageSize
    const items = collection.slice(start,start+pageSize)
    return res(ctx.delay(randLatency()), ctx.json({items,total}))
  }),

  rest.get('/api/candidates/:id', async (req,res,ctx)=>{
    const {id} = req.params
    const cand = await db.candidates.get(id)
    if (!cand) return res(ctx.status(404), ctx.json({message:'Not found'}))
    const timeline = await db.timelines.where('candidateId').equals(id).first()
    return res(ctx.delay(randLatency()), ctx.json({candidate:cand,timeline:timeline?.events||[]}))
  }),

  rest.patch('/api/candidates/:id', async (req,res,ctx)=>{
    const {id} = req.params
    const body = await req.json()
    if (maybeFail(0.08)) return res(ctx.delay(randLatency()), ctx.status(500), ctx.json({message:'Simulated write error'}))
    await db.candidates.update(id, body)
    if (body.stage){
      const t = await db.timelines.where('candidateId').equals(id).first()
      const events = (t?.events||[])
      events.push({when:Date.now(), stage:body.stage})
      if (t) await db.timelines.update(t.id,{events})
      else await db.timelines.add({id:('tl-'+Date.now()), candidateId:id, events})
    }
    const cand = await db.candidates.get(id)
    return res(ctx.delay(randLatency()), ctx.json(cand))
  }),

  rest.get('/api/assessments/:jobId', async (req,res,ctx)=>{
    const {jobId} = req.params
    const a = await db.assessments.get(jobId)
    if (!a) return res(ctx.delay(randLatency()), ctx.status(404), ctx.json({message:'No assessment'}))
    return res(ctx.delay(randLatency()), ctx.json(a))
  }),

  rest.put('/api/assessments/:jobId', async (req,res,ctx)=>{
    const {jobId} = req.params
    const data = await req.json()
    await db.assessments.put({jobId, data})
    return res(ctx.delay(randLatency()), ctx.json({jobId,data}))
  }),

  rest.post('/api/assessments/:jobId/submit', async (req,res,ctx)=>{
    const {jobId} = req.params
    const body = await req.json()
    await db.responses.add({jobId, candidateId: body.candidateId, response: body.response})
    return res(ctx.delay(randLatency()), ctx.json({ok:true}))
  })
]

export async function startMockServer(){
  await seedIfNeeded()
  if (typeof window === 'undefined') return
  const worker = setupWorker(...handlers)
  await worker.start({onUnhandledRequest: 'bypass'})
  console.log('MSW started')
}
