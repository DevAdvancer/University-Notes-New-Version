
-- Only create the policies that don't exist yet
DO $$ 
BEGIN
    -- Check if RLS is enabled, if not enable it
    IF NOT (SELECT EXISTS (
        SELECT 1 FROM pg_tables 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND rowsecurity = true
    )) THEN
        ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
    END IF;

    -- Create "Users can read all profiles" policy if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE schemaname = 'public' 
        AND tablename = 'profiles' 
        AND policyname = 'Users can read all profiles'
    ) THEN
        CREATE POLICY "Users can read all profiles" ON profiles
          FOR SELECT 
          TO authenticated 
          USING (true);
    END IF;
END $$;
