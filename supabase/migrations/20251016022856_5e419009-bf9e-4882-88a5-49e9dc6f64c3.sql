-- Fix RLS policies to use proper auth.uid() checks instead of true
-- Also make user_id columns NOT NULL and add foreign key constraints

-- 1. Make user_id columns NOT NULL (existing data should be fine)
ALTER TABLE public.user_profiles ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.user_vocabulary ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.user_mistakes ALTER COLUMN user_id SET NOT NULL;
ALTER TABLE public.lessons ALTER COLUMN user_id SET NOT NULL;

-- 2. Add foreign key constraints with CASCADE delete
ALTER TABLE public.user_profiles
  ADD CONSTRAINT user_profiles_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.user_vocabulary
  ADD CONSTRAINT user_vocabulary_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.user_mistakes
  ADD CONSTRAINT user_mistakes_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

ALTER TABLE public.lessons
  ADD CONSTRAINT lessons_user_id_fkey 
  FOREIGN KEY (user_id) 
  REFERENCES auth.users(id) 
  ON DELETE CASCADE;

-- 3. Fix user_profiles RLS policies
DROP POLICY IF EXISTS "Users can view their own profile" ON public.user_profiles;
CREATE POLICY "Users can view their own profile" 
  ON public.user_profiles 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.user_profiles;
CREATE POLICY "Users can insert their own profile" 
  ON public.user_profiles 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.user_profiles;
CREATE POLICY "Users can update their own profile" 
  ON public.user_profiles 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 4. Fix user_vocabulary RLS policies
DROP POLICY IF EXISTS "Users can view their vocabulary progress" ON public.user_vocabulary;
CREATE POLICY "Users can view their vocabulary progress" 
  ON public.user_vocabulary 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their vocabulary progress" ON public.user_vocabulary;
CREATE POLICY "Users can insert their vocabulary progress" 
  ON public.user_vocabulary 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their vocabulary progress" ON public.user_vocabulary;
CREATE POLICY "Users can update their vocabulary progress" 
  ON public.user_vocabulary 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 5. Fix user_mistakes RLS policies
DROP POLICY IF EXISTS "Users can view their mistakes" ON public.user_mistakes;
CREATE POLICY "Users can view their mistakes" 
  ON public.user_mistakes 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their mistakes" ON public.user_mistakes;
CREATE POLICY "Users can insert their mistakes" 
  ON public.user_mistakes 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their mistakes" ON public.user_mistakes;
CREATE POLICY "Users can update their mistakes" 
  ON public.user_mistakes 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Fix lessons RLS policies
DROP POLICY IF EXISTS "Users can view their lessons" ON public.lessons;
CREATE POLICY "Users can view their lessons" 
  ON public.lessons 
  FOR SELECT 
  USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can insert their lessons" ON public.lessons;
CREATE POLICY "Users can insert their lessons" 
  ON public.lessons 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update their lessons" ON public.lessons;
CREATE POLICY "Users can update their lessons" 
  ON public.lessons 
  FOR UPDATE 
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 7. Create trigger to auto-create user profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_profiles (user_id, level)
  VALUES (new.id, 'beginner');
  RETURN new;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();