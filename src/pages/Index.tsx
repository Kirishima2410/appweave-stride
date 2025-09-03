import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { useTasks } from '@/hooks/useTasks';
import { CheckSquare, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

const Index = () => {
  const { tasks, loading, createTask, updateTask, deleteTask, toggleTaskComplete } = useTasks();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <CheckSquare className="w-8 h-8 text-primary" />
            <h1 className="text-3xl font-bold">Task Manager</h1>
          </div>
          <p className="text-muted-foreground">
            Organize your tasks and boost your productivity
          </p>
        </div>

        <Alert className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Note: This app requires authentication to work properly. Make sure you're signed in to view and manage your tasks.
          </AlertDescription>
        </Alert>

        <div className="grid gap-8 lg:grid-cols-3">
          <div className="lg:col-span-1">
            <TaskForm onSubmit={createTask} />
          </div>
          
          <div className="lg:col-span-2">
            <TaskList
              tasks={tasks}
              onUpdate={updateTask}
              onDelete={deleteTask}
              onToggleComplete={toggleTaskComplete}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
