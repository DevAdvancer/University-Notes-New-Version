
-- Update the SELECT policy on notes to allow all authenticated users to view all notes
DROP POLICY IF EXISTS "Users can view own notes" ON public.notes;

CREATE POLICY "All authenticated users can view notes"
  ON public.notes
  FOR SELECT
  TO authenticated
  USING (true);
