import { 
  LayoutDashboard, 
  BarChart3, 
  FolderOpen, 
  Clock, 
  Wrench, 
  Mail, 
  Settings,
  Plus,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onCreateTask: () => void;
}

export function Sidebar({ activeTab, onTabChange, onCreateTask }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tracking', label: 'Tracking', icon: BarChart3 },
    { id: 'projects', label: 'Projects', icon: FolderOpen },
    { id: 'history', label: 'Work History', icon: Clock },
  ];

  const toolItems = [
    { id: 'inbox', label: 'Inbox', icon: Mail },
    { id: 'settings', label: 'Setting', icon: Settings },
  ];

  return (
    <div className="w-64 h-screen bg-slate-900 text-white flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <div className="w-5 h-5 bg-white rounded-sm"></div>
          </div>
          <span className="text-xl font-semibold">Tasky.io</span>
        </div>
      </div>

      {/* Project Section */}
      <div className="p-6 border-b border-slate-700">
        <div className="text-sm text-slate-400 mb-3">Project</div>
        <Button variant="outline" className="w-full justify-start text-slate-300 border-slate-600 hover:bg-slate-700">
          Hope project
        </Button>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        {/* Main Menu */}
        <nav className="space-y-1 mb-8">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            
            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`
                  w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors
                  ${isActive 
                    ? 'bg-blue-600 text-white' 
                    : 'text-slate-300 hover:bg-slate-700 hover:text-white'
                  }
                `}
              >
                <Icon className="h-5 w-5" />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Tools Section */}
        <div>
          <div className="text-sm text-slate-400 mb-3">Tools</div>
          <nav className="space-y-1">
            {toolItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <button
                  key={item.id}
                  onClick={() => onTabChange(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left text-slate-300 hover:bg-slate-700 hover:text-white transition-colors"
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Add Task Button */}
      <div className="p-4 border-t border-slate-700">
        <Button 
          onClick={onCreateTask}
          className="w-full bg-blue-600 hover:bg-blue-700 flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          ADD NEW TASK
        </Button>
      </div>

      {/* User Profile */}
      <div className="p-4 border-t border-slate-700">
        <div className="flex items-center gap-3">
          <Avatar>
            <AvatarFallback className="bg-blue-600 text-white">JM</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium text-white truncate">JOE MAX</div>
            <div className="text-xs text-slate-400">TEAM LEADER</div>
          </div>
        </div>
      </div>
    </div>
  );
}