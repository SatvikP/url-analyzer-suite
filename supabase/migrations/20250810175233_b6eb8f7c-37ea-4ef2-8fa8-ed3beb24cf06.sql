-- Ensure UUID generation is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

-- Create tests table for storing website analysis results
CREATE TABLE IF NOT EXISTS public.tests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  url text NOT NULL,
  score integer NOT NULL CHECK (score >= 0 AND score <= 100),
  analysis text,
  recommendations text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tests ENABLE ROW LEVEL SECURITY;

-- Policies: users can access only their own rows
CREATE POLICY "Users can view their own tests"
ON public.tests FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own tests"
ON public.tests FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tests"
ON public.tests FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tests"
ON public.tests FOR DELETE
USING (auth.uid() = user_id);

-- Helpful index for counting tests per user over time
CREATE INDEX IF NOT EXISTS idx_tests_user_id_created_at
ON public.tests (user_id, created_at DESC);