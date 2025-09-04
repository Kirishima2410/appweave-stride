import { TaskItem } from './TaskItem';
import { TaskFiltersComponent } from './TaskFilters';
import { Task, UpdateTaskData } from '@/hooks/useTasks';
import { useTaskFilters } from '@/hooks/useTaskFilters';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { isPast } from 'date-fns';

interface TaskListProps {
  tasks: Task[];
  onUpdate: (id: string, updates: UpdateTaskData) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onToggleComplete: (id: string) => Promise<void>;
}

export function TaskList({ tasks, onUpdate, onDelete, onToggleComplete }: TaskListProps) {
  const { filters, setFilters, filteredTasks, categories } = useTaskFilters(tasks);
  
  const completedTasks = filteredTasks.filter(task => task.completed);
  const pendingTasks = filteredTasks.filter(task => !task.completed);
  const highPriorityTasks = pendingTasks.filter(task => task.priority === 'high');
  const overdueTasks = pendingTasks.filter(task => 
    task.due_date && isPast(new Date(task.due_date))
  );

  if (tasks.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p>No tasks yet. Create your first task above!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <TaskFiltersComponent
        filters={filters}
        onFiltersChange={setFilters}
        categories={categories}
      />

      <div className="flex flex-wrap gap-2 text-sm">
        <Badge variant="secondary">{pendingTasks.length} Pending</Badge>
        <Badge variant="outline">{completedTasks.length} Completed</Badge>
        {highPriorityTasks.length > 0 && (
          <Badge variant="destructive">{highPriorityTasks.length} High Priority</Badge>
        )}
        {overdueTasks.length > 0 && (
          <Badge variant="destructive">{overdueTasks.length} Overdue</Badge>
        )}
      </div>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all">All ({filteredTasks.length})</TabsTrigger>
          <TabsTrigger value="pending">Pending ({pendingTasks.length})</TabsTrigger>
          <TabsTrigger value="completed">Completed ({completedTasks.length})</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-3">
          {filteredTasks.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No tasks match your filters.</p>
          ) : (
            filteredTasks.map(task => (
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
        
        <TabsContent value="pending" className="space-y-3">
          {pendingTasks.length === 0 ? (
            <p className="text-center py-4 text-muted-foreground">No pending tasks match your filters.</p>
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
            <p className="text-center py-4 text-muted-foreground">No completed tasks match your filters.</p>
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