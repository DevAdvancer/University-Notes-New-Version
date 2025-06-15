
-- Add a permissions column to the profiles table
ALTER TABLE public.profiles 
ADD COLUMN can_create_notes BOOLEAN NOT NULL DEFAULT FALSE;

-- Update the admin user to have create notes permission by default
UPDATE public.profiles 
SET can_create_notes = TRUE 
WHERE role = 'admin';

-- Update the trigger function to automatically give create permission to admins
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, can_create_notes)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    CASE 
      WHEN NEW.email = 'theabhirupkumar@gmail.com' THEN 'admin'
      ELSE 'student'
    END,
    CASE 
      WHEN NEW.email = 'theabhirupkumar@gmail.com' THEN TRUE
      ELSE FALSE
    END
  );
  RETURN NEW;
END;
$$;

-- Update the notes INSERT policy to check permissions
DROP POLICY IF EXISTS "Users can insert own notes" ON public.notes;

CREATE POLICY "Users with permission can insert notes"
  ON public.notes
  FOR INSERT
  WITH CHECK (
    auth.uid() = author_id AND
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE id = auth.uid() AND can_create_notes = TRUE
    )
  );
