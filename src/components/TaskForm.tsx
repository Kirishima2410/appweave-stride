import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CreateTaskData } from '@/hooks/useTasks';
import { Plus, Sparkles } from 'lucide-react';

interface TaskFormProps {
  onSubmit: (data: CreateTaskData) => Promise<void>;
  loading?: boolean;
  defaultDueDate?: string;
}

export function TaskForm({ onSubmit, loading, defaultDueDate }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskData>({
    title: '',
    description: '',
    priority: 'medium',
    due_date: defaultDueDate || '',
    category: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    
    try {
      await onSubmit({
        ...formData,
        description: formData.description || undefined,
        due_date: formData.due_date || undefined,
        category: formData.category || undefined,
      });
      setFormData({
        title: '',
        description: '',
        priority: 'medium',
        due_date: defaultDueDate || '',
        category: '',
      });
    } catch (error) {
      // Error is handled in the hook
    }
  };

  return (
    <Card className="glass-card hover-lift">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl gradient-primary bg-clip-text text-transparent">
          <Sparkles className="h-5 w-5 text-primary" />
          Quick Add Task
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-medium">Task Title *</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              placeholder="What needs to be done?"
              required
              className="glass border-primary/20 focus:border-primary/40 transition-colors"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-medium">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Add some details... (optional)"
              rows={3}
              className="glass border-primary/20 focus:border-primary/40 transition-colors resize-none"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category" className="text-sm font-medium">Category</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="Work, Personal, Shopping..."
              className="glass border-primary/20 focus:border-primary/40 transition-colors"
            />
          </div>

          <div className="grid grid-cols-1 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Priority Level</Label>
              <Select
                value={formData.priority}
                onValueChange={(value: string) => 
                  setFormData(prev => ({ ...prev, priority: value }))
                }
              >
                <SelectTrigger className="glass border-primary/20 focus:border-primary/40 transition-colors">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="glass-card">
                  <SelectItem value="low" className="flex items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-green-500"></div>
                      Low Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="medium" className="flex items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-orange-500"></div>
                      Medium Priority
                    </span>
                  </SelectItem>
                  <SelectItem value="high" className="flex items-center">
                    <span className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-red-500"></div>
                      High Priority
                    </span>
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="due_date" className="text-sm font-medium">Due Date & Time</Label>
              <Input
                id="due_date"
                type="datetime-local"
                value={formData.due_date}
                onChange={(e) => setFormData(prev => ({ ...prev, due_date: e.target.value }))}
                className="glass border-primary/20 focus:border-primary/40 transition-colors"
              />
            </div>
          </div>

          <Button 
            type="submit" 
            disabled={loading || !formData.title.trim()} 
            className="w-full gradient-primary hover-glow shadow-lg transition-all duration-300 disabled:opacity-50"
          >
            <Plus className="h-4 w-4 mr-2" />
            {loading ? 'Creating Task...' : 'Create Task'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}