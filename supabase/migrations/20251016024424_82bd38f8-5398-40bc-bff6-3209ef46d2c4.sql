-- Create verb_forms table for daily verb practice
CREATE TABLE public.verb_forms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  date DATE DEFAULT CURRENT_DATE,
  base_form TEXT NOT NULL,
  base_form_telugu TEXT NOT NULL,
  present_simple TEXT NOT NULL,
  present_continuous TEXT NOT NULL,
  past_simple TEXT NOT NULL,
  past_continuous TEXT NOT NULL,
  future_simple TEXT NOT NULL,
  present_perfect TEXT NOT NULL,
  level TEXT DEFAULT 'beginner',
  category TEXT,
  example_sentence TEXT,
  example_sentence_telugu TEXT
);

-- Enable RLS on verb_forms
ALTER TABLE public.verb_forms ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view verb forms
CREATE POLICY "Anyone can view verb forms"
ON public.verb_forms
FOR SELECT
USING (true);

-- Update lessons table to support AI-generated content
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS description TEXT;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 15;
ALTER TABLE public.lessons ADD COLUMN IF NOT EXISTS order_index INTEGER;

-- Create generated_lessons table to track AI generation
CREATE TABLE public.generated_lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  lesson_type TEXT NOT NULL, -- 'vocabulary', 'verb_forms', 'lesson'
  generation_date DATE DEFAULT CURRENT_DATE,
  level TEXT DEFAULT 'beginner',
  count INTEGER DEFAULT 0,
  UNIQUE(lesson_type, generation_date, level)
);

-- Enable RLS
ALTER TABLE public.generated_lessons ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to view
CREATE POLICY "Anyone can view generated lessons tracking"
ON public.generated_lessons
FOR SELECT
USING (true);

-- Allow system to insert/update
CREATE POLICY "Service role can manage generated lessons"
ON public.generated_lessons
FOR ALL
USING (true)
WITH CHECK (true);