import React, { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { candidatesApi } from "../services/api";

const STAGES = [
  { id: "applied", label: "Applied", color: "#7C3AED" },
  { id: "screen", label: "Screen", color: "#0ea5a4" },
  { id: "tech", label: "Tech", color: "#0b74de" },
  { id: "offer", label: "Offer", color: "#f59e0b" },
  { id: "hired", label: "Hired", color: "#10b981" },
  { id: "rejected", label: "Rejected", color: "#ef4444" },
];

function getStageInfo(id) {
  return STAGES.find((s) => s.id === id) || { id, label: id, color: "#6b7280" };
}

function initials(name = "") {
  return (name.split(" ").map((n) => n[0]).slice(0,2).join("") || "?").toUpperCase();
}

export default function KanbanBoard({ items = [], onMove }) {
  // local copy for optimistic moves
  const [localItems, setLocalItems] = useState(items);

  useEffect(() => {
    setLocalItems(items);
  }, [items]);

  // group by stage (keeps order of STAGES)
  const grouped = STAGES.map((s) => ({
    stage: s.id,
    title: s.label,
    color: s.color,
    items: localItems.filter((i) => i.stage === s.id),
  }));

  const onDragEnd = async (result) => {
    if (!result.destination) return;

    const candId = result.draggableId;
    const fromStage = result.source.droppableId;
    const toStage = result.destination.droppableId;

    // no-op if same stage and same index
    if (fromStage === toStage && result.source.index === result.destination.index) return;

    // optimistic update: move item locally
    const moved = localItems.find((i) => String(i.id) === String(candId));
    if (!moved) return;

    const prevItems = localItems;
    const optimistic = (() => {
      // remove from previous index (by id)
      const without = prevItems.filter((i) => String(i.id) !== String(candId));
      // update the moved item's stage
      const updated = { ...moved, stage: toStage };
      // insert at the end of toStage items (we'll keep simple: push)
      return [...without, updated];
    })();

    setLocalItems(optimistic);
    if (onMove) onMove(); // notify parent (optional)

    try {
      await candidatesApi.patch(candId, { stage: toStage });
      // success: nothing else required (server is source of truth)
    } catch (err) {
      // rollback on error
      console.error("Failed to move candidate:", err);
      alert("Move failed: " + (err?.message ?? "unknown"));
      setLocalItems(items); // revert to prop state
      if (onMove) onMove(); // ask parent to refresh if needed
    }
  };

  return (
    <div className="kanban-container" role="region" aria-label="Candidates Kanban Board">
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="kanban-row">
          {grouped.map((g) => (
            <div key={g.stage} className="kanban-column" style={{ minWidth: 240 }}>
              <div
                className="kanban-column-header"
                style={{
                  borderTop: `4px solid ${g.color}`,
                }}
              >
                <div className="kanban-title">
                  <div className="kanban-stage-dot" style={{ background: g.color }} />
                  <div>
                    <div className="kanban-stage-label">{g.title}</div>
                    <div className="kanban-stage-count">{g.items.length}</div>
                  </div>
                </div>
              </div>

              <Droppable droppableId={g.stage}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`kanban-droppable ${snapshot.isDraggingOver ? "drag-over" : ""}`}
                    style={{ minHeight: 120 }}
                  >
                    {g.items.slice(0, 100).map((c, i) => (
                      <Draggable key={String(c.id)} draggableId={String(c.id)} index={i}>
                        {(prov, snap) => (
                          <div
                            ref={prov.innerRef}
                            {...prov.draggableProps}
                            {...prov.dragHandleProps}
                            className={`kanban-card ${snap.isDragging ? "is-dragging" : ""}`}
                          >
                            <div className="card-left">
                              <div className="avatar" style={{ background: `${getStageInfo(c.stage).color}22` }}>
                                <span style={{ color: getStageInfo(c.stage).color }}>{initials(c.name)}</span>
                              </div>
                            </div>

                            <div className="card-main">
                              <div className="card-title">{c.name}</div>
                              <div className="card-sub small muted">{c.email}</div>
                              {c.role && <div className="card-sub small muted">Role: {c.role}</div>}
                            </div>

                            <div className="card-right">
                              <span
                                className="stage-pill"
                                style={{ background: `${getStageInfo(c.stage).color}22`, color: getStageInfo(c.stage).color }}
                              >
                                {getStageInfo(c.stage).label}
                              </span>
                            </div>
                          </div>
                        )}
                      </Draggable>
                    ))}

                    {provided.placeholder}

                    {g.items.length === 0 && (
                      <div className="kanban-empty small muted">No candidates here yet</div>
                    )}
                  </div>
                )}
              </Droppable>
            </div>
          ))}
        </div>
      </DragDropContext>
    </div>
  );
}
