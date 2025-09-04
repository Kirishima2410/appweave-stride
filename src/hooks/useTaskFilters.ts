import { useState, useMemo } from 'react';
import { Task } from '@/hooks/useTasks';
import { isPast } from 'date-fns';

export interface TaskFilters {
  search: string;
  priority: string;
  status: string;
  category: string;
  dueDateSort: string;
}

export function useTaskFilters(tasks: Task[]) {
  const [filters, setFilters] = useState<TaskFilters>({
    search: '',
    priority: 'all',
    status: 'all',
    category: 'all',
    dueDateSort: 'none'
  });

  const categories = useMemo(() => {
    const uniqueCategories = new Set(
      tasks.filter(task => task.category).map(task => task.category!)
    );
    return Array.from(uniqueCategories).sort();
  }, [tasks]);

  const filteredTasks = useMemo(() => {
    let filtered = [...tasks];

    // Search filter
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(searchLower) ||
        task.description?.toLowerCase().includes(searchLower) ||
        task.category?.toLowerCase().includes(searchLower)
      );
    }

    // Priority filter
    if (filters.priority !== 'all') {
      filtered = filtered.filter(task => task.priority === filters.priority);
    }

    // Status filter
    if (filters.status !== 'all') {
      switch (filters.status) {
        case 'completed':
          filtered = filtered.filter(task => task.completed);
          break;
        case 'pending':
          filtered = filtered.filter(task => !task.completed);
          break;
        case 'overdue':
          filtered = filtered.filter(task => 
            !task.completed && 
            task.due_date && 
            isPast(new Date(task.due_date))
          );
          break;
      }
    }

    // Category filter
    if (filters.category !== 'all') {
      filtered = filtered.filter(task => task.category === filters.category);
    }

    // Due date sorting
    if (filters.dueDateSort !== 'none') {
      filtered.sort((a, b) => {
        if (!a.due_date && !b.due_date) return 0;
        if (!a.due_date) return 1;
        if (!b.due_date) return -1;

        const dateA = new Date(a.due_date).getTime();
        const dateB = new Date(b.due_date).getTime();

        return filters.dueDateSort === 'soonest' ? dateA - dateB : dateB - dateA;
      });
    }

    return filtered;
  }, [tasks, filters]);

  return {
    filters,
    setFilters,
    filteredTasks,
    categories
  };
}