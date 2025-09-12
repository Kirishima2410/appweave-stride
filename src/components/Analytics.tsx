import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Task } from '@/hooks/useTasks';

interface AnalyticsProps {
  tasks: Task[];
}

export function Analytics({ tasks }: AnalyticsProps) {
  const completedTasks = tasks.filter(task => task.completed).length;
  const totalTasks = tasks.length;
  const completionRate = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      {/* Tasks Chart */}
      <Card className="lg:col-span-2">
        <CardHeader>
          <CardTitle className="text-slate-900">Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-end justify-center gap-4 bg-slate-50 rounded-lg p-6">
            {/* Simplified bar chart */}
            <div className="flex items-end gap-2 h-full">
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
                const height = Math.random() * 80 + 20;
                return (
                  <div key={day} className="flex flex-col items-center">
                    <div 
                      className="w-8 bg-blue-600 rounded-t"
                      style={{ height: `${height}%` }}
                    />
                    <span className="text-xs text-slate-600 mt-2">{day}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Card */}
      <Card className="bg-blue-600 text-white">
        <CardContent className="p-6">
          <div className="space-y-6">
            <div>
              <div className="text-3xl font-bold">50%+</div>
              <div className="text-blue-200">projects</div>
            </div>
            
            <div>
              <div className="text-3xl font-bold">50%+</div>
              <div className="text-blue-200">Tasks</div>
            </div>

            <div className="flex justify-end">
              <div className="w-16 h-16 bg-blue-500 rounded-lg flex items-center justify-center">
                <div className="w-8 h-8 bg-white rounded"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="text-slate-900">Tasks Progress</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Ongoing Project</span>
              <Badge className="bg-blue-100 text-blue-800">18h</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Project Planning</span>
              <Badge className="bg-blue-100 text-blue-800">15h</Badge>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-600">Research</span>
              <Badge className="bg-blue-100 text-blue-800">2h</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Project Cards */}
      <div className="lg:col-span-2 space-y-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">Dashboard Design</h3>
              <Badge variant="outline">50% Complete</Badge>
            </div>
            <Progress value={50} className="mb-3" />
            <div className="flex justify-between text-sm text-slate-600">
              <span>Start Date: 20 Jan</span>
              <span>End Date: 17 Feb</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-slate-900">App UI UX Design</h3>
              <Badge variant="outline">30% Complete</Badge>
            </div>
            <Progress value={30} className="mb-3" />
            <div className="flex justify-between text-sm text-slate-600">
              <span>Start Date: 20 Jan</span>
              <span>End Date: 17 Feb</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}