export async function apiFetch(path, opts={}) {
  const res = await fetch(`/api${path}`, opts)
  if (!res.ok) throw new Error((await res.text())||res.statusText)
  return res.json()
}

export const jobsApi = {
  list: (q)=> apiFetch(`/jobs?${new URLSearchParams(q||{})}`),
  get: (id)=> apiFetch(`/jobs/${id}`),
  create: (body)=> apiFetch('/jobs',{method:'POST',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}}),
  patch: (id,body)=> apiFetch(`/jobs/${id}`,{method:'PATCH',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}}),
  reorder: (id,body)=> apiFetch(`/jobs/${id}/reorder`,{method:'PATCH',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}})
}

export const candidatesApi = {
  list: (q)=> apiFetch(`/candidates?${new URLSearchParams(q||{})}`),
  get: (id)=> apiFetch(`/candidates/${id}`),
  create: (body)=> apiFetch('/candidates',{method:'POST',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}}),
  patch: (id,body)=> apiFetch(`/candidates/${id}`,{method:'PATCH',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}}),
}

export const assessmentsApi = {
  get: (jobId)=> apiFetch(`/assessments/${jobId}`),
  put: (jobId,body)=> apiFetch(`/assessments/${jobId}`,{method:'PUT',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}}),
  submit: (jobId,body)=> apiFetch(`/assessments/${jobId}/submit`,{method:'POST',body:JSON.stringify(body),headers:{'Content-Type':'application/json'}})
}
