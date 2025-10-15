-- Create user profiles table
CREATE TABLE IF NOT EXISTS public.user_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID UNIQUE,
  level TEXT DEFAULT 'beginner' CHECK (level IN ('beginner', 'intermediate', 'advanced')),
  total_words_learned INTEGER DEFAULT 0,
  total_practice_time INTEGER DEFAULT 0,
  streak_days INTEGER DEFAULT 0,
  last_practice_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create vocabulary table
CREATE TABLE IF NOT EXISTS public.vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  english TEXT NOT NULL,
  telugu TEXT NOT NULL,
  pronunciation TEXT,
  part_of_speech TEXT,
  level TEXT DEFAULT 'beginner',
  examples JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user vocabulary progress
CREATE TABLE IF NOT EXISTS public.user_vocabulary (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  vocabulary_id UUID REFERENCES public.vocabulary(id) ON DELETE CASCADE,
  learned BOOLEAN DEFAULT false,
  favorite BOOLEAN DEFAULT false,
  practice_count INTEGER DEFAULT 0,
  last_practiced TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(user_id, vocabulary_id)
);

-- Create daily sentences table
CREATE TABLE IF NOT EXISTS public.daily_sentences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  english TEXT NOT NULL,
  telugu TEXT NOT NULL,
  level TEXT DEFAULT 'beginner',
  category TEXT,
  date DATE DEFAULT CURRENT_DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create user mistakes for learning
CREATE TABLE IF NOT EXISTS public.user_mistakes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  mistake_type TEXT,
  original_text TEXT,
  corrected_text TEXT,
  explanation TEXT,
  frequency INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS public.lessons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID,
  title TEXT NOT NULL,
  content JSONB NOT NULL,
  level TEXT,
  completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_vocabulary ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.daily_sentences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_mistakes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lessons ENABLE ROW LEVEL SECURITY;

-- RLS Policies for user_profiles
CREATE POLICY "Users can view their own profile" ON public.user_profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile" ON public.user_profiles FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own profile" ON public.user_profiles FOR UPDATE USING (true);

-- RLS Policies for vocabulary (public read)
CREATE POLICY "Anyone can view vocabulary" ON public.vocabulary FOR SELECT USING (true);

-- RLS Policies for user_vocabulary
CREATE POLICY "Users can view their vocabulary progress" ON public.user_vocabulary FOR SELECT USING (true);
CREATE POLICY "Users can insert their vocabulary progress" ON public.user_vocabulary FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their vocabulary progress" ON public.user_vocabulary FOR UPDATE USING (true);

-- RLS Policies for daily_sentences (public read)
CREATE POLICY "Anyone can view daily sentences" ON public.daily_sentences FOR SELECT USING (true);

-- RLS Policies for user_mistakes
CREATE POLICY "Users can view their mistakes" ON public.user_mistakes FOR SELECT USING (true);
CREATE POLICY "Users can insert their mistakes" ON public.user_mistakes FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their mistakes" ON public.user_mistakes FOR UPDATE USING (true);

-- RLS Policies for lessons
CREATE POLICY "Users can view their lessons" ON public.lessons FOR SELECT USING (true);
CREATE POLICY "Users can insert their lessons" ON public.lessons FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their lessons" ON public.lessons FOR UPDATE USING (true);

-- Insert sample vocabulary
INSERT INTO public.vocabulary (english, telugu, pronunciation, part_of_speech, level, examples) VALUES
('Hello', 'హలో / నమస్కారం', 'huh-loh', 'interjection', 'beginner', '["Hello! How are you?", "Hello, nice to meet you."]'::jsonb),
('Thank you', 'ధన్యవాదాలు', 'dhan-ya-vaa-daa-lu', 'phrase', 'beginner', '["Thank you for your help!", "Thank you very much."]'::jsonb),
('Go', 'వెళ్ళు', 'vel-lu', 'verb', 'beginner', '["I go to school.", "Let us go together."]'::jsonb),
('Eat', 'తిను', 'ti-nu', 'verb', 'beginner', '["I eat rice.", "We eat dinner at 8 PM."]'::jsonb),
('Learn', 'నేర్చుకో', 'ner-chu-ko', 'verb', 'beginner', '["I learn English.", "She learns quickly."]'::jsonb),
('Speak', 'మాట్లాడు', 'maat-laa-du', 'verb', 'beginner', '["I speak English.", "He speaks Telugu."]'::jsonb),
('Beautiful', 'అందమైన', 'an-da-mai-na', 'adjective', 'intermediate', '["What a beautiful day!", "She has a beautiful smile."]'::jsonb),
('Important', 'ముఖ్యమైన', 'mukh-ya-mai-na', 'adjective', 'intermediate', '["This is very important.", "Education is important."]'::jsonb);

-- Insert daily sentences
INSERT INTO public.daily_sentences (english, telugu, level, category) VALUES
('Good morning! How are you today?', 'శుభోదయం! మీరు ఈరోజు ఎలా ఉన్నారు?', 'beginner', 'greetings'),
('I am learning English every day.', 'నేను ప్రతిరోజూ ఇంగ్లీష్ నేర్చుకుంటున్నాను.', 'beginner', 'daily_life'),
('Practice makes perfect.', 'అభ్యాసం పరిపూర్ణతను తెస్తుంది.', 'intermediate', 'motivation'),
('Can you help me with this?', 'దీనిలో మీరు నాకు సహాయం చేయగలరా?', 'beginner', 'requests');