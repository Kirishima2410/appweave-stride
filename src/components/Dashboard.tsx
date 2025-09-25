import { useMemo } from 'react';
import { Calendar, CheckCircle2, Clock, TrendingUp, Target, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Task } from '@/hooks/useTasks';
import { isToday, isYesterday, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns';

interface DashboardProps {
  tasks: Task[];
}

export function Dashboard({ tasks }: DashboardProps) {
  const stats = useMemo(() => {
    const now = new Date();
    const weekStart = startOfWeek(now);
    const weekEnd = endOfWeek(now);

    // Basic counts
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // Today's tasks
    const todayTasks = tasks.filter(task => 
      task.due_date && isToday(new Date(task.due_date))
    );
    const todayCompleted = todayTasks.filter(task => task.completed).length;

    // This week's tasks
    const weekTasks = tasks.filter(task => 
      task.due_date && isWithinInterval(new Date(task.due_date), { start: weekStart, end: weekEnd })
    );
    const weekCompleted = weekTasks.filter(task => task.completed).length;

    // Overdue tasks
    const overdueTasks = tasks.filter(task => 
      task.due_date && 
      new Date(task.due_date) < now && 
      !task.completed
    ).length;

    // High priority tasks
    const highPriorityTasks = tasks.filter(task => 
      task.priority === 'high' && !task.completed
    ).length;

    // Productivity streak (consecutive days with completed tasks)
    const completedTasksByDate = tasks
      .filter(task => task.completed)
      .reduce((acc, task) => {
        const date = new Date(task.updated_at).toDateString();
        acc[date] = (acc[date] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

    let streak = 0;
    let checkDate = new Date();
    
    while (true) {
      const dateStr = checkDate.toDateString();
      if (completedTasksByDate[dateStr]) {
        streak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else if (isToday(checkDate) || isYesterday(checkDate)) {
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      completionRate,
      todayTasks: todayTasks.length,
      todayCompleted,
      weekTasks: weekTasks.length,
      weekCompleted,
      overdueTasks,
      highPriorityTasks,
      streak,
    };
  }, [tasks]);

  const StatCard = ({ 
    title, 
    value, 
    subtitle, 
    icon: Icon, 
    gradient, 
    progress 
  }: {
    title: string;
    value: string | number;
    subtitle?: string;
    icon: any;
    gradient: string;
    progress?: number;
  }) => (
    <Card className="glass-card hover-lift overflow-hidden group">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        <div className={`p-2 rounded-lg ${gradient} group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="h-4 w-4 text-white" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold gradient-primary bg-clip-text text-transparent">
          {value}
        </div>
        {subtitle && (
          <p className="text-xs text-muted-foreground mt-1">
            {subtitle}
          </p>
        )}
        {progress !== undefined && (
          <div className="mt-3">
            <Progress value={progress} className="h-1" />
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold gradient-primary bg-clip-text text-transparent">
            Dashboard
          </h1>
          <p className="text-muted-foreground mt-1">
            Your productivity at a glance
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="gradient-secondary border-primary/20">
            <Zap className="h-3 w-3 mr-1" />
            {stats.streak} day streak
          </Badge>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatCard
          title="Total Tasks"
          value={stats.totalTasks}
          subtitle={`${stats.pendingTasks} pending`}
          icon={Target}
          gradient="gradient-primary"
        />
        
        <StatCard
          title="Completion Rate"
          value={`${Math.round(stats.completionRate)}%`}
          subtitle={`${stats.completedTasks} completed`}
          icon={CheckCircle2}
          gradient="gradient-success"
          progress={stats.completionRate}
        />
        
        <StatCard
          title="Today's Tasks"
          value={`${stats.todayCompleted}/${stats.todayTasks}`}
          subtitle={stats.todayTasks > 0 ? `${Math.round((stats.todayCompleted / stats.todayTasks) * 100)}% done` : 'No tasks today'}
          icon={Calendar}
          gradient="gradient-blue"
          progress={stats.todayTasks > 0 ? (stats.todayCompleted / stats.todayTasks) * 100 : 0}
        />
        
        <StatCard
          title="This Week"
          value={`${stats.weekCompleted}/${stats.weekTasks}`}
          subtitle={stats.weekTasks > 0 ? `${Math.round((stats.weekCompleted / stats.weekTasks) * 100)}% done` : 'No tasks this week'}
          icon={TrendingUp}
          gradient="gradient-purple"
          progress={stats.weekTasks > 0 ? (stats.weekCompleted / stats.weekTasks) * 100 : 0}
        />
      </div>

      {/* Alert Cards */}
      {(stats.overdueTasks > 0 || stats.highPriorityTasks > 0) && (
        <div className="grid gap-4 md:grid-cols-2">
          {stats.overdueTasks > 0 && (
            <Card className="glass-card border-red-500/20 bg-red-500/5">
              <CardHeader className="flex flex-row items-center space-y-0">
                <div className="p-2 rounded-lg bg-red-500 mr-3">
                  <Clock className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-red-500">
                    {stats.overdueTasks} Overdue Task{stats.overdueTasks !== 1 ? 's' : ''}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Review and reschedule these tasks
                  </p>
                </div>
              </CardHeader>
            </Card>
          )}
          
          {stats.highPriorityTasks > 0 && (
            <Card className="glass-card border-orange-500/20 bg-orange-500/5">
              <CardHeader className="flex flex-row items-center space-y-0">
                <div className="p-2 rounded-lg bg-orange-500 mr-3">
                  <Zap className="h-4 w-4 text-white" />
                </div>
                <div>
                  <CardTitle className="text-orange-500">
                    {stats.highPriorityTasks} High Priority Task{stats.highPriorityTasks !== 1 ? 's' : ''}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Focus on these important tasks
                  </p>
                </div>
              </CardHeader>
            </Card>
          )}
        </div>
      )}

      {/* Progress Visualization */}
      <Card className="glass-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Overview
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Overall Completion</span>
              <span className="text-sm text-muted-foreground">
                {stats.completedTasks}/{stats.totalTasks} tasks
              </span>
            </div>
            <Progress value={stats.completionRate} className="h-2" />
            
            <div className="grid grid-cols-3 gap-4 mt-6 pt-4 border-t border-border/50">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-500">{stats.completedTasks}</div>
                <div className="text-xs text-muted-foreground">Completed</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-500">{stats.pendingTasks}</div>
                <div className="text-xs text-muted-foreground">Pending</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-500">{stats.overdueTasks}</div>
                <div className="text-xs text-muted-foreground">Overdue</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}