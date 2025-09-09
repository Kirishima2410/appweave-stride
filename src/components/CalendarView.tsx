import { useState, useMemo } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { TaskForm } from './TaskForm';
import { TaskItem } from './TaskItem';
import { Task } from '@/hooks/useTasks';
import { format, isSameDay, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { CalendarIcon, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface CalendarViewProps {
  tasks: Task[];
  onAddTask: (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => Promise<void>;
  onUpdateTask: (id: string, updates: Partial<Task>) => Promise<void>;
  onDeleteTask: (id: string) => Promise<void>;
}

export function CalendarView({ tasks, onAddTask, onUpdateTask, onDeleteTask }: CalendarViewProps) {
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  // Get tasks for selected date
  const selectedDateTasks = useMemo(() => {
    return tasks.filter(task => 
      task.due_date && isSameDay(new Date(task.due_date), selectedDate)
    );
  }, [tasks, selectedDate]);

  // Get tasks count for each day in current month
  const monthDays = useMemo(() => {
    const start = startOfMonth(currentMonth);
    const end = endOfMonth(currentMonth);
    const days = eachDayOfInterval({ start, end });
    
    return days.map(day => {
      const dayTasks = tasks.filter(task => 
        task.due_date && isSameDay(new Date(task.due_date), day)
      );
      
      return {
        date: day,
        taskCount: dayTasks.length,
        hasOverdue: dayTasks.some(task => 
          new Date(task.due_date!) < new Date() && !task.completed
        ),
        hasHighPriority: dayTasks.some(task => 
          task.priority === 'high' && !task.completed
        )
      };
    });
  }, [tasks, currentMonth]);

  const handleAddTask = async (taskData: Omit<Task, 'id' | 'user_id' | 'created_at' | 'updated_at'>) => {
    await onAddTask({
      ...taskData,
      due_date: selectedDate.toISOString().split('T')[0]
    });
    setShowTaskForm(false);
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentMonth(prev => {
      const newMonth = new Date(prev);
      if (direction === 'prev') {
        newMonth.setMonth(prev.getMonth() - 1);
      } else {
        newMonth.setMonth(prev.getMonth() + 1);
      }
      return newMonth;
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Calendar View
          </h1>
          <p className="text-muted-foreground mt-1">
            Organize your tasks by date
          </p>
        </div>
        <Button 
          onClick={() => setShowTaskForm(true)}
          className="gradient-primary hover-glow"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Task
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <Card className="glass-card hover-lift lg:col-span-2">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarIcon className="h-5 w-5" />
                {format(currentMonth, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              month={currentMonth}
              onMonthChange={setCurrentMonth}
              className="rounded-md"
              components={{
                DayContent: ({ date }) => {
                  const dayInfo = monthDays.find(d => isSameDay(d.date, date));
                  return (
                    <div className="relative w-full h-full flex flex-col items-center justify-center">
                      <span className="text-sm">{format(date, 'd')}</span>
                      {dayInfo && dayInfo.taskCount > 0 && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          <Badge 
                            variant="secondary" 
                            className={`text-xs px-1 py-0 ${
                              dayInfo.hasOverdue ? 'bg-red-500/20 text-red-500 border-red-500/30' :
                              dayInfo.hasHighPriority ? 'bg-orange-500/20 text-orange-500 border-orange-500/30' :
                              'bg-primary/20 text-primary border-primary/30'
                            }`}
                          >
                            {dayInfo.taskCount}
                          </Badge>
                        </div>
                      )}
                    </div>
                  );
                }
              }}
            />
          </CardContent>
        </Card>

        {/* Selected Date Tasks */}
        <Card className="glass-card hover-lift">
          <CardHeader>
            <CardTitle className="text-lg">
              {format(selectedDate, 'EEEE, MMMM d')}
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              {selectedDateTasks.length} task{selectedDateTasks.length !== 1 ? 's' : ''}
            </p>
          </CardHeader>
          <CardContent>
            <AnimatePresence>
              {selectedDateTasks.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-8 text-muted-foreground"
                >
                  <CalendarIcon className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>No tasks for this date</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowTaskForm(true)}
                    className="mt-2"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </motion.div>
              ) : (
                <div className="space-y-3 custom-scrollbar max-h-96 overflow-y-auto">
                  {selectedDateTasks.map((task, index) => (
                    <motion.div
                      key={task.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <TaskItem
                        task={task}
                        onUpdate={onUpdateTask}
                        onDelete={onDeleteTask}
                        onToggleComplete={async (id: string) => {
                          await onUpdateTask(id, { completed: !task.completed });
                        }}
                      />
                    </motion.div>
                  ))}
                </div>
              )}
            </AnimatePresence>
          </CardContent>
        </Card>
      </div>

      {/* Task Form Modal */}
      <AnimatePresence>
        {showTaskForm && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowTaskForm(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="w-full max-w-md"
            >
              <Card className="glass-card">
                <CardHeader>
                  <CardTitle>Add Task for {format(selectedDate, 'MMMM d, yyyy')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <TaskForm
                    onSubmit={handleAddTask}
                    defaultDueDate={selectedDate.toISOString().split('T')[0]}
                  />
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}