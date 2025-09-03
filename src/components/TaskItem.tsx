import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Trash2, Edit, Save, X, Calendar } from 'lucide-react';
import { Task, UpdateTaskData } from '@/hooks/useTasks';
import { format } from 'date-fns';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: UpdateTaskData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string) => Promise<void>;
}

export function TaskItem({ task, onUpdate, onDelete, onToggleComplete }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    title: task.title,
    description: task.description || '',
    priority: task.priority,
    due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
  });

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'destructive';
      case 'medium': return 'secondary';
      case 'low': return 'outline';
      default: return 'secondary';
    }
  };

  const handleSave = async () => {
    try {
        await onUpdate(task.id, {
        title: editData.title,
        description: editData.description || null,
        priority: editData.priority,
        due_date: editData.due_date || null,
      });
      setIsEditing(false);
    } catch (error) {
      // Error is handled in the hook
    }
  };

  const handleCancel = () => {
    setEditData({
      title: task.title,
      description: task.description || '',
      priority: task.priority,
      due_date: task.due_date ? new Date(task.due_date).toISOString().slice(0, 16) : '',
    });
    setIsEditing(false);
  };

  return (
    <Card className={`transition-all ${task.completed ? 'opacity-60' : ''}`}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <Checkbox
            checked={task.completed}
            onCheckedChange={() => onToggleComplete(task.id)}
            className="mt-1"
          />
          
          <div className="flex-1 space-y-2">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editData.title}
                  onChange={(e) => setEditData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="Task title"
                />
                <Textarea
                  value={editData.description}
                  onChange={(e) => setEditData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Task description"
                  rows={2}
                />
                <div className="grid grid-cols-2 gap-2">
                  <Select
                    value={editData.priority}
                    onValueChange={(value: string) => 
                      setEditData(prev => ({ ...prev, priority: value }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                  <Input
                    type="datetime-local"
                    value={editData.due_date}
                    onChange={(e) => setEditData(prev => ({ ...prev, due_date: e.target.value }))}
                  />
                </div>
              </div>
            ) : (
              <div>
                <h3 className={`font-medium ${task.completed ? 'line-through' : ''}`}>
                  {task.title}
                </h3>
                {task.description && (
                  <p className={`text-sm text-muted-foreground ${task.completed ? 'line-through' : ''}`}>
                    {task.description}
                  </p>
                )}
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant={getPriorityColor(task.priority)}>
                    {task.priority}
                  </Badge>
                  {task.due_date && (
                    <div className="flex items-center gap-1 text-xs text-muted-foreground">
                      <Calendar className="w-3 h-3" />
                      {format(new Date(task.due_date), 'MMM dd, yyyy HH:mm')}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="flex gap-1">
            {isEditing ? (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={handleSave}
                  disabled={!editData.title.trim()}
                >
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="ghost" onClick={handleCancel}>
                  <X className="w-4 h-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => setIsEditing(true)}
                  disabled={task.completed}
                >
                  <Edit className="w-4 h-4" />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => onDelete(task.id)}
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}