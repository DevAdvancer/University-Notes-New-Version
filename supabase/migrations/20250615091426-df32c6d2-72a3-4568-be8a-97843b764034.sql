
-- Drop all existing policies on note_collaborators table
DROP POLICY IF EXISTS "Note authors can manage collaborators" ON public.note_collaborators;
DROP POLICY IF EXISTS "Users can view collaborators for notes they have access to" ON public.note_collaborators;
DROP POLICY IF EXISTS "Note authors can manage collaborators" ON public.note_collaborators;

-- Drop all existing policies on notes table
DROP POLICY IF EXISTS "Users can view notes they created or collaborate on" ON public.notes;
DROP POLICY IF EXISTS "Users can create notes" ON public.notes;
DROP POLICY IF EXISTS "Authors can update their notes" ON public.notes;
DROP POLICY IF EXISTS "Authors can delete their notes" ON public.notes;

-- Create simple, non-recursive RLS policies for note_collaborators
CREATE POLICY "Users can view note collaborators"
  ON public.note_collaborators
  FOR SELECT
  USING (
    user_id = auth.uid() OR 
    note_id IN (
      SELECT id FROM public.notes WHERE author_id = auth.uid()
    )
  );

CREATE POLICY "Authors can manage note collaborators"
  ON public.note_collaborators
  FOR ALL
  USING (
    note_id IN (
      SELECT id FROM public.notes WHERE author_id = auth.uid()
    )
  );

-- Create simple RLS policies for notes table
CREATE POLICY "Users can view their own notes and collaborated notes"
  ON public.notes
  FOR SELECT
  USING (
    author_id = auth.uid() OR
    id IN (
      SELECT note_id FROM public.note_collaborators WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own notes"
  ON public.notes
  FOR INSERT
  WITH CHECK (author_id = auth.uid());

CREATE POLICY "Authors can update their own notes"
  ON public.notes
  FOR UPDATE
  USING (author_id = auth.uid());

CREATE POLICY "Authors can delete their own notes"
  ON public.notes
  FOR DELETE
  USING (author_id = auth.uid());
