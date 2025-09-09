import { useState, useMemo } from 'react';
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  isSameDay, 
  isSameMonth, 
  isToday,
  addMonths,
  subMonths
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, MapPin } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/hooks/useTasks';

interface CalendarViewProps {
  tasks: Task[];
}

export function CalendarView({ tasks }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  // Generate calendar days
  const calendarDays = useMemo(() => {
    const monthStart = startOfMonth(currentDate);
    const monthEnd = endOfMonth(currentDate);
    const startDate = startOfWeek(monthStart);
    const endDate = endOfWeek(monthEnd);

    const days = [];
    let day = startDate;

    while (day <= endDate) {
      days.push(day);
      day = addDays(day, 1);
    }

    return days;
  }, [currentDate]);

  // Group tasks by date
  const tasksByDate = useMemo(() => {
    const grouped: Record<string, Task[]> = {};
    
    tasks.forEach(task => {
      if (task.due_date) {
        const dateKey = format(new Date(task.due_date), 'yyyy-MM-dd');
        if (!grouped[dateKey]) {
          grouped[dateKey] = [];
        }
        grouped[dateKey].push(task);
      }
    });

    return grouped;
  }, [tasks]);

  // Today's tasks for sidebar
  const todayTasks = useMemo(() => {
    const today = format(new Date(), 'yyyy-MM-dd');
    return tasksByDate[today] || [];
  }, [tasksByDate]);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => 
      direction === 'prev' ? subMonths(prev, 1) : addMonths(prev, 1)
    );
  };

  const getDayTasks = (day: Date) => {
    const dateKey = format(day, 'yyyy-MM-dd');
    return tasksByDate[dateKey] || [];
  };

  const getTaskIndicators = (dayTasks: Task[]) => {
    const indicators = [];
    const maxIndicators = 3;
    
    // Priority order: high -> medium -> low -> completed
    const sortedTasks = dayTasks.sort((a, b) => {
      if (a.completed && !b.completed) return 1;
      if (!a.completed && b.completed) return -1;
      
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - 
             priorityOrder[b.priority as keyof typeof priorityOrder];
    });

    for (let i = 0; i < Math.min(maxIndicators, sortedTasks.length); i++) {
      const task = sortedTasks[i];
      indicators.push(
        <div
          key={task.id}
          className={`task-indicator ${
            task.completed 
              ? 'completed' 
              : `${task.priority}-priority`
          }`}
          style={{
            top: `${8 + i * 6}px`,
            right: '8px',
          }}
          title={`${task.title} - ${task.priority} priority`}
        />
      );
    }

    // Show count if more tasks
    if (sortedTasks.length > maxIndicators) {
      indicators.push(
        <div
          key="more"
          className="absolute top-2 right-2 text-xs bg-primary text-primary-foreground rounded-full w-4 h-4 flex items-center justify-center"
          title={`+${sortedTasks.length - maxIndicators} more tasks`}
        >
          +{sortedTasks.length - maxIndicators}
        </div>
      );
    }

    return indicators;
  };

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="space-y-6">
      {/* Header with Weather Context */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Calendar
          </h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-muted-foreground">
              Your tasks at a glance
            </p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>🌤️ 72°F</span>
              <span>•</span>
              <MapPin className="h-3 w-3" />
              <span>Manila</span>
            </div>
          </div>
        </div>
        <Badge variant="outline" className="gradient-secondary border-primary/20">
          <CalendarIcon className="h-3 w-3 mr-1" />
          {todayTasks.length} tasks today
        </Badge>
      </div>

      <div className="grid lg:grid-cols-4 gap-6">
        {/* Main Calendar */}
        <div className="lg:col-span-3">
          <Card className="glass-card">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
              <CardTitle className="text-2xl font-bold">
                {format(currentDate, 'MMMM yyyy')}
              </CardTitle>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                  className="hover:bg-primary/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setCurrentDate(new Date())}
                  className="px-4 hover:bg-primary/10"
                >
                  Today
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                  className="hover:bg-primary/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Calendar Grid */}
              <div className="space-y-2">
                {/* Week Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                  {weekDays.map(day => (
                    <div
                      key={day}
                      className="p-2 text-center text-sm font-medium text-muted-foreground"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Days */}
                <div className="calendar-grid">
                  {calendarDays.map(day => {
                    const dayTasks = getDayTasks(day);
                    const isCurrentMonth = isSameMonth(day, currentDate);
                    const isDayToday = isToday(day);

                    return (
                      <div
                        key={day.toString()}
                        className={`calendar-day ${
                          isDayToday ? 'today' : ''
                        } ${!isCurrentMonth ? 'other-month' : ''}`}
                      >
                        <div className="font-medium text-sm">
                          {format(day, 'd')}
                        </div>
                        
                        {/* Task Indicators */}
                        {getTaskIndicators(dayTasks)}
                        
                        {/* Task List for current month days with tasks */}
                        {isCurrentMonth && dayTasks.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {dayTasks.slice(0, 2).map(task => (
                              <div
                                key={task.id}
                                className={`text-xs p-1 rounded truncate ${
                                  task.completed
                                    ? 'bg-success/10 text-success border border-success/20'
                                    : task.priority === 'high'
                                    ? 'bg-destructive/10 text-destructive border border-destructive/20'
                                    : task.priority === 'medium'
                                    ? 'bg-warning/10 text-warning border border-warning/20'
                                    : 'bg-success/10 text-success border border-success/20'
                                }`}
                                title={task.title}
                              >
                                {task.title}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today's Schedule Sidebar */}
        <div className="space-y-6">
          {/* Today's Tasks */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-lg">
                <Clock className="h-4 w-4" />
                Today's Schedule
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayTasks.length === 0 ? (
                <div className="text-center py-8">
                  <CalendarIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                  <p className="text-muted-foreground">No tasks scheduled for today</p>
                  <p className="text-xs text-muted-foreground mt-1">Enjoy your free time!</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {todayTasks.map(task => (
                    <div
                      key={task.id}
                      className={`p-3 rounded-lg border transition-all hover:shadow-md ${
                        task.completed
                          ? 'bg-success/5 border-success/20'
                          : task.priority === 'high'
                          ? 'bg-destructive/5 border-destructive/20'
                          : task.priority === 'medium'
                          ? 'bg-warning/5 border-warning/20'
                          : 'bg-muted/50 border-border'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1">
                          <h4 className={`font-medium text-sm ${task.completed ? 'line-through text-muted-foreground' : ''}`}>
                            {task.title}
                          </h4>
                          {task.description && (
                            <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                              {task.description}
                            </p>
                          )}
                          <div className="flex items-center gap-2 mt-2">
                            <Badge
                              variant="outline"
                              className={`text-xs ${
                                task.priority === 'high'
                                  ? 'border-destructive/50 text-destructive'
                                  : task.priority === 'medium'
                                  ? 'border-warning/50 text-warning'
                                  : 'border-success/50 text-success'
                              }`}
                            >
                              {task.priority}
                            </Badge>
                            {task.category && (
                              <Badge variant="secondary" className="text-xs">
                                {task.category}
                              </Badge>
                            )}
                          </div>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${
                          task.completed
                            ? 'bg-success'
                            : task.priority === 'high'
                            ? 'bg-destructive'
                            : task.priority === 'medium'
                            ? 'bg-warning'
                            : 'bg-success'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card className="glass-card">
            <CardHeader>
              <CardTitle className="text-lg">Quick Stats</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">This Month</span>
                  <span className="font-semibold">
                    {Object.values(tasksByDate)
                      .flat()
                      .filter(task => 
                        isSameMonth(new Date(task.due_date!), currentDate)
                      ).length} tasks
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Completed</span>
                  <span className="font-semibold text-success">
                    {Object.values(tasksByDate)
                      .flat()
                      .filter(task => 
                        task.completed && 
                        isSameMonth(new Date(task.due_date!), currentDate)
                      ).length}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">High Priority</span>
                  <span className="font-semibold text-destructive">
                    {Object.values(tasksByDate)
                      .flat()
                      .filter(task => 
                        task.priority === 'high' && 
                        !task.completed &&
                        isSameMonth(new Date(task.due_date!), currentDate)
                      ).length}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}