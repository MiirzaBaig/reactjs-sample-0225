
import React from 'react';
import { Edit, Trash2, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  dueDate?: string;
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  isDragging?: boolean;
}

const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onEdit,
  onDelete,
  isDragging = false,
}) => {
  const priorityColors = {
    low: 'bg-gray-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    onEdit(task);
  };

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    onDelete(task.id);
  };

  return (
    <Card 
      className={`
        bg-[#111111] border-[#1a1a1a] card-hover cursor-pointer group
        ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
      `}
      draggable
      onDragStart={(e) => {
        e.dataTransfer.setData('text/plain', task.id);
        e.dataTransfer.effectAllowed = 'move';
      }}
    >
      <CardContent className="p-4">
        {/* Priority indicator */}
        <div className="flex items-start justify-between mb-3">
          <div className={`w-3 h-3 rounded-full ${priorityColors[task.priority]} shrink-0`} />
          <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleEdit}
              className="h-8 w-8 p-0 hover:bg-[#1a1a1a] text-gray-400 hover:text-white"
            >
              <Edit className="w-3 h-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleDelete}
              className="h-8 w-8 p-0 hover:bg-red-500/20 text-gray-400 hover:text-red-400"
            >
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>

        {/* Task content */}
        <h3 className="font-semibold text-white mb-2 line-clamp-2">
          {task.title}
        </h3>
        
        {task.description && (
          <p className="text-sm text-gray-400 mb-3 line-clamp-3">
            {task.description}
          </p>
        )}

        {/* Due date */}
        {task.dueDate && (
          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3 h-3" />
            {new Date(task.dueDate).toLocaleDateString()}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default TaskCard;
