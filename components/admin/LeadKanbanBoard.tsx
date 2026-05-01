"use client";

import { useEffect, useState } from "react";
import { DragDropContext, Droppable, Draggable, DropResult } from "@hello-pangea/dnd";
import { Card } from "@/components/shared/Card";
import { Phone, Mail, Edit2, CheckCircle2 } from "lucide-react";
import { useRouter } from "next/navigation";

const COLUMNS = [
  { id: "new", title: "New Leads", color: "border-blue-500", bg: "bg-blue-50" },
  { id: "contacted", title: "Contacted", color: "border-purple-500", bg: "bg-purple-50" },
  { id: "follow-up", title: "Follow Up", color: "border-orange-500", bg: "bg-orange-50" },
  { id: "converted", title: "Converted", color: "border-green-500", bg: "bg-green-50" },
  { id: "lost", title: "Lost", color: "border-red-500", bg: "bg-red-50" },
];

export default function LeadKanbanBoard({ 
  leads, 
  onStatusChange, 
  onEdit 
}: { 
  leads: any[], 
  onStatusChange: (id: string, newStatus: string) => void,
  onEdit: (lead: any) => void 
}) {
  const router = useRouter();
  const [boardData, setBoardData] = useState<Record<string, any[]>>({
    "new": [], "contacted": [], "follow-up": [], "converted": [], "lost": []
  });
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    const newBoardData: Record<string, any[]> = {
      "new": [], "contacted": [], "follow-up": [], "converted": [], "lost": []
    };
    leads.forEach(lead => {
      if (newBoardData[lead.status]) {
        newBoardData[lead.status].push(lead);
      } else {
        newBoardData["new"].push(lead); // Fallback
      }
    });
    setBoardData(newBoardData);
  }, [leads]);

  const onDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    if (!destination) return;
    if (destination.droppableId === source.droppableId && destination.index === source.index) return;

    const sourceCol = source.droppableId;
    const destCol = destination.droppableId;

    // Optimistic UI update
    const newBoard = { ...boardData };
    const [movedItem] = newBoard[sourceCol].splice(source.index, 1);
    movedItem.status = destCol;
    newBoard[destCol].splice(destination.index, 0, movedItem);
    
    setBoardData(newBoard);
    
    // API update
    if (sourceCol !== destCol) {
      onStatusChange(movedItem._id, destCol);
    }
  };

  const handleConvertToPatient = (lead: any) => {
    if (lead.convertedToPatient) {
      router.push(`/admin/patients/${lead.convertedToPatient}`);
    } else {
      router.push(`/admin/patients/new?leadId=${lead._id}&name=${encodeURIComponent(lead.name)}&phone=${encodeURIComponent(lead.phone)}`);
    }
  };

  if (!isMounted) return <div className="p-8 text-center">Loading board...</div>;

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <div className="flex gap-4 overflow-x-auto pb-4 items-start min-h-[600px]">
        {COLUMNS.map((col) => (
          <div key={col.id} className="min-w-[300px] w-[300px] shrink-0 flex flex-col h-full">
            <div className={`p-3 rounded-t-lg border-t-4 ${col.color} ${col.bg} font-semibold text-text flex items-center justify-between`}>
              <span>{col.title}</span>
              <span className="bg-white px-2 py-0.5 rounded-full text-xs shadow-sm">
                {boardData[col.id]?.length || 0}
              </span>
            </div>
            
            <Droppable droppableId={col.id}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                  className={`flex-1 p-2 rounded-b-lg min-h-[150px] transition-colors ${
                    snapshot.isDraggingOver ? "bg-surface/80 border-2 border-dashed border-primary/50" : "bg-surface/50 border-2 border-transparent"
                  }`}
                >
                  {boardData[col.id]?.map((lead, index) => (
                    <Draggable key={lead._id} draggableId={lead._id} index={index}>
                      {(provided, snapshot) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          className="mb-3"
                          style={{
                            ...provided.draggableProps.style,
                            opacity: snapshot.isDragging ? 0.9 : 1,
                          }}
                        >
                          <Card className={`shadow-sm border-border hover:shadow-md transition-shadow bg-white ${snapshot.isDragging ? 'shadow-lg ring-2 ring-primary/50' : ''}`}>
                            <div className="p-4">
                              <div className="flex justify-between items-start mb-2">
                                <h4 className="font-medium text-text">{lead.name}</h4>
                                <div className="flex gap-1">
                                  {col.id === "converted" && (
                                    <button 
                                      onClick={() => handleConvertToPatient(lead)}
                                      className="text-success hover:bg-success/10 p-1 rounded transition-colors"
                                      title={lead.convertedToPatient ? "View Patient" : "Complete Registration"}
                                    >
                                      <CheckCircle2 className="h-4 w-4" />
                                    </button>
                                  )}
                                  <button onClick={() => onEdit(lead)} className="text-text-muted hover:text-primary hover:bg-surface p-1 rounded transition-colors">
                                    <Edit2 className="h-4 w-4" />
                                  </button>
                                </div>
                              </div>
                              <div className="space-y-1 text-xs text-text-muted">
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 w-3" /> {lead.phone}
                                </div>
                                {lead.email && (
                                  <div className="flex items-center gap-2">
                                    <Mail className="h-3 w-3" /> {lead.email}
                                  </div>
                                )}
                              </div>
                              {lead.interest && (
                                <div className="mt-3 inline-block px-2 py-1 bg-surface text-[10px] font-medium rounded-sm truncate max-w-full">
                                  {lead.interest}
                                </div>
                              )}
                            </div>
                          </Card>
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
  );
}
