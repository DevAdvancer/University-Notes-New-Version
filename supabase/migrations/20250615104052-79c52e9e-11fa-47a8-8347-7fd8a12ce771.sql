
-- Drop ALL existing policies on both tables to start fresh
DROP POLICY IF EXISTS "Users can view their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can create their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can update their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can delete their own notes" ON public.notes;
DROP POLICY IF EXISTS "Users can view their own notes and collaborated notes" ON public.notes;
DROP POLICY IF EXISTS "Users can view collaborated notes" ON public.notes;
DROP POLICY IF EXISTS "Authors can update their notes" ON public.notes;
DROP POLICY IF EXISTS "Authors can delete their notes" ON public.notes;
DROP POLICY IF EXISTS "Users can create notes" ON public.notes;

DROP POLICY IF EXISTS "Users can view note collaborators" ON public.note_collaborators;
DROP POLICY IF EXISTS "Users can view note collaborators for their own notes" ON public.note_collaborators;
DROP POLICY IF EXISTS "Users can manage collaborators for their own notes" ON public.note_collaborators;
DROP POLICY IF EXISTS "Authors can manage note collaborators" ON public.note_collaborators;
DROP POLICY IF EXISTS "Note authors can manage collaborators" ON public.note_collaborators;

-- Now create clean, simple policies
CREATE POLICY "Users can view own notes"
  ON public.notes
  FOR SELECT
  USING (author_id = auth.uid());

CREATE POLICY "Users can insert own notes"
  ON public.notes
  FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Users can update own notes"
  ON public.notes
  FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Users can delete own notes"
  ON public.notes
  FOR DELETE
  USING (author_id = auth.uid());

-- Simple collaborators policies
CREATE POLICY "Users can view own note collaborators"
  ON public.note_collaborators
  FOR SELECT
  USING (
    note_id IN (SELECT id FROM public.notes WHERE author_id = auth.uid())
  );

CREATE POLICY "Users can manage own note collaborators"
  ON public.note_collaborators
  FOR ALL
  USING (
    note_id IN (SELECT id FROM public.notes WHERE author_id = auth.uid())
  );
