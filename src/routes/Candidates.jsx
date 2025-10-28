import React, {useEffect, useState} from 'react'
import { FixedSizeList as List } from 'react-window'
import { candidatesApi } from '../services/api'
import CandidateCard from '../components/CandidateCard'
import KanbanBoard from '../components/KanbanBoard'

export default function Candidates(){
  const [items,setItems] = useState([])
  const [query,setQuery] = useState('')

  async function load(){
    const r = await candidatesApi.list({page:1,pageSize:1000,search:query})
    setItems(r.items)
  }
  useEffect(()=>{load()},[query])

  const Row = ({index, style}) => {
    const cand = items[index]
    if (!cand) return null
    return <div style={style}><CandidateCard candidate={cand} /></div>
  }

  return (
    <div>
      <div className="flex" style={{justifyContent:'space-between',alignItems:'center'}}>
        <h2>Candidates</h2>
        <input placeholder="search name or email" value={query} onChange={e=>setQuery(e.target.value)} />
      </div>

      <div style={{display:'flex',gap:12,marginTop:12}}>
        <div style={{flex:'1 1 50%'}} className="card">
          <h3>List ({items.length})</h3>
          <div style={{height:600}}>
            <List height={600} itemSize={72} itemCount={items.length} width={'100%'}>
              {Row}
            </List>
          </div>
        </div>

        <div style={{flex:'1 1 50%'}} className="card">
          <h3>Kanban</h3>
          <KanbanBoard items={items} onMove={()=>load()} />
        </div>
      </div>
    </div>
  )
}
