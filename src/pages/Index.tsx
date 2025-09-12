import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useTasks } from '@/hooks/useTasks';
import { Sidebar } from '@/components/Sidebar';
import { WelcomeSection } from '@/components/WelcomeSection';
import { Analytics } from '@/components/Analytics';
import { ProfileSection } from '@/components/ProfileSection';
import { Dashboard } from '@/components/Dashboard';
import { CalendarView } from '@/components/CalendarView';
import { TaskList } from '@/components/TaskList';
import { TaskForm } from '@/components/TaskForm';
import { Button } from '@/components/ui/button';
import { Search, Calendar } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { toast } from 'sonner';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading: tasksLoading, createTask, updateTask, deleteTask, toggleTaskComplete } = useTasks();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [showTaskForm, setShowTaskForm] = useState(false);
  const navigate = useNavigate();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    navigate('/auth');
    return null;
  }

  if (tasksLoading) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  const handleCreateTask = async (taskData: any) => {
    try {
      await createTask(taskData);
      setShowTaskForm(false);
      toast.success('Task created successfully!');
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Failed to create task');
    }
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <div className="space-y-6">
            <WelcomeSection />
            <Analytics tasks={tasks} />
          </div>
        );
      case 'tracking':
        return <CalendarView tasks={tasks} />;
      case 'projects':
        return <TaskList 
          tasks={tasks} 
          onUpdate={updateTask}
          onDelete={deleteTask}
          onToggleComplete={toggleTaskComplete}
        />;
      case 'history':
        return <Dashboard tasks={tasks} />;
      default:
        return (
          <div className="space-y-6">
            <WelcomeSection />
            <Analytics tasks={tasks} />
          </div>
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-100">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        onTabChange={setActiveTab}
        onCreateTask={() => setShowTaskForm(true)}
      />
      
      {/* Main Content */}
      <div className="flex-1 flex">
        <div className="flex-1 overflow-auto">
          {/* Header */}
          <div className="bg-white border-b border-slate-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  {activeTab === 'dashboard' ? 'Dashboard' : 
                   activeTab === 'tracking' ? 'Tracking' :
                   activeTab === 'projects' ? 'Projects' :
                   activeTab === 'history' ? 'Work History' : 'Dashboard'}
                </h1>
                <p className="text-slate-500 text-sm">13 March 2021</p>
              </div>
              
              <div className="flex items-center gap-4">
                {/* Search */}
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                  <Input 
                    placeholder="Search" 
                    className="pl-10 w-80 bg-slate-50 border-slate-200"
                  />
                </div>
                
                {/* Date */}
                <Button variant="outline" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  13 March 2021
                </Button>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="p-6">
            {renderContent()}
          </div>
        </div>
        
        {/* Right Profile Section */}
        <ProfileSection />
      </div>

      {/* Task Form Modal */}
      <Dialog open={showTaskForm} onOpenChange={setShowTaskForm}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="text-xl text-slate-900">Create New Task</DialogTitle>
          </DialogHeader>
          <TaskForm onSubmit={handleCreateTask} />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;
