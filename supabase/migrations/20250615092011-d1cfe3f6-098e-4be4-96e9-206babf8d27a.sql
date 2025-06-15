
-- Create a security definer function to get user's accessible note IDs
-- This breaks the circular dependency in RLS policies
CREATE OR REPLACE FUNCTION public.get_user_accessible_notes(user_id uuid)
RETURNS TABLE(note_id uuid)
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  -- Return notes the user authored
  SELECT id FROM public.notes WHERE author_id = user_id
  UNION
  -- Return notes the user collaborates on
  SELECT note_id FROM public.note_collaborators WHERE note_collaborators.user_id = user_id;
$$;

-- Drop existing policies that cause recursion
DROP POLICY IF EXISTS "Users can view their own notes and collaborated notes" ON public.notes;
DROP POLICY IF EXISTS "Users can view note collaborators" ON public.note_collaborators;

-- Create new non-recursive policies for notes table
CREATE POLICY "Users can view their own notes"
  ON public.notes
  FOR SELECT
  USING (author_id = auth.uid());

-- Create separate policy for collaborated notes
CREATE POLICY "Users can view collaborated notes"
  ON public.notes
  FOR SELECT
  USING (
    id IN (SELECT note_id FROM public.note_collaborators WHERE user_id = auth.uid())
  );

-- Create new non-recursive policy for note_collaborators
CREATE POLICY "Users can view note collaborators"
  ON public.note_collaborators
  FOR SELECT
  USING (
    user_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.notes WHERE notes.id = note_collaborators.note_id AND notes.author_id = auth.uid())
  );
