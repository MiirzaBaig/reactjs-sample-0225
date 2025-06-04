import React, { useState, useEffect } from 'react';
import { Plus, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import TaskCard, { Task } from './TaskCard';
import TaskModal from './TaskModal';

const TaskBoard = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [draggedTaskId, setDraggedTaskId] = useState<string | null>(null);

  // Load tasks from localStorage on component mount
  useEffect(() => {
    const savedTasks = localStorage.getItem('taskboard_tasks');
    if (savedTasks) {
      setTasks(JSON.parse(savedTasks));
    } else {
      // Add some sample tasks for demo
      const sampleTasks: Task[] = [
        {
          id: '1',
          title: 'Design new landing page',
          description: 'Create a modern, responsive landing page with dark theme',
          status: 'todo',
          priority: 'high',
          createdAt: new Date().toISOString(),
          dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        },
        {
          id: '2',
          title: 'Implement user authentication',
          description: 'Add login and signup functionality',
          status: 'in-progress',
          priority: 'medium',
          createdAt: new Date().toISOString(),
        },
        {
          id: '3',
          title: 'Setup database schema',
          description: 'Design and implement the database structure',
          status: 'done',
          priority: 'high',
          createdAt: new Date().toISOString(),
        },
      ];
      setTasks(sampleTasks);
      localStorage.setItem('taskboard_tasks', JSON.stringify(sampleTasks));
    }
  }, []);

  // Save tasks to localStorage whenever tasks change
  useEffect(() => {
    localStorage.setItem('taskboard_tasks', JSON.stringify(tasks));
  }, [tasks]);

  const columns = [
    { id: 'todo', title: 'To Do', color: 'border-gray-500' },
    { id: 'in-progress', title: 'In Progress', color: 'border-yellow-500' },
    { id: 'done', title: 'Done', color: 'border-green-500' },
  ];

  const filteredTasks = tasks.filter(task =>
    task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    task.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getTasksByStatus = (status: Task['status']) => {
    return filteredTasks.filter(task => task.status === status);
  };

  const handleCreateTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  };

  const handleEditTask = (taskData: Omit<Task, 'id' | 'createdAt'>) => {
    if (!editingTask) return;
    
    setTasks(prev => prev.map(task =>
      task.id === editingTask.id
        ? { ...task, ...taskData }
        : task
    ));
    setEditingTask(null);
  };

  const handleDeleteTask = (taskId: string) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    setTasks(prev => prev.map(task =>
      task.id === taskId ? { ...task, status: newStatus } : task
    ));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetStatus: Task['status']) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    if (taskId && taskId !== draggedTaskId) {
      handleStatusChange(taskId, targetStatus);
    }
    setDraggedTaskId(null);
  };

  const openCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const openEditModal = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gradient mb-2">Donezo</h1>
            <p className="text-gray-400"><em>Ride the wave of productivity!</em></p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 bg-[#1a1a1a] border-[#2a2a2a] text-white w-full sm:w-64"
              />
            </div>
            <Button
              onClick={openCreateModal}
              className="bg-primary hover:bg-primary/80 text-white button-glow"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Task
            </Button>
          </div>
        </div>

        {/* Task Board */}
        <div className="overflow-x-auto pb-2">
          <div className="flex flex-col gap-6 lg:grid lg:grid-cols-3">
            {columns.map(column => (
              <div
                key={column.id}
                className={`bg-[#111111] rounded-lg p-3 sm:p-4 border-t-2 ${column.color} min-w-[90vw] max-w-full lg:min-w-0 lg:max-w-none min-h-[500px]`}
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, column.id as Task['status'])}
              >
                <div className="flex items-center justify-between mb-3 sm:mb-4">
                  <h2 className="font-semibold text-base sm:text-lg text-white">{column.title}</h2>
                  <span className="bg-[#1a1a1a] text-gray-400 text-xs px-2 py-1 rounded-full">
                    {getTasksByStatus(column.id as Task['status']).length}
                  </span>
                </div>

                <div className="space-y-2 sm:space-y-3">
                  {getTasksByStatus(column.id as Task['status']).map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onEdit={openEditModal}
                      onDelete={handleDeleteTask}
                      onStatusChange={handleStatusChange}
                      isDragging={draggedTaskId === task.id}
                      compact={true}
                    />
                  ))}
                </div>

                {getTasksByStatus(column.id as Task['status']).length === 0 && (
                  <div className="text-center text-gray-500 mt-8">
                    <p>No tasks in {column.title.toLowerCase()}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Task Modal */}
        <TaskModal
          isOpen={isModalOpen}
          onClose={() => {
            setIsModalOpen(false);
            setEditingTask(null);
          }}
          onSave={editingTask ? handleEditTask : handleCreateTask}
          task={editingTask}
          mode={editingTask ? 'edit' : 'create'}
        />
      </div>
    </div>
  );
};

export default TaskBoard;
