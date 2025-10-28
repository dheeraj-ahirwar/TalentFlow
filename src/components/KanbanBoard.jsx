import React from 'react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { candidatesApi } from '../services/api'

const STAGES = ['applied','screen','tech','offer','hired','rejected']

export default function KanbanBoard({items, onMove}){
  const grouped = STAGES.map(s=>({stage:s, items: items.filter(i=>i.stage===s)}))

  const onDragEnd = async (result)=>{
    if (!result.destination) return
    const candId = result.draggableId
    const toStage = result.destination.droppableId
    try{
      await candidatesApi.patch(candId,{stage: toStage})
      if (onMove) onMove()
    }catch(err){ alert('Move failed: '+err.message) }
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div style={{display:'flex',gap:8,overflowX:'auto'}}>
        {grouped.map(g=> (
          <div key={g.stage} style={{minWidth:200}} className="card">
            <h4>{g.stage} ({g.items.length})</h4>
            <Droppable droppableId={g.stage}>
              {(provided)=> (
                <div ref={provided.innerRef} {...provided.droppableProps} style={{minHeight:100}}>
                  {g.items.slice(0,30).map((c,idx)=> (
                    <Draggable key={c.id} draggableId={c.id} index={idx}>
                      {(prov)=> (
                        <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="card small" style={{marginBottom:8}}>
                          <div>{c.name}</div>
                          <div className="small">{c.email}</div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </div>
        ))}
      </div>
    </DragDropContext>
  )
}
