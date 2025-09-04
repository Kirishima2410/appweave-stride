-- Add category field to tasks table
ALTER TABLE public.tasks 
ADD COLUMN category TEXT;