import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MessageCircle } from 'lucide-react';

export function ProfileSection() {
  const projects = [
    { name: 'Hope', type: 'UI/UX Design', progress: 50, color: 'bg-slate-400' },
    { name: 'Gore', type: 'UX Research', progress: 50, color: 'bg-blue-600' },
  ];

  const messages = [
    { name: 'Charles Shown', message: "Let's continue this quite delightful...", time: '12:03 PM', avatar: 'CS' },
    { name: 'Parth Surt', message: "I'm quite curious about...", time: '09:47 PM', avatar: 'PS' },
    { name: 'Milton Lam', message: "I think making the UI interface design...", time: '9:09 AM', avatar: 'ML' },
    { name: 'Raghav Chandra', message: "Morning management for any features of...", time: '6:09 AM', avatar: 'RC' },
  ];

  return (
    <div className="w-80 bg-slate-50 p-6 space-y-6">
      {/* Profile Card */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium">profile</CardTitle>
            <span className="text-xs text-slate-500">70% completed your profile</span>
          </div>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="flex flex-col items-center text-center">
            <Avatar className="w-20 h-20 mb-4">
              <AvatarFallback className="bg-blue-600 text-white text-xl">MF</AvatarFallback>
            </Avatar>
            <h3 className="font-semibold text-slate-900">Mirha Fatima</h3>
            <p className="text-sm text-slate-500">UI/UX Designer</p>
          </div>
        </CardContent>
      </Card>

      {/* Current Projects */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium text-slate-900">Current Projects</CardTitle>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {projects.map((project, index) => (
            <div key={index} className="flex items-center gap-3">
              <div className={`w-12 h-12 ${project.color} rounded-lg flex items-center justify-center text-white font-semibold`}>
                {project.progress}%
              </div>
              <div className="flex-1">
                <div className="font-medium text-slate-900">{project.name}</div>
                <div className="text-xs text-slate-500">{project.type}</div>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Messages */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-slate-900">Messages</CardTitle>
            <Button variant="ghost" size="sm" className="text-xs text-blue-600">
              View all
            </Button>
          </div>
        </CardHeader>
        <CardContent className="pt-0 space-y-3">
          {messages.map((msg, index) => (
            <div key={index} className="flex items-start gap-3">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="bg-blue-600 text-white text-xs">
                  {msg.avatar}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-900">{msg.name}</span>
                  <span className="text-xs text-slate-500">{msg.time}</span>
                </div>
                <p className="text-xs text-slate-600 truncate">{msg.message}</p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Illustration */}
      <div className="flex justify-end">
        <div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-50 rounded-lg flex items-center justify-center">
          <div className="text-blue-600">
            <MessageCircle className="h-8 w-8" />
          </div>
        </div>
      </div>
    </div>
  );
}