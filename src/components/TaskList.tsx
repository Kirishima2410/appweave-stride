import { TaskItem } from './TaskItem';
import { Task, UpdateTaskData } from '@/hooks/useTasks';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, updates: UpdateTaskData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string) => Promise<void>;
}

export function TaskList({ tasks, onUpdate, onDelete, onToggleComplete }: TaskListProps) {
  const completedTasks = tasks.filter(task => task.completed);
  const pendingTasks = tasks.filter(task => !task.completed);
  const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No tasks yet. Create your first task above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-4 text-sm">
        <div className="flex items-center gap-2">
          <Badge variant="secondary">{pendingTasks.length} Pending</Badge>
          <Badge variant="outline">{completedTasks.length} Completed</Badge>
          {highPriorityTasks.length > 0 && (
            <Badge variant="destructive">{highPriorityTasks.length} High Priority</Badge>
          )}
        </div>
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All Tasks ({tasks.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-3">
          {tasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdate={onUpdate}
              onDelete={onDelete}
              onToggleComplete={onToggleComplete}
            />
          ))}
        </TabsContent>
        
        <TabsContent value="pending" className="space-y-3">
          {pendingTasks.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No pending tasks!</p>
          ) : (
            pendingTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="space-y-3">
          {completedTasks.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No completed tasks yet.</p>
          ) : (
            completedTasks.map(task => (
              <TaskItem
                key={task.id}
                task={task}
                onUpdate={onUpdate}
                onDelete={onDelete}
                onToggleComplete={onToggleComplete}
              />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}