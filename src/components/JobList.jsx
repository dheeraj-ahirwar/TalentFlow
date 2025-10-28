import React from 'react'
import { Link } from 'react-router-dom'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { jobsApi } from '../services/api'

export default function JobList({jobs, onReorder}){
  const handleDragEnd = async (result)=>{
    if (!result.destination) return
    const from = result.source.index
    const to = result.destination.index
    const reordered = Array.from(jobs)
    const [moved] = reordered.splice(from,1)
    reordered.splice(to,0,moved)
    try{
      await jobsApi.reorder(moved.id, {fromOrder: from, toOrder: to})
      if (onReorder) onReorder(from,to)
    }catch(err){
      alert('Reorder failed — rolling back')
      if (onReorder) onReorder()
    }
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="jobs">
        {(provided)=> (
          <div {...provided.droppableProps} ref={provided.innerRef} className="list">
            {jobs.map((j,idx)=> (
              <Draggable key={j.id} draggableId={j.id} index={idx}>
                {(prov)=> (
                  <div ref={prov.innerRef} {...prov.draggableProps} {...prov.dragHandleProps} className="card">
                    <div style={{display:'flex',justifyContent:'space-between'}}>
                      <div>
                        <Link to={`/jobs/${j.id}`}><strong>{j.title}</strong></Link>
                        <div className="small">{j.tags?.join(', ')}</div>
                      </div>
                      <div className="small">{j.status}</div>
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
