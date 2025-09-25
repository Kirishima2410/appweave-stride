import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, BarChart3, ListTodo, Calendar } from 'lucide-react';
import { TaskForm } from '@/components/TaskForm';
import { TaskList } from '@/components/TaskList';
import { Header } from '@/components/Header';
import { Dashboard } from '@/components/Dashboard';
import { CalendarView } from '@/components/CalendarView';
import { useTasks } from '@/hooks/useTasks';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask, toggleTaskComplete } = useTasks();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);

  useEffect(() => {
    // Redirect unauthenticated users to auth page
    if (!user && !authLoading) {
      navigate('/auth', { replace: true });
    }
  }, [user, authLoading, navigate]);

  const handleCreateTask = async (taskData: any) => {
    await createTask(taskData);
    setShowTaskForm(false);
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading your workspace...</p>
        </div>
      </div>
    );
  }

  // Don't render if user is not authenticated (prevents flash)
  if (!user) {
    return null;
  }

  if (tasksLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-8 max-w-7xl">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your tasks...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8 max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header Section */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-4xl font-bold gradient-primary bg-clip-text text-transparent">
                Welcome back, {user.email?.split('@')[0]}
              </h1>
              <p className="text-muted-foreground mt-2">
                Ready to conquer your goals today?
              </p>
            </div>
            
            <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
              <DialogTrigger asChild>
                <Button className="gradient-primary hover-glow shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  New Task
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px] glass-card">
                <DialogHeader>
                  <DialogTitle className="text-xl gradient-primary bg-clip-text text-transparent">
                    Create New Task
                  </DialogTitle>
                </DialogHeader>
                <TaskForm onSubmit={handleCreateTask} />
              </DialogContent>
            </Dialog>
          </div>

          {/* Main Content */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="glass border border-border/50 p-1 h-auto">
              <TabsTrigger 
                value="dashboard" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <BarChart3 className="h-4 w-4" />
                Dashboard
              </TabsTrigger>
              <TabsTrigger 
                value="calendar"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Calendar className="h-4 w-4" />
                Calendar
              </TabsTrigger>
              <TabsTrigger 
                value="tasks"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <ListTodo className="h-4 w-4" />
                Tasks ({tasks.length})
              </TabsTrigger>
            </TabsList>

            <AnimatePresence mode="wait">
              <TabsContent value="dashboard" className="mt-6">
                <motion.div
                  key="dashboard"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <Dashboard tasks={tasks} />
                </motion.div>
              </TabsContent>

              <TabsContent value="calendar" className="mt-6">
                <motion.div
                  key="calendar"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <CalendarView tasks={tasks} />
                </motion.div>
              </TabsContent>

              <TabsContent value="tasks" className="mt-6">
                <motion.div
                  key="tasks"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <TaskList
                    tasks={tasks}
                    onUpdate={updateTask}
                    onDelete={deleteTask}
                    onToggleComplete={toggleTaskComplete}
                  />
                </motion.div>
              </TabsContent>
            </AnimatePresence>
          </Tabs>
        </motion.div>
      </main>

      {/* Floating Action Button for Mobile */}
      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogTrigger asChild>
          <Button className="fab md:hidden">
            <Plus className="h-6 w-6" />
          </Button>
        </DialogTrigger>
      </Dialog>
    </div>
  );
};

export default Index;
